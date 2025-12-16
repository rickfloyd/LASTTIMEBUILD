import { useState } from "react";
import { resolveSymbol } from "../services/symbolResolver";

export default function SymbolSearch() {
  const [q, setQ] = useState("");
  const [result, setResult] = useState<any>(null);

  async function search() {
    const r = await resolveSymbol(q);
    setResult(r);
  }

  return (
    <div className="p-4 bg-black rounded-xl border border-white/10">
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search symbol"
        className="w-full bg-black text-white border p-2 rounded"
      />
      <button onClick={search} className="mt-2 w-full bg-white/10 text-white p-2 rounded">
        Resolve
      </button>
      {result && <pre className="text-xs text-white mt-2">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
