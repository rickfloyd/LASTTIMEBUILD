import axios from 'axios';

const BINANCE_BASE_URL = 'https://api.binance.com/api/v3';

export interface BinanceTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  lastPrice: string;
  volume: string;
  quoteVolume: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
}

export interface BinanceKline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
}

class BinanceService {
  /**
   * Get 24h price ticker for a symbol
   * FREE - No authentication required for public data
   */
  async getTicker(symbol: string = 'BTCUSDT'): Promise<BinanceTicker> {
    try {
      const response = await axios.get(`${BINANCE_BASE_URL}/ticker/24hr`, {
        params: { symbol: symbol.toUpperCase() }
      });
      return response.data;
    } catch (error: any) {
      console.error('Binance Ticker Error:', error.message);
      throw new Error(`Failed to fetch ticker for ${symbol}`);
    }
  }

  /**
   * Get all 24h price tickers
   * FREE - No authentication required
   */
  async getAllTickers(): Promise<BinanceTicker[]> {
    try {
      const response = await axios.get(`${BINANCE_BASE_URL}/ticker/24hr`);
      return response.data;
    } catch (error: any) {
      console.error('Binance All Tickers Error:', error.message);
      throw new Error('Failed to fetch all tickers');
    }
  }

  /**
   * Get current price for a symbol
   * FREE - No authentication required
   */
  async getPrice(symbol: string = 'BTCUSDT') {
    try {
      const response = await axios.get(`${BINANCE_BASE_URL}/ticker/price`, {
        params: { symbol: symbol.toUpperCase() }
      });
      return response.data;
    } catch (error: any) {
      console.error('Binance Price Error:', error.message);
      throw new Error(`Failed to fetch price for ${symbol}`);
    }
  }

  /**
   * Get kline/candlestick data
   * FREE - No authentication required
   */
  async getKlines(symbol: string, interval: string = '1h', limit: number = 100): Promise<BinanceKline[]> {
    try {
      const response = await axios.get(`${BINANCE_BASE_URL}/klines`, {
        params: {
          symbol: symbol.toUpperCase(),
          interval,
          limit
        }
      });
      
      // Transform raw data into structured format
      return response.data.map((kline: any[]) => ({
        openTime: kline[0],
        open: kline[1],
        high: kline[2],
        low: kline[3],
        close: kline[4],
        volume: kline[5],
        closeTime: kline[6]
      }));
    } catch (error: any) {
      console.error('Binance Klines Error:', error.message);
      throw new Error(`Failed to fetch klines for ${symbol}`);
    }
  }

  /**
   * Get top trading pairs by volume
   * FREE - No authentication required
   */
  async getTopPairs(limit: number = 20) {
    try {
      const allTickers = await this.getAllTickers();
      
      // Filter USDT pairs and sort by volume
      const usdtPairs = allTickers
        .filter(ticker => ticker.symbol.endsWith('USDT'))
        .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
        .slice(0, limit);
      
      return usdtPairs;
    } catch (error: any) {
      console.error('Binance Top Pairs Error:', error.message);
      throw new Error('Failed to fetch top trading pairs');
    }
  }

  /**
   * Get exchange info (trading rules, symbols)
   * FREE - No authentication required
   */
  async getExchangeInfo() {
    try {
      const response = await axios.get(`${BINANCE_BASE_URL}/exchangeInfo`);
      return response.data;
    } catch (error: any) {
      console.error('Binance Exchange Info Error:', error.message);
      throw new Error('Failed to fetch exchange info');
    }
  }
}

export default new BinanceService();
