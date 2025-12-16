import { Router } from "express";
import Parser from "rss-parser";

export const newsRouter = Router();
const parser = new Parser();

// Curated starter list (business/markets/trading). You can edit anytime.
const FEEDS: Record<string, string> = {
  reuters_markets: "https://www.reuters.com/markets/rss",
  cnbc_top: "https://www.cnbc.com/id/100003114/device/rss/rss.html",
  marketwatch: "https://feeds.marketwatch.com/marketwatch/topstories/",
  investing: "https://www.investing.com/rss/news.rss",
  wsj_markets: "https://feeds.a.dj.com/rss/RSSMarketsMain.xml",
  ft_markets: "https://www.ft.com/markets?format=rss",
  seekingalpha: "https://seekingalpha.com/market_currents.xml",
  fed_speeches: "https://www.federalreserve.gov/feeds/speeches.xml",
  sec_press: "https://www.sec.gov/news/pressreleases.rss"
};

newsRouter.get("/feeds", (_req, res) => {
  res.json({ ok: true, feeds: FEEDS });
});

// GET /api/news?feed=reuters_markets
newsRouter.get("/", async (req, res) => {
  try {
    const feedKey = String(req.query.feed || "");
    if (!feedKey || !FEEDS[feedKey]) {
      return res.status(400).json({
        ok: false,
        error: "Invalid feed. Use /api/news/feeds to see available keys."
      });
    }

    const url = FEEDS[feedKey];
    const data = await parser.parseURL(url);

    const items = (data.items || []).slice(0, 25).map((it) => ({
      title: it.title || "",
      link: it.link || "",
      pubDate: it.pubDate || it.isoDate || "",
      source: feedKey
    }));

    res.json({ ok: true, feed: feedKey, items });
  } catch (err: any) {
    res.status(500).json({
      ok: false,
      error: "Failed to fetch RSS feed",
      details: err?.message || String(err)
    });
  }
});
