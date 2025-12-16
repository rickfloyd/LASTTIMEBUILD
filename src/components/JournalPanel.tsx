import React, { useState } from "react";
import { useEntitlements } from "../context/EntitlementsContext";
import { addJournalEntry, addJournalTrade, loadStats, recomputeStats } from "../services/journalStore";

export default function JournalPanel() {
  const { uid } = useEntitlements();

  // entry
  const [symbolE, setSymbolE] = useState("EURUSD");
  const [tagsE, setTagsE] = useState("breakout,trend");
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState<string|null>(null);

  // trade
  const [symbolT, setSymbolT] = useState("EURUSD");
  const [side, setSide] = useState<"LONG"|"SHORT">("LONG");
  const [entry, setEntry] = useState("1.0000");
  const [exit, setExit] = useState("1.0050");
  const [qty, setQty] = useState("1");
  const [tagsT, setTagsT] = useState("breakout");

  const [stats, setStats] = useState<any>(null);

  async function addEntry() {
    setMsg(null);
    if (!uid) return setMsg("Sign in first.");
    await addJournalEntry(uid, {
      symbol: symbolE,
      setupTags: tagsE.split(",").map(s=>s.trim()).filter(Boolean),
      notes,
    });
    setNotes("");
    setMsg("✅ Saved journal entry.");
  }

  async function addTrade() {
    setMsg(null);
    if (!uid) return setMsg("Sign in first.");
    await addJournalTrade(uid, {
      symbol: symbolT,
      side,
      entry: Number(entry),
      exit: Number(exit),
      qty: Number(qty),
      setupTags: tagsT.split(",").map(s=>s.trim()).filter(Boolean),
    });
    setMsg("✅ Saved journal trade.");
  }

  async function refreshStats() {
    setMsg(null);
    if (!uid) return setMsg("Sign in first.");
    const s = await recomputeStats(uid);
    setStats(s);
    setMsg("✅ Recomputed stats.");
  }

  async function load() {
    setMsg(null);
    if (!uid) return setMsg("Sign in first.");
    const s = await loadStats(uid);
    setStats(s);
    setMsg("Loaded stats.");
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <div className="text-lg font-semibold text-white">26) Trade Journal + Analytics Warehouse</div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/60 p-3">
          <div className="text-sm font-semibold text-white">Journal Entry</div>
          <Field label="Symbol" value={symbolE} onChange={setSymbolE}/>
          <Field label="Tags (comma)" value={tagsE} onChange={setTagsE}/>
          <div className="mt-2">
            <div className="text-xs text-white/60">Notes</div>
            <textarea value={notes} onChange={(e)=>setNotes(e.target.value)}
              className="mt-1 h-28 w-full rounded-xl border border-white/10 bg-black/70 p-3 text-sm text-white outline-none"
            />
          </div>
          <button onClick={addEntry}
            className="mt-3 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15"
          >
            Save Entry
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/60 p-3">
          <div className="text-sm font-semibold text-white">Trade</div>

          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            <Field label="Symbol" value={symbolT} onChange={setSymbolT}/>
            <Select label="Side" value={side} options={["LONG","SHORT"]} onChange={(v)=>setSide(v as any)}/>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
            <Field label="Entry" value={entry} onChange={setEntry}/>
            <Field label="Exit" value={exit} onChange={setExit}/>
            <Field label="Qty" value={qty} onChange={setQty}/>
          </div>

          <Field label="Tags (comma)" value={tagsT} onChange={setTagsT}/>

          <button onClick={addTrade}
            className="mt-3 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15"
          >
            Save Trade
          </button>

          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={load}
              className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
            >
              Load Stats
            </button>
            <button onClick={refreshStats}
              className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
            >
              Recompute Stats
            </button>
          </div>

          {stats && (
            <pre className="mt-3 max-h-48 overflow-auto rounded-xl border border-white/10 bg-black/70 p-3 text-xs text-white/80">
{JSON.stringify(stats, null, 2)}
            </pre>
          )}
        </div>
      </div>

      {msg && <div className="mt-3 text-sm text-white/80">{msg}</div>}
    </div>
  );
}

function Field(props:{label:string; value:string; onChange:(v:string)=>void}) {
  return (
    <div className="mt-2">
      <div className="text-xs text-white/60">{props.label}</div>
      <input value={props.value} onChange={(e)=>props.onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none"
      />
    </div>
  );
}

function Select(props:{label:string; value:string; options:string[]; onChange:(v:string)=>void}) {
  return (
    <div className="mt-2">
      <div className="text-xs text-white/60">{props.label}</div>
      <select value={props.value} onChange={(e)=>props.onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none"
      >
        {props.options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
