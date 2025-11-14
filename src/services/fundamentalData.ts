// Fundamental Data Hub
// Economic calendar, earnings, news sentiment

export interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  currency: string;
  impact: 'low' | 'medium' | 'high';
  date: Date;
  time: string;
  actual?: number;
  forecast?: number;
  previous?: number;
  unit?: string;
  description: string;
}

export interface EarningsEvent {
  id: string;
  symbol: string;
  companyName: string;
  date: Date;
  quarter: string;
  estimatedEPS?: number;
  actualEPS?: number;
  revenue?: number;
  revenueEstimate?: number;
  timeOfDay: 'before' | 'after' | 'during';
  webcast?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  url: string;
  publishedAt: Date;
  symbols: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number; // -1 to 1
  impact: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface CompanyFundamentals {
  symbol: string;
  companyName: string;
  marketCap: number;
  peRatio?: number;
  pegRatio?: number;
  priceToBook?: number;
  priceToSales?: number;
  eps: number;
  revenue: number;
  revenueGrowth: number;
  earningsGrowth: number;
  dividendYield?: number;
  debtToEquity?: number;
  returnOnEquity?: number;
  returnOnAssets?: number;
  profitMargin?: number;
  operatingMargin?: number;
  beta: number;
  lastUpdated: Date;
}

export interface SectorData {
  sector: string;
  performance1D: number;
  performance1W: number;
  performance1M: number;
  performance3M: number;
  performance1Y: number;
  topGainers: string[];
  topLosers: string[];
  marketCap: number;
}

export class FundamentalDataManager {
  private economicEvents: EconomicEvent[] = [];
  private earnings: EarningsEvent[] = [];
  private news: NewsItem[] = [];
  private fundamentals: Map<string, CompanyFundamentals> = new Map();
  private sectorData: Map<string, SectorData> = new Map();

  constructor() {
    this.initializeMockData();
  }

  // Economic Calendar
  getEconomicEvents(startDate?: Date, endDate?: Date, impact?: string): EconomicEvent[] {
    let events = [...this.economicEvents];

    if (startDate) {
      events = events.filter(event => event.date >= startDate);
    }
    if (endDate) {
      events = events.filter(event => event.date <= endDate);
    }
    if (impact) {
      events = events.filter(event => event.impact === impact);
    }

    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  getTodaysEconomicEvents(): EconomicEvent[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.getEconomicEvents(today, tomorrow);
  }

  getHighImpactEvents(days: number = 7): EconomicEvent[] {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    return this.getEconomicEvents(startDate, endDate, 'high');
  }

  // Earnings Calendar
  getEarningsEvents(startDate?: Date, endDate?: Date): EarningsEvent[] {
    let events = [...this.earnings];

    if (startDate) {
      events = events.filter(event => event.date >= startDate);
    }
    if (endDate) {
      events = events.filter(event => event.date <= endDate);
    }

    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  getTodaysEarnings(): EarningsEvent[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.getEarningsEvents(today, tomorrow);
  }

  getEarningsForSymbol(symbol: string): EarningsEvent[] {
    return this.earnings.filter(event => event.symbol === symbol);
  }

  // News and Sentiment
  getNews(limit: number = 50, symbols?: string[]): NewsItem[] {
    let news = [...this.news];

    if (symbols && symbols.length > 0) {
      news = news.filter(item => 
        item.symbols.some(symbol => symbols.includes(symbol))
      );
    }

    return news
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, limit);
  }

  getNewsBySentiment(sentiment: 'positive' | 'negative' | 'neutral'): NewsItem[] {
    return this.news.filter(item => item.sentiment === sentiment);
  }

  getNewsForSymbol(symbol: string): NewsItem[] {
    return this.news.filter(item => item.symbols.includes(symbol));
  }

  getMarketSentiment(): { positive: number; negative: number; neutral: number } {
    const total = this.news.length;
    if (total === 0) return { positive: 0, negative: 0, neutral: 0 };

    const positive = this.news.filter(item => item.sentiment === 'positive').length;
    const negative = this.news.filter(item => item.sentiment === 'negative').length;
    const neutral = this.news.filter(item => item.sentiment === 'neutral').length;

    return {
      positive: Math.round((positive / total) * 100),
      negative: Math.round((negative / total) * 100),
      neutral: Math.round((neutral / total) * 100)
    };
  }

  // Company Fundamentals
  getFundamentals(symbol: string): CompanyFundamentals | undefined {
    return this.fundamentals.get(symbol.toUpperCase());
  }

  setFundamentals(symbol: string, data: CompanyFundamentals): void {
    this.fundamentals.set(symbol.toUpperCase(), data);
  }

  // Sector Analysis
  getSectorData(sector?: string): SectorData[] {
    if (sector) {
      const data = this.sectorData.get(sector);
      return data ? [data] : [];
    }
    return Array.from(this.sectorData.values());
  }

  getBestPerformingSectors(period: string = '1D'): SectorData[] {
    const sectors = Array.from(this.sectorData.values());
    const performanceKey = `performance${period}` as keyof SectorData;
    
    return sectors
      .sort((a, b) => (b[performanceKey] as number) - (a[performanceKey] as number))
      .slice(0, 5);
  }

  getWorstPerformingSectors(period: string = '1D'): SectorData[] {
    const sectors = Array.from(this.sectorData.values());
    const performanceKey = `performance${period}` as keyof SectorData;
    
    return sectors
      .sort((a, b) => (a[performanceKey] as number) - (b[performanceKey] as number))
      .slice(0, 5);
  }

  // Analysis Tools
  calculatePEGRatio(symbol: string): number | null {
    const fundamentals = this.getFundamentals(symbol);
    if (!fundamentals || !fundamentals.peRatio || !fundamentals.earningsGrowth) {
      return null;
    }
    return fundamentals.peRatio / fundamentals.earningsGrowth;
  }

  getValueScreener(maxPE?: number, minDividendYield?: number): CompanyFundamentals[] {
    return Array.from(this.fundamentals.values()).filter(company => {
      let passes = true;
      
      if (maxPE && company.peRatio && company.peRatio > maxPE) {
        passes = false;
      }
      
      if (minDividendYield && company.dividendYield && company.dividendYield < minDividendYield) {
        passes = false;
      }
      
      return passes;
    });
  }

  getGrowthScreener(minEarningsGrowth?: number, minRevenueGrowth?: number): CompanyFundamentals[] {
    return Array.from(this.fundamentals.values()).filter(company => {
      let passes = true;
      
      if (minEarningsGrowth && company.earningsGrowth < minEarningsGrowth) {
        passes = false;
      }
      
      if (minRevenueGrowth && company.revenueGrowth < minRevenueGrowth) {
        passes = false;
      }
      
      return passes;
    });
  }

  // Mock Data Initialization
  private initializeMockData() {
    this.generateMockEconomicEvents();
    this.generateMockEarnings();
    this.generateMockNews();
    this.generateMockFundamentals();
    this.generateMockSectorData();
  }

  private generateMockEconomicEvents() {
    const events = [
      {
        id: '1',
        title: 'Non-Farm Payrolls',
        country: 'US',
        currency: 'USD',
        impact: 'high' as const,
        date: new Date(Date.now() + 86400000), // Tomorrow
        time: '08:30',
        actual: undefined,
        forecast: 180000,
        previous: 150000,
        unit: 'jobs',
        description: 'Monthly change in employment in the US'
      },
      {
        id: '2',
        title: 'Federal Reserve Interest Rate Decision',
        country: 'US',
        currency: 'USD',
        impact: 'high' as const,
        date: new Date(Date.now() + 2 * 86400000), // Day after tomorrow
        time: '14:00',
        forecast: 5.25,
        previous: 5.0,
        unit: '%',
        description: 'Federal Reserve monetary policy decision'
      },
      {
        id: '3',
        title: 'CPI (Consumer Price Index)',
        country: 'US',
        currency: 'USD',
        impact: 'high' as const,
        date: new Date(Date.now() + 3 * 86400000),
        time: '08:30',
        forecast: 0.3,
        previous: 0.2,
        unit: '%',
        description: 'Monthly inflation data'
      }
    ];

    this.economicEvents = events;
  }

  private generateMockEarnings() {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
    const earnings = symbols.map((symbol, index) => ({
      id: `earning-${index}`,
      symbol,
      companyName: this.getCompanyName(symbol),
      date: new Date(Date.now() + index * 86400000),
      quarter: 'Q4 2024',
      estimatedEPS: 2.50 + index * 0.5,
      timeOfDay: 'after' as const
    }));

    this.earnings = earnings;
  }

  private generateMockNews() {
    const newsItems = [
      {
        id: '1',
        title: 'Tech Stocks Rally on AI Optimism',
        content: 'Technology stocks surged today as investors showed renewed optimism about artificial intelligence investments...',
        source: 'MarketWatch',
        url: 'https://example.com/news/1',
        publishedAt: new Date(Date.now() - 3600000),
        symbols: ['AAPL', 'GOOGL', 'MSFT'],
        sentiment: 'positive' as const,
        sentimentScore: 0.7,
        impact: 'medium' as const,
        tags: ['technology', 'AI', 'rally']
      },
      {
        id: '2',
        title: 'Federal Reserve Signals Cautious Approach',
        content: 'The Federal Reserve indicated a cautious approach to future rate cuts in their latest statement...',
        source: 'Reuters',
        url: 'https://example.com/news/2',
        publishedAt: new Date(Date.now() - 7200000),
        symbols: [],
        sentiment: 'neutral' as const,
        sentimentScore: 0.0,
        impact: 'high' as const,
        tags: ['fed', 'rates', 'monetary-policy']
      },
      {
        id: '3',
        title: 'Energy Sector Faces Headwinds',
        content: 'Energy companies reported lower than expected earnings as oil prices remained volatile...',
        source: 'Bloomberg',
        url: 'https://example.com/news/3',
        publishedAt: new Date(Date.now() - 10800000),
        symbols: ['XOM', 'CVX'],
        sentiment: 'negative' as const,
        sentimentScore: -0.5,
        impact: 'medium' as const,
        tags: ['energy', 'oil', 'earnings']
      }
    ];

    this.news = newsItems;
  }

  private generateMockFundamentals() {
    const companies = [
      {
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        marketCap: 3000000000000,
        peRatio: 25.5,
        pegRatio: 1.2,
        priceToBook: 5.8,
        eps: 6.05,
        revenue: 383285000000,
        revenueGrowth: 8.2,
        earningsGrowth: 12.5,
        dividendYield: 0.5,
        beta: 1.1,
        profitMargin: 25.3,
        returnOnEquity: 147.4,
        lastUpdated: new Date()
      },
      {
        symbol: 'GOOGL',
        companyName: 'Alphabet Inc.',
        marketCap: 1800000000000,
        peRatio: 22.1,
        pegRatio: 0.9,
        priceToBook: 4.2,
        eps: 5.80,
        revenue: 307400000000,
        revenueGrowth: 15.0,
        earningsGrowth: 18.2,
        beta: 1.3,
        profitMargin: 21.0,
        returnOnEquity: 25.8,
        lastUpdated: new Date()
      }
    ];

    companies.forEach(company => {
      this.fundamentals.set(company.symbol, company);
    });
  }

  private generateMockSectorData() {
    const sectors = [
      {
        sector: 'Technology',
        performance1D: 1.2,
        performance1W: 3.5,
        performance1M: 8.7,
        performance3M: 15.2,
        performance1Y: 28.5,
        topGainers: ['AAPL', 'GOOGL', 'MSFT'],
        topLosers: ['META', 'NFLX'],
        marketCap: 12000000000000
      },
      {
        sector: 'Healthcare',
        performance1D: 0.5,
        performance1W: 1.2,
        performance1M: 4.3,
        performance3M: 7.8,
        performance1Y: 12.1,
        topGainers: ['JNJ', 'PFE'],
        topLosers: ['MRNA'],
        marketCap: 8000000000000
      },
      {
        sector: 'Energy',
        performance1D: -1.8,
        performance1W: -3.2,
        performance1M: -5.6,
        performance3M: 2.1,
        performance1Y: 8.9,
        topGainers: ['XOM'],
        topLosers: ['CVX', 'COP'],
        marketCap: 2500000000000
      }
    ];

    sectors.forEach(sector => {
      this.sectorData.set(sector.sector, sector);
    });
  }

  private getCompanyName(symbol: string): string {
    const companies: { [key: string]: string } = {
      'AAPL': 'Apple Inc.',
      'GOOGL': 'Alphabet Inc.',
      'MSFT': 'Microsoft Corporation',
      'AMZN': 'Amazon.com Inc.',
      'TSLA': 'Tesla Inc.'
    };
    return companies[symbol] || `${symbol} Corporation`;
  }

  // Real-time updates (would connect to actual APIs in production)
  async refreshEconomicData(): Promise<void> {
    console.log('📊 Refreshing economic data...');
    // In production, would fetch from economic data APIs
  }

  async refreshEarningsData(): Promise<void> {
    console.log('💰 Refreshing earnings data...');
    // In production, would fetch from financial data APIs
  }

  async refreshNewsData(): Promise<void> {
    console.log('📰 Refreshing news data...');
    // In production, would fetch from news APIs
  }

  async refreshFundamentals(symbol: string): Promise<void> {
    console.log(`📈 Refreshing fundamentals for ${symbol}...`);
    // In production, would fetch from fundamental data APIs
  }
}

export default FundamentalDataManager;