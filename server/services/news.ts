import axios from 'axios';
import apiKeys from '../config';

const NEWSDATA_BASE_URL = 'https://newsdata.io/api/1';

class NewsService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get latest news
   * @param q The query to search for
   */
  async getNews(q: string = 'market') {
    try {
      const response = await axios.get(`${NEWSDATA_BASE_URL}/news`, {
        params: {
          apikey: this.apiKey,
          q
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('NewsData.io API Error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch news for ${q}`);
    }
  }
}

export default new NewsService(apiKeys.NEWSDATA_API_KEY);
