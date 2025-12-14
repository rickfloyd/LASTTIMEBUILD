import axios from 'axios';
import apiKeys from '../config';

const FRED_BASE_URL = 'https://api.stlouisfed.org/fred';

class FredService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get observations for a FRED series
   * @param seriesId The ID of the series (e.g., 'GNPCA')
   */
  async getSeries(seriesId: string) {
    try {
      const response = await axios.get(`${FRED_BASE_URL}/series/observations`, {
        params: {
          series_id: seriesId,
          api_key: this.apiKey,
          file_type: 'json'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('FRED API Error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch FRED series ${seriesId}`);
    }
  }
}

export default new FredService(apiKeys.FRED_API_KEY);
