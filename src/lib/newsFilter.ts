export type NewsItem = {
  id: string;
  title: string;
  source: string;
  publishedAt: number;
  tickers: string[];
  body?: string;
};

export type NewsProfile = {
  keywords: string[];
  watchlist: string[];
  sourceTrust: Record<string, number>; // 0..1
};

function scoreText(item: NewsItem, profile: NewsProfile) {
  const hay = (item.title + " " + (item.body ?? "")).toLowerCase();
  let kwScore = 0;
  for (const k of profile.keywords) {
    if (!k.trim()) continue;
    if (hay.includes(k.toLowerCase())) kwScore += 1;
  }

  const wlScore = item.tickers.some(t => profile.watchlist.includes(t)) ? 2 : 0;
  const trust = profile.sourceTrust[item.source] ?? 0.5;

  return { kwScore, wlScore, trust, total: (kwScore + wlScore) * trust };
}

export function rankNews(items: NewsItem[], profile: NewsProfile) {
  return items
    .map(i => ({ item: i, score: scoreText(i, profile) }))
    .sort((a,b)=>b.score.total - a.score.total);
}
