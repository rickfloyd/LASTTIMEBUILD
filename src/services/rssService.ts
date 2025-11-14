import Parser from 'rss-parser';

export type RSSItem = {
  title: string;
  link: string;
  pubDate?: string;
  source?: string;
  category?: string;
};

type CacheEntry<T> = { data: T; timestamp: number };

class RSSService {
  private static instance: RSSService;
  private parser: Parser;
  private cache = new Map<string, CacheEntry<RSSItem[]>>();
  private ttlMs = 10 * 60 * 1000; // 10 minutes

  // Map UI categories to RSS feeds
  private CATEGORY_FEEDS: Record<string, string[]> = {
    'financial-instruments-markets': [
      'https://www.investopedia.com/feedbuilder/feed/getfeed/?feedName=investing',
      'https://www.marketwatch.com/feeds/topstories',
    ],
    'charting-analysis-tools': [
      'https://www.tradingview.com/blog/en/rss/',
    ],
    'market-data-prices': [
      'https://www.investing.com/rss/news_25.rss',
      'https://www.reuters.com/markets/feeds/rss',
    ],
    'trading-ideas-analysis': [
      'https://seekingalpha.com/market_currents.xml',
    ],
    'technical-indicators-scripts': [
      'https://www.tradingview.com/blog/en/rss/'
    ],
    'stock-categories': [
      'https://feeds.finance.yahoo.com/rss/2.0/headline?s=AAPL,MSFT,GOOGL&region=US&lang=en-US'
    ],
    'cryptocurrency-categories': [
      'https://www.coindesk.com/arc/outboundfeeds/rss/'
    ],
    'economic-data': [
      'https://fredblog.stlouisfed.org/feed/'
    ],
  };

  private constructor() {
    this.parser = new Parser({
      headers: {
        'User-Agent': 'AIQuantumCharts/1.0 (RSS aggregator)'
      }
    });
  }

  static getInstance(): RSSService {
    if (!this.instance) this.instance = new RSSService();
    return this.instance;
  }

  private isFresh(key: string): boolean {
    const hit = this.cache.get(key);
    return !!hit && Date.now() - hit.timestamp < this.ttlMs;
  }

  private setCache(key: string, data: RSSItem[]) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async fetchFeed(url: string): Promise<RSSItem[]> {
    try {
      const feed = await this.parser.parseURL(url);
      return (feed.items || []).map((i) => ({
        title: i.title || '',
        link: i.link || '',
        pubDate: i.isoDate || i.pubDate,
        source: (feed.title || '').trim(),
      }));
    } catch (e) {
      console.warn('RSS fetch failed for', url, e);
      return [];
    }
  }

  async getByCategory(category: string, limit = 30): Promise<RSSItem[]> {
    const key = `cat:${category}:${limit}`;
    if (this.isFresh(key)) return this.cache.get(key)!.data;

    const feeds = this.CATEGORY_FEEDS[category] || [];
    const results = await Promise.all(feeds.map((f) => this.fetchFeed(f)));
    const merged = results.flat().sort((a, b) => {
      const ta = a.pubDate ? new Date(a.pubDate).getTime() : 0;
      const tb = b.pubDate ? new Date(b.pubDate).getTime() : 0;
      return tb - ta;
    }).slice(0, limit);

    this.setCache(key, merged);
    return merged;
  }

  async getSymbolNews(symbol: string, limit = 20): Promise<RSSItem[]> {
    const key = `sym:${symbol}:${limit}`;
    if (this.isFresh(key)) return this.cache.get(key)!.data;

    // Yahoo Finance symbol feed
    const yahoo = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${encodeURIComponent(symbol)}&region=US&lang=en-US`;
    const items = await this.fetchFeed(yahoo);
    const out = items.slice(0, limit);
    this.setCache(key, out);
    return out;
  }
}

export default RSSService;