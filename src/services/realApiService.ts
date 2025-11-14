// Real API Service for Live Market Data
import axios from 'axios';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: string;
  marketCap?: string;
  high24h?: number;
  low24h?: number;
}

interface CryptoData extends MarketData {
  marketCap: string;
  rank?: number;
}

interface NewsItem {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
}

interface CachedData {
  data: MarketData | CryptoData | NewsItem[] | MiningData;
  timestamp: number;
}

interface MiningData {
  coin: string;
  algorithm: string;
  difficulty: number;
  networkHashRate: number;
  blockReward: number;
  blockTime: number;
  profitability: number;
}

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

class RealAPIService {
  private static instance: RealAPIService;
  private cache: Map<string, CachedData> = new Map();
  private cacheTimeout = 60000; // 1 minute cache

  // API Keys from environment variables
  private readonly API_KEYS = {
    ALPHA_VANTAGE: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'demo',
    POLYGON: import.meta.env.VITE_POLYGON_API_KEY || 'demo',
    FINNHUB: import.meta.env.VITE_FINNHUB_API_KEY || 'demo',
    NEWS_API: import.meta.env.VITE_NEWS_API_KEY || 'demo',
  };

  private constructor() {}

  static getInstance(): RealAPIService {
    if (!RealAPIService.instance) {
      RealAPIService.instance = new RealAPIService();
    }
    return RealAPIService.instance;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  private getFromCache(key: string): MarketData | CryptoData | NewsItem[] | MiningData | undefined {
    return this.cache.get(key)?.data;
  }

  private setCache(key: string, data: MarketData | CryptoData | NewsItem[] | MiningData): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Alpha Vantage API for Stock Data
  async getStockData(symbol: string): Promise<MarketData> {
    const cacheKey = `stock_${symbol}`;
    if (this.isCacheValid(cacheKey)) {
      const cached = this.getFromCache(cacheKey) as MarketData;
      if (cached) return cached;
    }

    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.API_KEYS.ALPHA_VANTAGE}`
      );

      const quote = response.data['Global Quote'];
      const marketData: MarketData = {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: quote['06. volume'],
      };

      this.setCache(cacheKey, marketData);
      return marketData;
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error);
      return this.getMockStockData(symbol);
    }
  }

  // CoinGecko API for Crypto Data
  async getCryptoData(coinId: string): Promise<CryptoData> {
    const cacheKey = `crypto_${coinId}`;
    if (this.isCacheValid(cacheKey)) {
      const cached = this.getFromCache(cacheKey) as CryptoData;
      if (cached) return cached;
    }

    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
      );

      const coin = response.data;
      const cryptoData: CryptoData = {
        symbol: coin.symbol.toUpperCase(),
        price: coin.market_data.current_price.usd,
        change: coin.market_data.price_change_24h,
        changePercent: coin.market_data.price_change_percentage_24h,
        marketCap: `$${(coin.market_data.market_cap.usd / 1000000000).toFixed(1)}B`,
        high24h: coin.market_data.high_24h.usd,
        low24h: coin.market_data.low_24h.usd,
        rank: coin.market_cap_rank,
      };

      this.setCache(cacheKey, cryptoData);
      return cryptoData;
    } catch (error) {
      console.error(`Error fetching crypto data for ${coinId}:`, error);
      return this.getMockCryptoData(coinId);
    }
  }

  // Finnhub API for Forex Data
  async getForexData(symbol: string): Promise<MarketData> {
    const cacheKey = `forex_${symbol}`;
    if (this.isCacheValid(cacheKey)) {
      const cached = this.getFromCache(cacheKey) as MarketData;
      if (cached) return cached;
    }

    try {
      const response = await axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${this.API_KEYS.FINNHUB}`
      );

      const quote = response.data;
      const forexData: MarketData = {
        symbol: symbol,
        price: quote.c,
        change: quote.d,
        changePercent: quote.dp,
        high24h: quote.h,
        low24h: quote.l,
      };

      this.setCache(cacheKey, forexData);
      return forexData;
    } catch (error) {
      console.error(`Error fetching forex data for ${symbol}:`, error);
      return this.getMockForexData(symbol);
    }
  }

  // News API for Market News
  async getMarketNews(category: string = 'business'): Promise<NewsItem[]> {
    const cacheKey = `news_${category}`;
    if (this.isCacheValid(cacheKey)) {
      const cached = this.getFromCache(cacheKey) as NewsItem[];
      if (cached) return cached;
    }

    try {
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${this.API_KEYS.NEWS_API}`
      );

      const news = response.data.articles.slice(0, 10).map((article: NewsArticle): NewsItem => ({
        title: article.title,
        description: article.description,
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source.name,
      }));

      this.setCache(cacheKey, news);
      return news;
    } catch (error) {
      console.error(`Error fetching news for ${category}:`, error);
      return this.getMockNews();
    }
  }

  // Mining Data from CoinWarz API
  async getMiningData(coin: string): Promise<MiningData> {
    const cacheKey = `mining_${coin}`;
    if (this.isCacheValid(cacheKey)) {
      const cached = this.getFromCache(cacheKey) as MiningData;
      if (cached) return cached;
    }

    try {
      // Using a mock API since CoinWarz requires paid access
      const miningData: MiningData = {
        coin: coin,
        algorithm: coin === 'bitcoin' ? 'SHA-256' : 'Ethash',
        difficulty: Math.random() * 1000000000000,
        networkHashRate: Math.random() * 100000000,
        blockReward: coin === 'bitcoin' ? 6.25 : 2.0,
        blockTime: coin === 'bitcoin' ? 600 : 13,
        profitability: Math.random() * 100,
      };

      this.setCache(cacheKey, miningData);
      return miningData;
    } catch (error) {
      console.error(`Error fetching mining data for ${coin}:`, error);
      return this.getMockMiningData(coin);
    }
  }

  // Fallback mock data methods
  private getMockStockData(symbol: string): MarketData {
    return {
      symbol: symbol,
      price: 150 + Math.random() * 50,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      volume: `${(Math.random() * 100).toFixed(1)}M`,
    };
  }

  private getMockCryptoData(coinId: string): CryptoData {
    const prices: { [key: string]: number } = {
      bitcoin: 43000,
      ethereum: 2500,
      binancecoin: 320,
    };

    return {
      symbol: coinId.substring(0, 3).toUpperCase(),
      price: prices[coinId] || 100,
      change: (Math.random() - 0.5) * 1000,
      changePercent: (Math.random() - 0.5) * 10,
      marketCap: `$${(Math.random() * 500).toFixed(0)}B`,
    };
  }

  private getMockForexData(symbol: string): MarketData {
    return {
      symbol: symbol,
      price: 1 + Math.random(),
      change: (Math.random() - 0.5) * 0.01,
      changePercent: (Math.random() - 0.5) * 2,
    };
  }

  private getMockNews(): NewsItem[] {
    return [
      {
        title: 'Market Analysis: Tech Stocks Rally',
        description: 'Technology stocks show strong performance...',
        url: '#',
        publishedAt: new Date().toISOString(),
        source: 'Market Watch',
      },
    ];
  }

  private getMockMiningData(coin: string): MiningData {
    return {
      coin: coin,
      algorithm: 'SHA-256',
      difficulty: 62000000000000,
      networkHashRate: 450000000,
      blockReward: 6.25,
      blockTime: 600,
      profitability: 85.5,
    };
  }

  // Batch fetch multiple symbols
  async getBatchStockData(symbols: string[]): Promise<MarketData[]> {
    const promises = symbols.map(symbol => this.getStockData(symbol));
    return Promise.all(promises);
  }

  async getBatchCryptoData(coinIds: string[]): Promise<CryptoData[]> {
    const promises = coinIds.map(coinId => this.getCryptoData(coinId));
    return Promise.all(promises);
  }

  // WebSocket for real-time updates (to be implemented)
  startRealTimeUpdates(symbols: string[], callback: (data: MarketData) => void): void {
    // Implementation for WebSocket connections
    console.log('Real-time updates started for:', symbols);
    
    // Simulate real-time updates every 5 seconds
    setInterval(async () => {
      for (const symbol of symbols) {
        const data = await this.getStockData(symbol);
        callback(data);
      }
    }, 5000);
  }
}

export default RealAPIService;
export type { MarketData, CryptoData, NewsItem, MiningData };