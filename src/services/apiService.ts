// Mock API Service - No external API calls

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  timestamp: number;
}

interface NewsItem {
  title: string;
  content: string;
  source: string;
  timestamp: number;
  category?: string;
}

interface CachedData {
  data: unknown;
  timestamp: number;
}

export class APIService {
  private static instance: APIService;
  private dataCache: Map<string, CachedData> = new Map();
  private updateCallbacks: Map<string, (() => void)[]> = new Map();

  private constructor() {}

  static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  // Mock Market Data
  async getTwelveDataQuote(symbol: string): Promise<MarketData> {
    return this.getMockMarketData(symbol);
  }

  async getFinnhubQuote(symbol: string): Promise<MarketData> {
    return this.getMockMarketData(symbol);
  }

  async getAlphaVantageQuote(symbol: string): Promise<MarketData> {
    return this.getMockMarketData(symbol);
  }

  async getPolygonQuote(symbol: string): Promise<MarketData> {
    return this.getMockMarketData(symbol);
  }

  async getCoinGeckoData(coinId: string): Promise<MarketData> {
    return this.getMockCryptoData(coinId);
  }

  // Mock News Data
  async getPersonalityNews(personality: 'republican' | 'democrat' | 'liberal' | 'independent'): Promise<NewsItem[]> {
    return this.getMockNews(personality);
  }

  // Mock Sports Data
  async getNFLData(): Promise<NewsItem[]> {
    return this.getMockSportsData();
  }

  // Mock WebSocket (no real connection)
  connectWebSocket(_endpoint: string, symbol: string, callback: (data: MarketData) => void): void {
    console.log(`Mock WebSocket connection for ${symbol}`);
    // Simulate periodic updates
    setInterval(() => {
      callback(this.getMockMarketData(symbol));
    }, 5000);
  }

  // Subscription Management (mock)
  subscribe(key: string, callback: () => void): void {
    if (!this.updateCallbacks.has(key)) {
      this.updateCallbacks.set(key, []);
    }
    this.updateCallbacks.get(key)?.push(callback);
  }

  unsubscribe(key: string, callback: () => void): void {
    const callbacks = this.updateCallbacks.get(key);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Cache Management
  getCachedData(key: string, maxAge: number = 60000): unknown {
    const cached = this.dataCache.get(key);
    if (cached && (Date.now() - cached.timestamp) < maxAge) {
      return cached.data;
    }
    return null;
  }

  // Mock Data Generators
  private getMockMarketData(symbol: string): MarketData {
    const mockPrices = {
      'AAPL': { price: 182.31, change: 1.24, changePercent: 0.68 },
      'GOOGL': { price: 2847.42, change: -20.85, changePercent: -0.72 },
      'MSFT': { price: 378.85, change: 7.10, changePercent: 1.91 },
      'TSLA': { price: 248.50, change: -8.42, changePercent: -3.28 },
      'AMZN': { price: 3127.78, change: 21.67, changePercent: 0.70 },
      'SPY': { price: 478.25, change: 2.15, changePercent: 0.45 },
      'QQQ': { price: 384.50, change: -1.85, changePercent: -0.48 },
      'DIA': { price: 368.75, change: 3.25, changePercent: 0.89 },
      'IWM': { price: 198.45, change: -0.95, changePercent: -0.48 }
    };

    const baseData = mockPrices[symbol as keyof typeof mockPrices] || {
      price: Math.random() * 1000 + 100,
      change: (Math.random() - 0.5) * 20,
      changePercent: (Math.random() - 0.5) * 5
    };

    // Add small random variations
    const finalPrice = baseData.price + (Math.random() - 0.5) * 2;
    const finalChange = baseData.change + (Math.random() - 0.5) * 0.5;
    
    return {
      symbol,
      price: finalPrice,
      change: finalChange,
      changePercent: (finalChange / finalPrice) * 100,
      volume: Math.floor(Math.random() * 1000000) + 100000,
      high: finalPrice + Math.random() * 10,
      low: finalPrice - Math.random() * 10,
      timestamp: Date.now()
    };
  }

  private getMockCryptoData(coinId: string): MarketData {
    const mockCrypto = {
      'bitcoin': { price: 43250, change: 2.45 },
      'ethereum': { price: 2485, change: 1.85 },
      'binancecoin': { price: 315, change: -0.75 }
    };

    const baseData = mockCrypto[coinId as keyof typeof mockCrypto] || {
      price: Math.random() * 50000,
      change: (Math.random() - 0.5) * 10
    };
    
    return {
      symbol: coinId,
      price: baseData.price,
      change: baseData.change,
      changePercent: (baseData.change / baseData.price) * 100,
      volume: Math.floor(Math.random() * 1000000) + 100000,
      high: baseData.price + Math.random() * 1000,
      low: baseData.price - Math.random() * 1000,
      timestamp: Date.now()
    };
  }

  private getMockNews(personality: string): NewsItem[] {
    const mockNews = {
      republican: [
        { title: 'Market Rally Continues Amid Economic Growth', category: 'Business', time: '2 min ago' },
        { title: 'Federal Reserve Policy Impact on Trading', category: 'Politics', time: '15 min ago' },
        { title: 'Conservative Investment Strategies Outperform', category: 'Finance', time: '30 min ago' },
        { title: 'Traditional Energy Stocks Surge', category: 'Energy', time: '45 min ago' }
      ],
      democrat: [
        { title: 'Green Energy Stocks Surge on Climate Policy', category: 'Environment', time: '5 min ago' },
        { title: 'Social Impact Investing Trends', category: 'Politics', time: '20 min ago' },
        { title: 'Healthcare Sector Shows Strong Growth', category: 'Healthcare', time: '35 min ago' },
        { title: 'Education Technology Investments Rise', category: 'Technology', time: '50 min ago' }
      ],
      liberal: [
        { title: 'Global Markets React to Social Policies', category: 'World', time: '8 min ago' },
        { title: 'Progressive Economic Indicators', category: 'Politics', time: '25 min ago' },
        { title: 'Sustainable Finance Initiatives Expand', category: 'Sustainability', time: '40 min ago' },
        { title: 'Worker Cooperative Investments Grow', category: 'Labor', time: '55 min ago' }
      ],
      independent: [
        { title: 'Unbiased Market Analysis Report', category: 'Business', time: '3 min ago' },
        { title: 'Global Economic Outlook', category: 'World', time: '18 min ago' },
        { title: 'Balanced Portfolio Strategies', category: 'Investment', time: '33 min ago' },
        { title: 'Market Volatility Analysis', category: 'Analysis', time: '48 min ago' }
      ]
    };

    const mockNewsData = mockNews[personality as keyof typeof mockNews] || mockNews.independent;
    
    // Transform to NewsItem format
    return mockNewsData.map((item, index) => ({
      title: item.title,
      content: `${item.title} - Full article content would be here...`,
      source: 'News Source',
      timestamp: Date.now() - (index + 1) * 300000,
      category: item.category
    }));
  }

  private getMockSportsData(): NewsItem[] {
    const sportsData = [
      { homeTeam: 'Chiefs', awayTeam: 'Bills', homeScore: 24, awayScore: 21, status: 'Final' },
      { homeTeam: 'Cowboys', awayTeam: 'Giants', homeScore: 17, awayScore: 14, status: 'Q4' },
      { homeTeam: 'Patriots', awayTeam: 'Jets', homeScore: 20, awayScore: 17, status: 'Final' },
      { homeTeam: '49ers', awayTeam: 'Rams', homeScore: 28, awayScore: 21, status: 'Final' }
    ];
    
    return sportsData.map((game, index) => ({
      title: `${game.homeTeam} vs ${game.awayTeam}`,
      content: `${game.homeTeam} ${game.homeScore} - ${game.awayScore} ${game.awayTeam} (${game.status})`,
      source: 'Sports Network',
      timestamp: Date.now() - (index + 1) * 600000,
      category: 'Sports'
    }));
  }

  // Cleanup (mock)
  disconnect(): void {
    console.log('Mock API service disconnected');
    this.updateCallbacks.clear();
  }
}