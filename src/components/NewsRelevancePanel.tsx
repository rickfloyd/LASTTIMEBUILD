import React, { useEffect, useState } from "react";
import { useEntitlements } from "../context/EntitlementsContext";
import { NewsItem, NewsProfile, rankNews } from "../lib/newsFilter";
import { loadNewsProfile, saveNewsItems, saveNewsProfile } from "../services/newsProfileStore";
import { uid as makeId } from "../lib/uid";

export default function NewsRelevancePanel() {
  const { uid } = useEntitlements();
  const [profile, setProfile] = useState<NewsProfile>({ keywords: [], watchlist: [], sourceTrust: {} });
  const [profileJson, setProfileJson] = useState(JSON.stringify(profile, null, 2));

  const [itemsJson, setItemsJson] = useState("[]");
  const [out, setOut] = useState<any>(null);
  const [msg, setMsg] = useState<string|null>(null);

  useEffect(() => {
    (async () => {
      if (!uid) return;
      const p = await loadNewsProfile(uid);
      setProfile(p);
      setProfileJson(JSON.stringify(p, null, 2));
    })();
  }, [uid]);

  async function saveProfile() {
    setMsg(null);
    if (!uid) return setMsg("Sign in first.");
    const p = JSON.parse(profileJson) as NewsProfile;
    await saveNewsProfile(uid, p);
    setProfile(p);
    setMsg("✅ Saved profile.");
  }

  async function ingestAndRank() {
    setMsg(null); setOut(null);
    if (!uid) return setMsg("Sign in first.");
    try {
      const p = JSON.parse(profileJson) as NewsProfile;
      let arr = JSON.parse(itemsJson) as any[];
      if (!Array.isArray(arr)) throw new Error("Items must be array");

      const items: NewsItem[] = arr.map((x:any)=>({ 
        id: x.id ?? makeId(),
        title: String(x.title ?? ""),
        source: String(x.source ?? "unknown"),
        publishedAt: Number(x.publishedAt ?? Date.now()),
        tickers: Array.isArray(x.tickers) ? x.tickers.map(String) : [],
        body: x.body ? String(x.body) : undefined,
      }));

      await saveNewsItems(uid, items);
      const ranked = rankNews(items, p).slice(0, 50).map(r => ({ 
        title: r.item.title, 
        source: r.item.source,
        tickers: r.item.tickers,
        score: r.score.total,
        detail: r.score,
      }));
      setOut(ranked);
      setMsg("✅ Ingested + ranked.");
    } catch (e:any) {
      setMsg(`Rank failed: ${e?.message || "Unknown error"}`);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <div className="text-lg font-semibold text-white">19) News Relevance Filter + Trust Scoring</div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <div className="text-xs text-white/60">Profile JSON (keywords/watchlist/sourceTrust)</div>
          <textarea value={profileJson} onChange={(e)=>setProfileJson(e.target.value)}
            className="mt-1 h-40 w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white/90 outline-none"
          />
          <button onClick={saveProfile} className="mt-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15">
            Save Profile
          </button>
        </div>

        <div>
          <div className="text-xs text-white/60">Items JSON</div>
          <textarea value={itemsJson} onChange={(e)=>setItemsJson(e.target.value)}
            className="mt-1 h-40 w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white/90 outline-none"
          />
          <button onClick={ingestAndRank} className="mt-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15">
            Ingest + Rank
          </button>
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
