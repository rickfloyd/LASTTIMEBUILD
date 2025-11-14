import { useState } from "react";

export default function FormulaEnginePanel() {
  const [instruction, setInstruction] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runFormula = async () => {
    setLoading(true);
    // Example payload, replace with real data
    const payload = {
      instruction,
      data: [] // TODO: provide actual market data
    };
    const res = await fetch("/api/formula/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    setResults(json.matches || []);
    setLoading(false);
  };

  return (
    <div className="bg-black text-cyan-400 p-4 rounded-2xl">
      <h2 className="text-xl mb-2">Natural-Language Formula Engine</h2>
      <input
        className="w-full p-2 mb-2 rounded bg-gray-900 text-white"
        placeholder="e.g. RSI below 30, EMA cross"
        value={instruction}
        onChange={e => setInstruction(e.target.value)}
      />
      <button
        className="bg-cyan-600 text-white px-4 py-2 rounded"
        onClick={runFormula}
        disabled={loading}
      >Run</button>
      <div className="mt-4">
        {loading ? <div>Loading...</div> : results.length > 0 ? (
          <ul>
            {results.map((r, i) => (
              <li key={i} className="border-b border-cyan-700 py-1 text-xs">{JSON.stringify(r)}</li>
            ))}
          </ul>
        ) : <div className="text-gray-400">No matches</div>}
      </div>
    </div>
  );
}
