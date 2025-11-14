import { useEffect, useState } from 'react';

type RSSItem = { title: string; link: string; pubDate?: string; source?: string };

export default function CategoryFeeds({ category }: { category: string }) {
  const [items, setItems] = useState<RSSItem[]>([]);
  useEffect(() => {
    fetch(`/api/rss/category/${encodeURIComponent(category)}?limit=20`)
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, [category]);
  return (
    <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
      <h3 className="text-white font-semibold mb-3">Latest: {category.replace(/-/g, ' ')}</h3>
      <ul className="space-y-2">
        {items.map((i, idx) => (
          <li key={idx} className="text-sm">
            <a className="text-cyan-300 hover:underline" href={i.link} target="_blank" rel="noreferrer">
              {i.title}
            </a>
            {i.source ? <span className="text-gray-500 ml-2">· {i.source}</span> : null}
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-gray-400">No items yet.</li>
        )}
      </ul>
    </div>
  );
}