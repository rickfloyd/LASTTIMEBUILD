import React, { useState } from "react";
import { Candle } from "../types/marketData";
import { runMicroSmaCross } from "../lib/microBacktest";

function parseCandles(raw: string): Candle[] {
  const arr = JSON.parse(raw);
  if (!Array.isArray(arr)) throw new Error("Candles must be array");
  return arr.map((c:any)=>({t:+c.t,o:+c.o,h:+c.h,l:+c.l,c:+c.c,v:c.v==null?undefined:+c.v})).sort((a,b)=>a.t-b.t);
}

export default function MicroBacktestPanel() {
  const [candlesJson, setCandlesJson] = useState("[]");
  const [fast, setFast] = useState(10);
  const [slow, setSlow] = useState(30);
  const [spread, setSpread] = useState(0.0002);
  const [slip, setSlip] = useState(0.00005);
  const [comm, setComm] = useState(0.0);

  const [msg, setMsg] = useState<string|null>(null);
  const [res, setRes] = useState<any>(null);

  function run() {
    setMsg(null); setRes(null);
    try {
      const candles = parseCandles(candlesJson);
      const r = runMicroSmaCross(candles, fast, slow, {
        spread, slippage: slip, commissionPerTrade: comm
      });
      setRes(r);
      setMsg("✅ Microstructure backtest complete (spread/slippage/commission + deterministic fills).");
    } catch (e:any) {
      setMsg(`Run failed: ${e?.message || "Unknown error"}`);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <div className="text-lg font-semibold text-white">15) Microstructure Backtest Engine</div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-6">
        <Field label="Fast" value={String(fast)} onChange={(v)=>setFast(parseInt(v||"10",10))}/>
        <Field label="Slow" value={String(slow)} onChange={(v)=>setSlow(parseInt(v||"30",10))}/>
        <Field label="Spread" value={String(spread)} onChange={(v)=>setSpread(parseFloat(v||"0"))}/>
        <Field label="Slippage" value={String(slip)} onChange={(v)=>setSlip(parseFloat(v||"0"))}/>
        <Field label="Commission" value={String(comm)} onChange={(v)=>setComm(parseFloat(v||"0"))}/>
        <button onClick={run} className="mt-5 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15">
          Run
        </button>
      </div>

      <div className="mt-3 text-xs text-white/60">Candles JSON</div>
      <textarea value={candlesJson} onChange={(e)=>setCandlesJson(e.target.value)}
        className="mt-1 h-36 w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white/90 outline-none"
      />

      {msg && <div className="mt-3 text-sm text-white/80">{msg}</div>}

      {res && (
        <pre className="mt-3 max-h-64 overflow-auto rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white/80">
{JSON.stringify({ netPnl: res.netPnl, trades: res.trades, winRate: res.winRate, maxDrawdown: res.maxDrawdown, events: res.events.slice(0,60) }, null, 2)}
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
