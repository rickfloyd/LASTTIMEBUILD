import { useEffect, useState } from "react";

type NewsItem = { title: string; link: string; pubDate?: string; source?: string };

export default function QuantumNews({ symbol }: { symbol: string }) {
  const [items, setItems] = useState<NewsItem[]>([]);
  useEffect(() => {
    fetch(`/api/rss/symbol/${encodeURIComponent(symbol)}`)
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, [symbol]);
  return (
    <div className="bg-black text-pink-400 p-4 rounded-2xl">
      <h2 className="text-xl mb-2">News & Fundamentals – {symbol}</h2>
      {items.slice(0, 5).map((n, i) => (
        <div key={i} className="mb-2 border-b border-pink-700 pb-1">
          <a href={n.link} target="_blank" rel="noreferrer">{n.title}</a>
          {n.source ? <div className="text-xs text-pink-600">{n.source}</div> : null}
        </div>
      ))}
    </div>
  );
}
