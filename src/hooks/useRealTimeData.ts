import { useState, useEffect, useRef } from 'react';
import RealAPIService, { MarketData, CryptoData, NewsItem } from '../services/realApiService';

interface UseRealTimeDataOptions {
  symbols?: string[];
  cryptoIds?: string[];
  updateInterval?: number;
  enabled?: boolean;
}

interface RealTimeDataState {
  stockData: { [symbol: string]: MarketData };
  cryptoData: { [coinId: string]: CryptoData };
  news: NewsItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const useRealTimeData = (options: UseRealTimeDataOptions = {}) => {
  const {
    symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA'],
    cryptoIds = ['bitcoin', 'ethereum', 'binancecoin'],
    updateInterval = 30000, // 30 seconds
    enabled = true
  } = options;

  const [data, setData] = useState<RealTimeDataState>({
    stockData: {},
    cryptoData: {},
    news: [],
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const apiService = useRef(RealAPIService.getInstance());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStockData = async () => {
    try {
      const stockPromises = symbols.map(symbol => 
        apiService.current.getStockData(symbol)
      );
      const stockResults = await Promise.all(stockPromises);
      
      const stockDataMap: { [symbol: string]: MarketData } = {};
      stockResults.forEach((data, index) => {
        stockDataMap[symbols[index]] = data;
      });

      return stockDataMap;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return {};
    }
  };

  const fetchCryptoData = async () => {
    try {
      const cryptoPromises = cryptoIds.map(coinId => 
        apiService.current.getCryptoData(coinId)
      );
      const cryptoResults = await Promise.all(cryptoPromises);
      
      const cryptoDataMap: { [coinId: string]: CryptoData } = {};
      cryptoResults.forEach((data, index) => {
        cryptoDataMap[cryptoIds[index]] = data;
      });

      return cryptoDataMap;
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return {};
    }
  };

  const fetchNews = async () => {
    try {
      return await apiService.current.getMarketNews('business');
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  };

  const fetchAllData = async () => {
    if (!enabled) return;

    setData(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [stockData, cryptoData, news] = await Promise.all([
        fetchStockData(),
        fetchCryptoData(),
        fetchNews()
      ]);

      setData({
        stockData,
        cryptoData,
        news,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (error) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }));
    }
  };

  const refreshData = () => {
    fetchAllData();
  };

  const startRealTimeUpdates = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      fetchAllData();
    }, updateInterval);
  };

  const stopRealTimeUpdates = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchAllData();
      startRealTimeUpdates();
    }

    return () => {
      stopRealTimeUpdates();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, updateInterval, JSON.stringify(symbols), JSON.stringify(cryptoIds)]);

  return {
    ...data,
    refreshData,
    startRealTimeUpdates,
    stopRealTimeUpdates,
    isRealTimeActive: intervalRef.current !== null,
  };
};

// Hook for individual asset data
export const useAssetData = (symbol: string, type: 'stock' | 'crypto' = 'stock') => {
  const [data, setData] = useState<MarketData | CryptoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiService = useRef(RealAPIService.getInstance());

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      let result;
      if (type === 'stock') {
        result = await apiService.current.getStockData(symbol);
      } else {
        result = await apiService.current.getCryptoData(symbol);
      }
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, type]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
  };
};

// Hook for market news
export const useMarketNews = (category: string = 'business') => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiService = useRef(RealAPIService.getInstance());

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.current.getMarketNews(category);
      setNews(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return {
    news,
    loading,
    error,
    refresh: fetchNews,
  };
};