import { useEffect, useState } from "react";
import { subscribeOrderBook } from "../services/orderbook";

export default function DepthHeatmap({ symbol }: { symbol: string }) {
  const [levels, setLevels] = useState<any[]>([]);

  useEffect(() => {
    return subscribeOrderBook(symbol, (data) => {
      setLevels(data[0]?.data || []);
    });
  }, [symbol]);

  return (
    <div className="bg-black border border-white/10 rounded-xl p-3">
      <div className="text-white text-sm mb-2">Order Book Heatmap</div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {levels.map((l, i) => (
          <div key={i} className="flex justify-between">
            <span>{l.price}</span>
            <span className="text-cyan-400">{l.size}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
