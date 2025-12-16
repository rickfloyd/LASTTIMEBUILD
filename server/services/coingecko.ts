import axios from 'axios';
import apiKeys from '../config';

const COINGECKO_BASE_URL = 'https://pro-api.coingecko.com/api/v3';

export interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  image?: string;
}

export interface MarketChart {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

class CoinGeckoService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getAuthHeaders() {
    return {
      'x-cg-pro-api-key': this.apiKey
    };
  }

  /**
   * Get current prices for multiple cryptocurrencies
   */
  async getPrices(coinIds: string[] = ['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana']): Promise<CoinPrice[]> {
    try {
      const response = await axios.get(`${COINGECKO_BASE_URL}/coins/markets`, {
        headers: this.getAuthHeaders(),
        params: {
          vs_currency: 'usd',
          ids: coinIds.join(','),
          order: 'market_cap_desc',
          per_page: 250,
          sparkline: false
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('CoinGecko API Error:', error.message);
      throw new Error('Failed to fetch crypto prices from CoinGecko');
    }
  }

  /**
   * Get trending coins
   */
  async getTrending() {
    try {
      const response = await axios.get(`${COINGECKO_BASE_URL}/search/trending`, { headers: this.getAuthHeaders() });
      return response.data.coins;
    } catch (error: any) {
      console.error('CoinGecko Trending Error:', error.message);
      throw new Error('Failed to fetch trending coins');
    }
  }

  /**
   * Get market chart data for a specific coin
   */
  async getMarketChart(coinId: string, days: number = 7): Promise<MarketChart> {
    try {
      const response = await axios.get(`${COINGECKO_BASE_URL}/coins/${coinId}/market_chart`, {
        headers: this.getAuthHeaders(),
        params: {
          vs_currency: 'usd',
          days: days
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('CoinGecko Market Chart Error:', error.message);
      throw new Error(`Failed to fetch market chart for ${coinId}`);
    }
  }

  /**
   * Get detailed coin information
   */
  async getCoinDetails(coinId: string) {
    try {
      const response = await axios.get(`${COINGECKO_BASE_URL}/coins/${coinId}`, {
        headers: this.getAuthHeaders(),
        params: {
          localization: false,
          tickers: false,
          community_data: false,
          developer_data: false
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('CoinGecko Coin Details Error:', error.message);
      throw new Error(`Failed to fetch details for ${coinId}`);
    }
  }

  /**
   * Search for coins
   */
  async searchCoins(query: string) {
    try {
      const response = await axios.get(`${COINGECKO_BASE_URL}/search`, {
        headers: this.getAuthHeaders(),
        params: { query }
      });
      return response.data.coins;
    } catch (error: any) {
      console.error('CoinGecko Search Error:', error.message);
      throw new Error('Failed to search coins');
    }
  }
}

export default new CoinGeckoService(apiKeys.COINGECKO_API_KEY);
