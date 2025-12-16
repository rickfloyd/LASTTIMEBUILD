import React, { useState } from "react";
import { useEntitlements } from "../context/EntitlementsContext";
import { runScan, ScanRule } from "../lib/scanner";
import { parseRows, saveScan, saveScanRun } from "../services/scansStore";

export default function ScannerPanel() {
  const { uid } = useEntitlements();
  const [name, setName] = useState("My Scan");
  const [rulesJson, setRulesJson] = useState(`[{"kind":"PRICE_GT","value":1.0},{"kind":"CHANGE_PCT_GT","value":0.5}]`);
  const [rowsJson, setRowsJson] = useState(`[]`);
  const [msg, setMsg] = useState<string|null>(null);
  const [out, setOut] = useState<any>(null);

  async function run() {
    setMsg(null); setOut(null);
    if (!uid) return setMsg("Sign in first.");
    try {
      const rules = JSON.parse(rulesJson) as ScanRule[];
      const rows = parseRows(rowsJson);
      const results = runScan(rows, rules);
      const matched = results.filter(r => r.matched);
      const def = await saveScan(uid, { name, rules });
      await saveScanRun(uid, { scanId: def.id, at: Date.now(), matched, total: rows.length });
      setOut({ scanId: def.id, matchedCount: matched.length, matched: matched.slice(0,100) });
      setMsg("✅ Scan ran + stored result.");
    } catch (e:any) {
      setMsg(`Scan failed: ${e?.message || "Unknown error"}`);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <div className="text-lg font-semibold text-white">18) Scanner Engine + Rule Builder</div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div>
          <div className="text-xs text-white/60">Scan Name</div>
          <input value={name} onChange={(e)=>setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none"
          />
        </div>
        <button onClick={run} className="mt-5 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15">
          Run Scan
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <div className="text-xs text-white/60">Rules JSON</div>
          <textarea value={rulesJson} onChange={(e)=>setRulesJson(e.target.value)}
            className="mt-1 h-32 w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white/90 outline-none"
          />
        </div>
        <div>
          <div className="text-xs text-white/60">Rows JSON</div>
          <textarea value={rowsJson} onChange={(e)=>setRowsJson(e.target.value)}
            className="mt-1 h-32 w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white/90 outline-none"
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
