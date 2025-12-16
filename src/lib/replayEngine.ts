ONE SHARED CORE (Create these first)
✅ Create: src/lib/cryptoHash.ts
export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(hash);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

export function stableStringify(obj: any): string {
  const seen = new WeakSet();
  return JSON.stringify(obj, function (key, value) {
    if (value && typeof value === "object") {
      if (seen.has(value)) return;
      seen.add(value);
      if (Array.isArray(value)) return value;
      return Object.keys(value).sort().reduce((acc: any, k) => (acc[k] = (value as any)[k], acc), {});
    }
    return value;
  });
}

✅ Create: src/lib/downloadJson.ts
export function downloadJson(filename: string, data: any) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

✅ Create: src/lib/uid.ts
export function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

11) Indicator repainting → Non-Repaint Proof Mode + Signal Receipts
Firestore

users/{uid}/private/indicator_receipts/{receiptId} immutable

✅ Create: src/types/indicators.ts
import { Candle } from "./marketData";

export type IndicatorDefinition = {
  id: string;              // indicator id (stable)
  version: string;         // immutable version hash/id
  name: string;
  settingsSchema: any;     // json schema-like (light)
  createdAt: number;
};

export type IndicatorRunInput = {
  symbol: string;
  timeframe: string;
  candles: Candle[];
  settings: Record<string, any>;
  proofMode: boolean; // true = only use info available at candle close
};

export type IndicatorSignal = {
  t: number;
  kind: "BUY" | "SELL" | "INFO";
  price?: number;
  label: string;
};

export type IndicatorReceipt = {
  id: string; // receiptId
  symbol: string;
  timeframe: string;

  indicatorId: string;
  indicatorVersion: string;

  datasetHash: string;
  settingsHash: string;

  generatedAt: number;
  proofMode: boolean;

  signals: IndicatorSignal[];
};

✅ Create: src/lib/indicatorNonRepaint.ts
import { Candle } from "../types/marketData";
import { IndicatorSignal } from "../types/indicators";

function sma(values: number[], period: number): number | null {
  if (values.length < period) return null;
  let sum = 0;
  for (let i = values.length - period; i < values.length; i++) sum += values[i];
  return sum / period;
}

/**
 * Deterministic, non-repaint SMA cross signals.
 * proofMode = only confirm on candle close using historical data only.
 */
export function smaCrossSignals(params: {
  candles: Candle[];
  fast: number;
  slow: number;
  proofMode: boolean;
}): IndicatorSignal[] {
  const candles = params.candles.slice().sort((a, b) => a.t - b.t);
  const closes: number[] = [];
  const signals: IndicatorSignal[] = [];

  for (let i = 0; i < candles.length; i++) {
    const c = candles[i];
    closes.push(c.c);

    const f = sma(closes, params.fast);
    const s = sma(closes, params.slow);
    if (f == null || s == null) continue;

    const prevCloses = closes.slice(0, closes.length - 1);
    const pf = sma(prevCloses, params.fast);
    const ps = sma(prevCloses, params.slow);
    if (pf == null || ps == null) continue;

    // Crosses are only confirmed at the close of candle i (no future peek)
    const crossedUp = pf <= ps && f > s;
    const crossedDown = pf >= ps && f < s;

    if (crossedUp) signals.push({ t: c.t, kind: "BUY", price: c.c, label: "SMA Cross Up" });
    if (crossedDown) signals.push({ t: c.t, kind: "SELL", price: c.c, label: "SMA Cross Down" });

    // proofMode does not change this logic because it never uses future data.
    // (For other indicators you would explicitly avoid forward-looking references here.)
  }

  return signals;
}

✅ Create: src/services/indicatorReceipts.ts
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { sha256Hex, stableStringify } from "../lib/cryptoHash";
import { uid } from "../lib/uid";
import { IndicatorReceipt, IndicatorRunInput } from "../types/indicators";
import { smaCrossSignals } from "../lib/indicatorNonRepaint";

export async function runAndStoreSmaCrossReceipt(uidUser: string, input: IndicatorRunInput) {
  const datasetHash = await sha256Hex(stableStringify(input.candles));
  const settingsHash = await sha256Hex(stableStringify(input.settings));

  const indicatorId = "SMA_CROSS";
  const indicatorVersion = await sha256Hex(stableStringify({
    algo: "smaCrossSignals",
    v: 1,
  }));

  const signals = smaCrossSignals({
    candles: input.candles,
    fast: Number(input.settings.fast ?? 10),
    slow: Number(input.settings.slow ?? 30),
    proofMode: input.proofMode,
  });

  const receipt: IndicatorReceipt = {
    id: uid(),
    symbol: input.symbol,
    timeframe: input.timeframe,
    indicatorId,
    indicatorVersion,
    datasetHash,
    settingsHash,
    generatedAt: Date.now(),
    proofMode: input.proofMode,
    signals,
  };

  await setDoc(doc(db, `users/${uidUser}/private/indicator_receipts/${receipt.id}`), receipt, { merge: false });
  return receipt;
}

export async function loadReceipt(uidUser: string, receiptId: string) {
  const snap = await getDoc(doc(db, `users/${uidUser}/private/indicator_receipts/${receiptId}`));
  return snap.exists() ? (snap.data() as IndicatorReceipt) : null;
}

✅ Create: src/components/ProofModeIndicatorPanel.tsx
import React, { useState } from "react";
import { useEntitlements } from "../context/EntitlementsContext";
import { Candle } from "../types/marketData";
import { runAndStoreSmaCrossReceipt } from "../services/indicatorReceipts";

function parseCandles(raw: string): Candle[] {
  const arr = JSON.parse(raw);
  if (!Array.isArray(arr)) throw new Error("Candles must be an array");
  return arr.map((c: any) => ({ t:+c.t, o:+c.o, h:+c.h, l:+c.l, c:+c.c, v: c.v==null?undefined:+c.v }));
}

export default function ProofModeIndicatorPanel() {
  const { uid } = useEntitlements();
  const [symbol, setSymbol] = useState("EURUSD");
  const [timeframe, setTimeframe] = useState("1m");
  const [fast, setFast] = useState(10);
  const [slow, setSlow] = useState(30);
  const [proofMode, setProofMode] = useState(true);
  const [candlesJson, setCandlesJson] = useState("[]");

  const [msg, setMsg] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<any>(null);

  async function run() {
    setMsg(null);
    setReceipt(null);
    if (!uid) return setMsg("Sign in first.");
    try {
      const candles = parseCandles(candlesJson).sort((a,b)=>a.t-b.t);
      const r = await runAndStoreSmaCrossReceipt(uid, {
        symbol, timeframe, candles,
        settings: { fast, slow },
        proofMode,
      });
      setReceipt(r);
      setMsg("✅ Proof receipt stored (non-repaint).");
    } catch (e: any) {
      setMsg(`Run failed: ${e?.message || "Unknown error"}`);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <div className="text-lg font-semibold text-white">11) Proof Mode (Non-Repaint) + Receipts</div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-6">
        <Field label="Symbol" value={symbol} onChange={setSymbol} />
        <Field label="TF" value={timeframe} onChange={setTimeframe} />
        <Field label="Fast" value={String(fast)} onChange={(v)=>setFast(parseInt(v||"10",10))} />
        <Field label="Slow" value={String(slow)} onChange={(v)=>setSlow(parseInt(v||"30",10))} />
        <Toggle label="Proof Mode" on={proofMode} setOn={setProofMode} />
        <button onClick={run} className="mt-5 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15">
          Run + Store
        </button>
      </div>

      <div className="mt-3 text-xs text-white/60">Candles JSON</div>
      <textarea value={candlesJson} onChange={(e)=>setCandlesJson(e.target.value)}
        className="mt-1 h-36 w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white/90 outline-none"
      />

      {msg && <div className="mt-3 text-sm text-white/80">{msg}</div>}

      {receipt && (
        <pre className="mt-3 max-h-64 overflow-auto rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white/80">
{JSON.stringify({ id: receipt.id, datasetHash: receipt.datasetHash, settingsHash: receipt.settingsHash, signals: receipt.signals.slice(0,50) }, null, 2)}
        </pre>
      )}
    </div>
  );
}

function Field(props:{label:string; value:string; onChange:(v:string)=>void}) {
  return (
    <div>
      <div className="text-xs text-white/60">{props.label}</div>
      <input value={props.value} onChange={(e)=>props.onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none"
      />
    </div>
  );
}

function Toggle(props:{label:string; on:boolean; setOn:(v:boolean)=>void}) {
  return (
    <button type="button" onClick={()=>props.setOn(!props.on)}
      className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-black/60 px-3 py-2"
    >
      <span className="text-sm text-white/80">{props.label}</span>
      <span className={`rounded-lg px-2 py-1 text-xs font-semibold ${props.on ? "bg-white/15 text-white":"bg-black/40 text-white/60"}`}>
        {props.on ? "ON":"OFF"}
      </span>
    </button>
  );
}

12) Sessions/Timezones confusion → Session Normalization Layer
✅ Create: src/lib/sessions.ts
export type SessionProfile = {
  id: string;                 // e.g. "FX_24x5"
  displayName: string;
  timezone: string;           // informational (real tz math comes later)
  openDays: number[];         // 0=Sun..6=Sat
  openHourUTC: number;        // simplistic baseline
  closeHourUTC: number;
  notes: string;
};

export const SESSION_PROFILES: SessionProfile[] = [
  { id:"FX_24x5", displayName:"Forex 24x5", timezone:"UTC", openDays:[1,2,3,4,5], openHourUTC:0, closeHourUTC:24, notes:"Market open Mon–Fri (retail conventions vary by broker)." },
  { id:"CRYPTO_24x7", displayName:"Crypto 24x7", timezone:"UTC", openDays:[0,1,2,3,4,5,6], openHourUTC:0, closeHourUTC:24, notes:"Always on." },
  { id:"US_RTH", displayName:"US Stocks RTH", timezone:"America/New_York", openDays:[1,2,3,4,5], openHourUTC:14, closeHourUTC:21, notes:"RTH baseline. Add ETH later." },
];

export function getProfile(id: string) {
  return SESSION_PROFILES.find(p => p.id === id) ?? SESSION_PROFILES[0];
}

✅ Create: src/components/SessionProfilePanel.tsx
import React, { useMemo, useState } from "react";
import { SESSION_PROFILES, getProfile } from "../lib/sessions";

export default function SessionProfilePanel() {
  const [profileId, setProfileId] = useState("FX_24x5");

  const p = useMemo(() => getProfile(profileId), [profileId]);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <div className="text-lg font-semibold text-white">12) Session Normalization Layer</div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div>
          <div className="text-xs text-white/60">Session Profile</div>
          <select value={profileId} onChange={(e)=>setProfileId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none"
          >
            {SESSION_PROFILES.map(s => <option key={s.id} value={s.id}>{s.displayName}</option>)}
          </select>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/60 p-3">
          <div className="text-xs text-white/60">Timezone</div>
          <div className="text-sm text-white">{p.timezone}</div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/60 p-3">
          <div className="text-xs text-white/60">UTC Hours</div>
          <div className="text-sm text-white">{p.openHourUTC}:00 → {p.closeHourUTC}:00</div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/80">
        {p.notes}
        <div className="mt-2 text-xs text-white/60">
          This module standardizes your app’s “market hours view” so candle differences become explainable (profile mismatch is visible).
        </div>
      </div>
    </div>
  );
}
import { Candle } from "../types/marketData";

export type ReplayState = {
  index: number;
  playing: boolean;
  speedMs: number;
};

export class ReplayEngine {
  private candles: Candle[] = [];
  private state: ReplayState = { index: 0, playing: false, speedMs: 300 };
  private timer: any = null;
  private onTick?: (c: Candle, state: ReplayState) => void;

  load(candles: Candle[]) {
    this.stop();
    this.candles = candles.slice().sort((a, b) => a.t - b.t);
    this.state = { index: 0, playing: false, speedMs: this.state.speedMs };
  }

  subscribe(fn: (c: Candle, state: ReplayState) => void) {
    this.onTick = fn;
  }

  setSpeed(ms: number) {
    this.state.speedMs = Math.max(30, ms);
    if (this.state.playing) {
      this.stop();
      this.play();
    }
  }

  play() {
    if (this.state.playing) return;
    this.state.playing = true;
    this.timer = setInterval(() => this.step(), this.state.speedMs);
  }

  stop() {
    this.state.playing = false;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  reset() {
    this.stop();
    this.state.index = 0;
  }

  step() {
    if (!this.candles.length) return;
    if (this.state.index >= this.candles.length) {
      this.stop();
      return;
    }
    const c = this.candles[this.state.index];
    this.onTick?.(c, { ...this.state });
    this.state.index++;
  }

  getWindow(count: number) {
    const start = Math.max(0, this.state.index - count);
    return this.candles.slice(start, this.state.index);
  }

  getState() {
    return { ...this.state };
  }
}
