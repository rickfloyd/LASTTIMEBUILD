import axios from 'axios';
import apiKeys from '../config';

const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co';

class StocksService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get a quote for a stock symbol
   * @param symbol The stock symbol (e.g., 'AAPL')
   */
  async getQuote(symbol: string) {
    try {
      const response = await axios.get(`${ALPHA_VANTAGE_BASE_URL}/query`, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol,
          apikey: this.apiKey
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Alpha Vantage API Error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch quote for ${symbol}`);
    }
  }
}

export default new StocksService(apiKeys.ALPHAVANTAGE_API_KEY_PRIMARY);
