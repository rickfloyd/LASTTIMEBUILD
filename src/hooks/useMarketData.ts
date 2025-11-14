import { useState, useEffect, useCallback, useMemo } from 'react';

interface MarketDataItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: number;
  positive: boolean;
  volume?: string;
  marketCap?: string;
  color: string;
}

interface UseMarketDataReturn {
  data: MarketDataItem[];
  loading: boolean;
  error: string | null;
  refreshData: () => void;
  connectRealTime: (symbol: string) => void;
  disconnectRealTime: (symbol: string) => void;
}

export const useMarketData = (symbols: string[] = []): UseMarketDataReturn => {
  const [data, setData] = useState<MarketDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const colors = useMemo(() => [
    'fluorescent-pink',
    'fluorescent-blue', 
    'electric-orange',
    'pulsing-cyan',
    'neon-green',
    'electric-purple'
  ], []);

  const generateMockData = useCallback((symbol: string, index: number): MarketDataItem => {
    const mockPrices = {
      'AAPL': { price: 182.31, change: 1.24 },
      'GOOGL': { price: 2847.42, change: -0.85 },
      'MSFT': { price: 378.85, change: 2.10 },
      'TSLA': { price: 248.50, change: -3.42 },
      'AMZN': { price: 3127.78, change: 0.67 },
      'SPY': { price: 478.25, change: 0.45 },
      'QQQ': { price: 384.50, change: -0.48 },
      'DIA': { price: 368.75, change: 0.89 },
      'IWM': { price: 198.45, change: -0.48 }
    };

    const baseData = mockPrices[symbol as keyof typeof mockPrices] || {
      price: Math.random() * 1000 + 100,
      change: (Math.random() - 0.5) * 5
    };

    // Add small random variations
    const currentPrice = baseData.price + (Math.random() - 0.5) * 5;
    const currentChange = baseData.change + (Math.random() - 0.5) * 1;

    return {
      symbol: symbol.toUpperCase(),
      name: `${symbol.toUpperCase()} Corp.`,
      price: `$${currentPrice.toFixed(2)}`,
      change: `${currentChange >= 0 ? '+' : ''}${currentChange.toFixed(2)}%`,
      changePercent: currentChange,
      positive: currentChange >= 0,
      volume: `${(Math.random() * 100).toFixed(1)}M`,
      color: colors[index % colors.length]
    };
  }, [colors]);

  const fetchMarketData = useCallback(async () => {
    if (symbols.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockData = symbols.map((symbol, index) => 
        generateMockData(symbol, index)
      );

      setData(mockData);
    } catch (err) {
      setError('Failed to fetch market data');
      console.error('Market data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [symbols, generateMockData]);

  const refreshData = useCallback(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  const connectRealTime = useCallback((symbol: string) => {
    console.log(`Mock real-time connection for ${symbol}`);
    // Simulate real-time updates
    const interval = setInterval(() => {
      setData(prevData => 
        prevData.map(item => {
          if (item.symbol === symbol.toUpperCase()) {
            const index = prevData.findIndex(d => d.symbol === symbol.toUpperCase());
            return generateMockData(symbol, index);
          }
          return item;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [generateMockData]);

  const disconnectRealTime = useCallback((symbol: string) => {
    console.log(`Mock disconnect real-time data for ${symbol}`);
  }, []);

  useEffect(() => {
    if (symbols.length > 0) {
      fetchMarketData();
      
      // Set up periodic refresh every 30 seconds
      const interval = setInterval(fetchMarketData, 30000);
      
      return () => clearInterval(interval);
    }
  }, [fetchMarketData, symbols]);

  return {
    data,
    loading,
    error,
    refreshData,
    connectRealTime,
    disconnectRealTime
  };
};