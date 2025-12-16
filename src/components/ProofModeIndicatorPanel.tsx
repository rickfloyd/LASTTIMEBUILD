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
