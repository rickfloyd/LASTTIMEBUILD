import React, { useState } from "react";
import { useEntitlements } from "../context/EntitlementsContext";
import { Candle } from "../types/marketData";
import { CorpActions } from "../types/corpActions";
import { applySplitAdjustments } from "../lib/adjustmentEngine";
import { loadCorpActions, saveCorpActions } from "../services/corpActionsStore";

function parseCandles(raw: string): Candle[] {
  const arr = JSON.parse(raw);
  if (!Array.isArray(arr)) throw new Error("Candles must be an array");
  return arr.map((c:any)=>({t:+c.t,o:+c.o,h:+c.h,l:+c.l,c:+c.c,v:c.v==null?undefined:+c.v})).sort((a,b)=>a.t-b.t);
}

export default function AdjustmentEnginePanel() {
  const { uid } = useEntitlements();
  const [symbol, setSymbol] = useState("AAPL");
  const [mode, setMode] = useState<"RAW"|"SPLIT_ADJ">("RAW");
  const [candlesJson, setCandlesJson] = useState("[]");
  const [actionsJson, setActionsJson] = useState(`{"symbol":"AAPL","splits":[],"updatedAt":0}`);
  const [out, setOut] = useState<any>(null);
  const [msg, setMsg] = useState<string|null>(null);

  async function saveActions() {
    setMsg(null);
    if (!uid) return setMsg("Sign in first.");
    const actions = JSON.parse(actionsJson) as CorpActions;
    actions.symbol = symbol;
    actions.updatedAt = Date.now();
    await saveCorpActions(uid, actions);
    setMsg("✅ Saved corporate actions.");
  }

  async function loadActions() {
    setMsg(null);
    if (!uid) return setMsg("Sign in first.");
    const a = await loadCorpActions(uid, symbol);
    setActionsJson(JSON.stringify(a ?? { symbol, splits: [], updatedAt: 0 }, null, 2));
    setMsg(a ? "Loaded." : "No actions found; created empty.");
  }

  function compute() {
    setMsg(null);
    try {
      const candles = parseCandles(candlesJson);
      const actions = JSON.parse(actionsJson) as CorpActions;
      const series = mode === "RAW" ? candles : applySplitAdjustments(candles, actions);
      setOut(series.slice(-50));
      setMsg("✅ Computed.");
    } catch (e:any) {
      setMsg(`Compute failed: ${e?.message || "Unknown error"}`);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <div className="text-lg font-semibold text-white">13) Adjustment Engine (Raw vs Split-Adjusted)</div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-5">
        <Field label="Symbol" value={symbol} onChange={setSymbol}/>
        <div>
          <div className="text-xs text-white/60">Mode</div>
          <select value={mode} onChange={(e)=>setMode(e.target.value as any)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none"
          >
            <option value="RAW">RAW</option>
            <option value="SPLIT_ADJ">SPLIT_ADJ</option>
          </select>
        </div>
        <button onClick={loadActions} className="mt-5 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15">Load Actions</button>
        <button onClick={saveActions} className="mt-5 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15">Save Actions</button>
        <button onClick={compute} className="mt-5 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15">Compute</button>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <div className="text-xs text-white/60">Candles JSON</div>
          <textarea value={candlesJson} onChange={(e)=>setCandlesJson(e.target.value)}
            className="mt-1 h-40 w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white/90 outline-none"
          />
        </div>
        <div>
          <div className="text-xs text-white/60">Corp Actions JSON (splits)</div>
          <textarea value={actionsJson} onChange={(e)=>setActionsJson(e.target.value)}
            className="mt-1 h-40 w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white/90 outline-none"
          />
        </div>
      </div>

      {msg && <div className="mt-3 text-sm text-white/80">{msg}</div>}

      {out && (
        <pre className="mt-3 max-h-64 overflow-auto rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white/80">
{JSON.stringify(out, null, 2)}
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
