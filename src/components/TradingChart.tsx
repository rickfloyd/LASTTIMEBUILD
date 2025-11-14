import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickData, IChartApi } from 'lightweight-charts';
import { BarChart3, TrendingUp, Activity, Settings, RefreshCw, Database, Wifi } from 'lucide-react';
import { marketDataManager, QuoteData } from '../services/marketData';

interface TradingChartProps {
  symbol?: string;
}

const TradingChart: React.FC<TradingChartProps> = ({ symbol = 'AAPL' }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuote, setCurrentQuote] = useState<QuoteData | null>(null);
  const [currentTimeframe, setCurrentTimeframe] = useState('1day');
  const [currentChartType, setCurrentChartType] = useState('Candlestick');
  const [dataSource, setDataSource] = useState('');

  const refreshData = async () => {
    setIsLoading(true);
    try {
      console.log(`Refreshing data for ${symbol} with timeframe ${currentTimeframe}`);
      
      // Load historical data
      const days = currentTimeframe === '1day' ? 365 : 30;
      const historicalData = await marketDataManager.getHistoricalData(symbol, currentTimeframe, days);
      
      // Load current quote
      const quote = await marketDataManager.getQuote(symbol);
      setCurrentQuote(quote);
      setDataSource(marketDataManager.getCurrentSource());
      
      // Update chart
      if (chartRef.current) {
        chartRef.current.remove();
      }
      createNewChart(historicalData);
      
    } catch (error) {
      console.error('Failed to refresh market data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChart = (data: CandlestickData[]) => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0a0a0a' },
        textColor: '#ff00ff',
      },
      grid: {
        vertLines: { color: '#1a1a1a' },
        horzLines: { color: '#1a1a1a' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#ff00ff',
      },
      timeScale: {
        borderColor: '#ff00ff',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#00ff41',
      downColor: '#ff0080',
      borderDownColor: '#ff0080',
      borderUpColor: '#00ff41',
      wickDownColor: '#ff0080',
      wickUpColor: '#00ff41',
    });

    // Set the data
    candlestickSeries.setData(data);
    
    // Fit content
    chart.timeScale().fitContent();

    chartRef.current = chart;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
  };

  useEffect(() => {
    const loadAndCreateChart = async () => {
      setIsLoading(true);
      try {
        console.log(`Loading data for ${symbol} with timeframe ${currentTimeframe}`);
        
        // Load historical data
        const days = currentTimeframe === '1day' ? 365 : 30;
        const historicalData = await marketDataManager.getHistoricalData(symbol, currentTimeframe, days);
        
        // Load current quote
        const quote = await marketDataManager.getQuote(symbol);
        setCurrentQuote(quote);
        setDataSource(marketDataManager.getCurrentSource());
        
        // Create or update chart
        if (chartRef.current) {
          chartRef.current.remove();
        }
        createNewChart(historicalData);
        
      } catch (error) {
        console.error('Failed to load market data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAndCreateChart();
    
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
      }
      window.removeEventListener('resize', () => {});
    };
  }, [symbol, currentTimeframe]); // Depend on symbol and timeframe

  const handleTimeframeChange = (timeframe: string) => {
    setCurrentTimeframe(timeframe);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number, changePercent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
  };

  return (
    <div className="w-full h-full min-h-[600px] bg-charcoal-gradient rounded-xl border-4 border-fluorescent-pink shadow-neon-pink m-4 relative overflow-hidden">
      {/* Chart Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-deep-black/90 to-charcoal/90 border-b-2 border-fluorescent-pink z-10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-fluorescent-pink animate-pulse" />
              <span className="text-fluorescent-pink font-bold text-xl">{symbol}</span>
            </div>
            {currentQuote && (
              <div className="flex items-center space-x-2">
                <TrendingUp className={`w-4 h-4 ${currentQuote.change >= 0 ? 'text-neon-green' : 'text-fluorescent-pink'}`} />
                <span className={`font-bold text-lg ${currentQuote.change >= 0 ? 'text-neon-green' : 'text-fluorescent-pink'}`}>
                  {formatPrice(currentQuote.price)}
                </span>
                <span className={`text-sm ${currentQuote.change >= 0 ? 'text-neon-green' : 'text-fluorescent-pink'}`}>
                  {formatChange(currentQuote.change, currentQuote.changePercent)}
                </span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-xs">
              <Database className="w-3 h-3 text-electric-yellow" />
              <span className="text-electric-yellow">{dataSource}</span>
              <Wifi className="w-3 h-3 text-neon-green animate-pulse" />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={refreshData}
              className="p-2 bg-electric-purple/20 border border-electric-purple rounded-lg hover:bg-electric-purple/40 transition-all"
              disabled={isLoading}
              title="Refresh Data"
              aria-label="Refresh chart data"
            >
              <RefreshCw className={`w-4 h-4 text-electric-purple ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              className="p-2 bg-fluorescent-blue/20 border border-fluorescent-blue rounded-lg hover:bg-fluorescent-blue/40 transition-all"
              title="Chart Settings"
              aria-label="Open chart settings"
            >
              <Settings className="w-4 h-4 text-fluorescent-blue" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-deep-black/80 flex items-center justify-center z-20">
          <div className="text-center">
            <Activity className="w-12 h-12 text-fluorescent-pink animate-pulse mx-auto mb-4" />
            <div className="text-fluorescent-pink font-bold">Loading Quantum Data...</div>
            <div className="text-electric-yellow text-sm mt-2">
              Fetching real-time market data for {symbol}
            </div>
          </div>
        </div>
      )}

      {/* Chart Container */}
      <div
        ref={chartContainerRef}
        className="w-full h-full pt-16 min-h-[500px]"
      />

      {/* Chart Controls */}
      <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-deep-black/90 to-charcoal/90 border-2 border-electric-purple rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-fluorescent-pink text-xs font-bold">TIMEFRAME:</div>
            {['1m', '5m', '15m', '1h', '4h', '1d', '1wk'].map((tf) => (
              <button
                key={tf}
                onClick={() => handleTimeframeChange(tf === '1d' ? '1day' : tf === '1wk' ? '1week' : tf)}
                className={`px-3 py-1 text-xs font-bold border rounded transition-all ${
                  currentTimeframe === (tf === '1d' ? '1day' : tf === '1wk' ? '1week' : tf)
                    ? 'bg-electric-purple border-electric-purple text-white'
                    : 'bg-electric-purple/20 border-electric-purple text-electric-purple hover:bg-electric-purple/40'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-fluorescent-pink text-xs font-bold">CHART TYPE:</div>
            {['Candlestick', 'Line', 'Area'].map((type) => (
              <button
                key={type}
                onClick={() => setCurrentChartType(type)}
                className={`px-3 py-1 text-xs font-bold border rounded transition-all ${
                  currentChartType === type
                    ? 'bg-fluorescent-blue border-fluorescent-blue text-white'
                    : 'bg-fluorescent-blue/20 border-fluorescent-blue text-fluorescent-blue hover:bg-fluorescent-blue/40'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;