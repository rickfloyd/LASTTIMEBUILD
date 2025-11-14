import axios from 'axios';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

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
  /**
   * Get current prices for multiple cryptocurrencies
   * FREE - Unlimited requests
   */
  async getPrices(coinIds: string[] = ['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana']): Promise<CoinPrice[]> {
    try {
      const response = await axios.get(`${COINGECKO_BASE_URL}/coins/markets`, {
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
   * Get trending coins (top 7 trending coins on CoinGecko)
   * FREE - Unlimited requests
   */
  async getTrending() {
    try {
      const response = await axios.get(`${COINGECKO_BASE_URL}/search/trending`);
      return response.data.coins;
    } catch (error: any) {
      console.error('CoinGecko Trending Error:', error.message);
      throw new Error('Failed to fetch trending coins');
    }
  }

  /**
   * Get market chart data for a specific coin
   * FREE - Unlimited requests
   */
  async getMarketChart(coinId: string, days: number = 7): Promise<MarketChart> {
    try {
      const response = await axios.get(`${COINGECKO_BASE_URL}/coins/${coinId}/market_chart`, {
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
   * FREE - Unlimited requests
   */
  async getCoinDetails(coinId: string) {
    try {
      const response = await axios.get(`${COINGECKO_BASE_URL}/coins/${coinId}`, {
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
   * FREE - Unlimited requests
   */
  async searchCoins(query: string) {
    try {
      const response = await axios.get(`${COINGECKO_BASE_URL}/search`, {
        params: { query }
      });
      return response.data.coins;
    } catch (error: any) {
      console.error('CoinGecko Search Error:', error.message);
      throw new Error('Failed to search coins');
    }
  }
}

export default new CoinGeckoService();
