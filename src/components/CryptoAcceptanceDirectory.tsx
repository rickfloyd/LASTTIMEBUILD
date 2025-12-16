import { useEffect, useState } from "react";
import { subscribeCryptoMerchants, reportMerchant } from "../services/cryptoDirectory";

export default function CryptoAcceptanceDirectory() {
  const [rows, setRows] = useState<any[]>([]);
  const [filterCoin, setFilterCoin] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    return subscribeCryptoMerchants(setRows);
  }, []);

  const filtered = rows.filter(r =>
    (!filterCoin || r.coins.includes(filterCoin)) &&
    (!filterCategory || r.category === filterCategory)
  );

  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="text-2xl font-bold text-white mb-4">
        Crypto Acceptance Directory
      </div>

      <div className="flex gap-2 mb-4">
        <select onChange={e=>setFilterCoin(e.target.value)}
          className="bg-black border p-2 text-white">
          <option value="">All Coins</option>
          <option>BTC</option>
          <option>ETH</option>
          <option>USDC</option>
          <option>USDT</option>
          <option>SOL</option>
        </select>

        <select onChange={e=>setFilterCategory(e.target.value)}
          className="bg-black border p-2 text-white">
          <option value="">All Categories</option>
          <option>Retail</option>
          <option>Travel</option>
          <option>Software</option>
          <option>Luxury</option>
          <option>Services</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(m => (
          <div key={m.id}
            className="border border-white/10 rounded-xl p-4 bg-black/40">
            <div className="text-lg text-white font-semibold">{m.name}</div>
            <a href={m.website} target="_blank"
              className="text-cyan-400 text-sm">{m.website}</a>

            <div className="text-xs text-white/70 mt-1">
              Category: {m.category}
            </div>

            <div className="text-xs text-white/70">
              Coins: {m.coins.join(", ")}
            </div>

            <div className="text-xs text-white/70">
              Acceptance: {m.acceptanceType}
              {m.processor && ` (${m.processor})`}
            </div>

            <div className="text-xs text-white/50 mt-1">
              Verified via: {m.verifiedSource}
            </div>

            <button
              onClick={()=>reportMerchant(m.id,"SCAM","Suspicious activity")}
              className="mt-2 text-xs text-red-400 underline">
              Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
