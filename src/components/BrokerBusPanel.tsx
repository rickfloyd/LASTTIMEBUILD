import React, { useState } from "react";
import { useEntitlements } from "../context/EntitlementsContext";
import { placeOrder } from "../services/brokerBus";

export default function BrokerBusPanel() {
  const { uid } = useEntitlements();
  const [broker, setBroker] = useState("SANDBOX");
  const [symbol, setSymbol] = useState("EURUSD");
  const [qty, setQty] = useState(1);
  const [side, setSide] = useState<"BUY"|"SELL">("BUY");
  const [type, setType] = useState<"MARKET"|"LIMIT"|"STOP">("MARKET");
  const [msg, setMsg] = useState<string|null>(null);
  const [out, setOut] = useState<any>(null);

  async function submit() {
    setMsg(null); setOut(null);
    if (!uid) return setMsg("Sign in first.");
    const rec = await placeOrder(uid, broker, { symbol, qty, side, type });
    setOut(rec);
    setMsg("✅ Order trace written to Firestore (orders + order_events).");
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <div className="text-lg font-semibold text-white">14) Broker Adapter Bus + Order Trace</div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-6">
        <Field label="Broker" value={broker} onChange={setBroker}/>
        <Field label="Symbol" value={symbol} onChange={setSymbol}/>
        <Field label="Qty" value={String(qty)} onChange={(v)=>setQty(parseInt(v||"1",10))}/>
        <Select label="Side" value={side} options={["BUY","SELL"]} onChange={(v)=>setSide(v as any)}/>
        <Select label="Type" value={type} options={["MARKET","LIMIT","STOP"]} onChange={(v)=>setType(v as any)}/>
        <button onClick={submit} className="mt-5 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15">
          Place Order
        </button>
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
function Select(props:{label:string; value:string; options:string[]; onChange:(v:string)=>void}) {
  return (
    <div>
      <div className="text-xs text-white/60">{props.label}</div>
      <select value={props.value} onChange={(e)=>props.onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none"
      >
        {props.options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
