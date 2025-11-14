import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { marketDataManager, CandlestickData } from '../services/marketData';
import { IndicatorManager, IndicatorResult } from '../services/technicalIndicators';
import DrawingToolsManager from '../services/drawingTools';
import SmartAlertEngine from '../services/alertEngine';
import DrawingToolsUI from './DrawingToolsUI';
import AlertUI from './AlertUI';
import './IndependentChart.css';

interface EnhancedChartProps {
  symbol?: string;
  interval?: string;
}

const EnhancedChart: React.FC<EnhancedChartProps> = ({ 
  symbol = 'AAPL', 
  interval = '1D' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const indicatorCanvasRef = useRef<HTMLCanvasElement>(null);
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0);
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['RSI', 'MACD']);
  const [indicatorResults, setIndicatorResults] = useState<IndicatorResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area'>('candlestick');
  
  // Initialize managers
  const indicatorManager = useMemo(() => new IndicatorManager(), []);
  
  // Initialize all services
  const [drawingManager, setDrawingManager] = useState<DrawingToolsManager | null>(null);
  const [alertEngine, setAlertEngine] = useState<SmartAlertEngine | null>(null);

  // Initialize drawing manager when canvas is ready
  useEffect(() => {
    if (canvasRef.current && !drawingManager) {
      const manager = new DrawingToolsManager(canvasRef.current);
      setDrawingManager(manager);
    }
  }, [drawingManager]);

  // Initialize alert engine
  useEffect(() => {
    if (!alertEngine) {
      const engine = new SmartAlertEngine(marketDataManager, indicatorManager);
      engine.loadAlerts();
      engine.startMonitoring();
      setAlertEngine(engine);
    }
  }, [alertEngine, indicatorManager]);

  // Load market data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await marketDataManager.getHistoricalData(symbol, interval, 100);
        setChartData(data);
        
        if (data.length > 0) {
          const latest = data[data.length - 1];
          const previous = data[data.length - 2];
          setCurrentPrice(latest.close);
          setPriceChange(latest.close - previous.close);
          setPriceChangePercent(((latest.close - previous.close) / previous.close) * 100);
        }
      } catch (error) {
        console.error('Failed to load market data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [symbol, interval]);

  // Calculate indicators when data or active indicators change
  useEffect(() => {
    if (chartData.length === 0) return;

    const results: IndicatorResult[] = [];
    const candles = chartData.map(d => ({
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume || 1000000
    }));

    activeIndicators.forEach(indicatorName => {
      const result = indicatorManager.calculateIndicator(indicatorName.toLowerCase(), candles);
      if (result) {
        results.push(result);
      }
    });

    setIndicatorResults(results);
  }, [chartData, activeIndicators, indicatorManager]);

  // Draw the main chart
  useEffect(() => {
    if (!canvasRef.current || chartData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Calculate price range
    const prices = chartData.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const padding = priceRange * 0.1;

    // Chart dimensions
    const chartWidth = rect.width - 80;
    const chartHeight = rect.height - 80;
    const startX = 40;
    const startY = 40;

    // Draw grid
    drawGrid(ctx, startX, startY, chartWidth, chartHeight, minPrice, maxPrice, padding);

    // Draw main panel indicators (Bollinger Bands, VWAP, etc.)
    const mainPanelIndicators = indicatorResults.filter(ind => ind.panel === 'main');
    mainPanelIndicators.forEach(indicator => {
      drawIndicatorOnMain(ctx, indicator, startX, startY, chartWidth, chartHeight, minPrice, maxPrice, padding);
    });

    // Draw price chart based on type
    switch (chartType) {
      case 'candlestick':
        drawCandlesticks(ctx, chartData, startX, startY, chartWidth, chartHeight, minPrice, maxPrice, padding);
        break;
      case 'line':
        drawLineChart(ctx, chartData, startX, startY, chartWidth, chartHeight, minPrice, maxPrice, padding);
        break;
      case 'area':
        drawAreaChart(ctx, chartData, startX, startY, chartWidth, chartHeight, minPrice, maxPrice, padding);
        break;
    }

    // Draw current price line
    drawCurrentPriceLine(ctx, currentPrice, startX, startY, chartWidth, chartHeight, minPrice, maxPrice, padding);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData, currentPrice, chartType, indicatorResults]);

  // Draw indicator panel
  useEffect(() => {
    if (!indicatorCanvasRef.current || indicatorResults.length === 0) return;

    const canvas = indicatorCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, rect.width, rect.height);

    const bottomPanelIndicators = indicatorResults.filter(ind => ind.panel === 'bottom');
    if (bottomPanelIndicators.length === 0) return;

    const indicatorHeight = rect.height / bottomPanelIndicators.length;
    
    bottomPanelIndicators.forEach((indicator, index) => {
      const y = index * indicatorHeight;
      drawBottomPanelIndicator(ctx, indicator, 40, y + 20, rect.width - 80, indicatorHeight - 40);
    });

  }, [indicatorResults]);

  const drawGrid = (ctx: CanvasRenderingContext2D, startX: number, startY: number, width: number, height: number, minPrice: number, maxPrice: number, padding: number) => {
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);

    // Horizontal lines
    for (let i = 0; i <= 5; i++) {
      const y = startY + (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + width, y);
      ctx.stroke();

      const price = maxPrice + padding - ((maxPrice + padding - (minPrice - padding)) / 5) * i;
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(price.toFixed(2), startX - 5, y + 4);
    }

    // Vertical lines
    for (let i = 0; i <= 6; i++) {
      const x = startX + (width / 6) * i;
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, startY + height);
      ctx.stroke();
    }

    ctx.setLineDash([]);
  };

  const drawCandlesticks = (ctx: CanvasRenderingContext2D, data: CandlestickData[], startX: number, startY: number, width: number, height: number, minPrice: number, maxPrice: number, padding: number) => {
    const candleWidth = width / data.length * 0.8;
    
    data.forEach((candle, index) => {
      const x = startX + (width / data.length) * index + (width / data.length - candleWidth) / 2;
      const openY = startY + height - ((candle.open - (minPrice - padding)) / (maxPrice + padding - (minPrice - padding))) * height;
      const closeY = startY + height - ((candle.close - (minPrice - padding)) / (maxPrice + padding - (minPrice - padding))) * height;
      const highY = startY + height - ((candle.high - (minPrice - padding)) / (maxPrice + padding - (minPrice - padding))) * height;
      const lowY = startY + height - ((candle.low - (minPrice - padding)) / (maxPrice + padding - (minPrice - padding))) * height;

      const isGreen = candle.close >= candle.open;
      ctx.fillStyle = isGreen ? '#10B981' : '#EF4444';
      ctx.strokeStyle = isGreen ? '#10B981' : '#EF4444';
      ctx.lineWidth = 1;

      // Draw wick
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, highY);
      ctx.lineTo(x + candleWidth / 2, lowY);
      ctx.stroke();

      // Draw body
      const bodyHeight = Math.abs(closeY - openY);
      ctx.fillRect(x, Math.min(openY, closeY), candleWidth, Math.max(bodyHeight, 1));
    });
  };

  const drawLineChart = (ctx: CanvasRenderingContext2D, data: CandlestickData[], startX: number, startY: number, width: number, height: number, minPrice: number, maxPrice: number, padding: number) => {
    ctx.strokeStyle = '#06B6D4';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((candle, index) => {
      const x = startX + (width / data.length) * (index + 0.5);
      const y = startY + height - ((candle.close - (minPrice - padding)) / (maxPrice + padding - (minPrice - padding))) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  };

  const drawAreaChart = useCallback((ctx: CanvasRenderingContext2D, data: CandlestickData[], startX: number, startY: number, width: number, height: number, minPrice: number, maxPrice: number, padding: number) => {
    // Create gradient
    const gradient = ctx.createLinearGradient(0, startY, 0, startY + height);
    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
    gradient.addColorStop(1, 'rgba(6, 182, 212, 0.05)');

    ctx.fillStyle = gradient;
    ctx.beginPath();

    // Start from bottom left
    ctx.moveTo(startX, startY + height);

    data.forEach((candle, index) => {
      const x = startX + (width / data.length) * (index + 0.5);
      const y = startY + height - ((candle.close - (minPrice - padding)) / (maxPrice + padding - (minPrice - padding))) * height;
      ctx.lineTo(x, y);
    });

    // Close path to bottom right
    ctx.lineTo(startX + width, startY + height);
    ctx.closePath();
    ctx.fill();

    // Draw line on top
    drawLineChart(ctx, data, startX, startY, width, height, minPrice, maxPrice, padding);
  }, []);

  const drawCurrentPriceLine = (ctx: CanvasRenderingContext2D, price: number, startX: number, startY: number, width: number, height: number, minPrice: number, maxPrice: number, padding: number) => {
    const y = startY + height - ((price - (minPrice - padding)) / (maxPrice + padding - (minPrice - padding))) * height;
    
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(startX + width, y);
    ctx.stroke();

    // Price label
    ctx.setLineDash([]);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(startX + width + 5, y - 10, 60, 20);
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(price.toFixed(2), startX + width + 35, y + 4);
  };

  const drawIndicatorOnMain = (ctx: CanvasRenderingContext2D, indicator: IndicatorResult, startX: number, startY: number, width: number, height: number, minPrice: number, maxPrice: number, padding: number) => {
    if (indicator.name === 'Bollinger Bands') {
      // Draw three lines for Bollinger Bands
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 1;
      
      for (let line = 0; line < 3; line++) {
        ctx.beginPath();
        for (let i = 0; i < indicator.values.length / 3; i++) {
          const value = indicator.values[i * 3 + line];
          const x = startX + (width / (indicator.values.length / 3)) * (i + 0.5);
          const y = startY + height - ((value - (minPrice - padding)) / (maxPrice + padding - (minPrice - padding))) * height;
          
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
  };

  const drawBottomPanelIndicator = (ctx: CanvasRenderingContext2D, indicator: IndicatorResult, startX: number, startY: number, width: number, height: number) => {
    const minVal = Math.min(...indicator.values);
    const maxVal = Math.max(...indicator.values);
    const range = maxVal - minVal || 1;

    // Draw indicator name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(indicator.name, startX, startY - 5);

    if (indicator.displayType === 'histogram') {
      // Draw histogram (like MACD)
      const barWidth = width / indicator.values.length;
      indicator.values.forEach((value, index) => {
        const x = startX + barWidth * index;
        const barHeight = Math.abs(value) / range * height * 0.8;
        const y = value >= 0 ? startY + height / 2 - barHeight : startY + height / 2;
        
        ctx.fillStyle = indicator.colors?.[index] || '#06B6D4';
        ctx.fillRect(x, y, barWidth * 0.8, barHeight);
      });
    } else {
      // Draw line
      ctx.strokeStyle = indicator.colors?.[0] || '#06B6D4';
      ctx.lineWidth = 2;
      ctx.beginPath();

      indicator.values.forEach((value, index) => {
        const x = startX + (width / indicator.values.length) * (index + 0.5);
        const y = startY + height - ((value - minVal) / range) * height;
        
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.stroke();
    }

    // Draw reference lines for some indicators
    if (indicator.name === 'RSI') {
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      
      // 70 line
      const y70 = startY + height - ((70 - minVal) / range) * height;
      ctx.beginPath();
      ctx.moveTo(startX, y70);
      ctx.lineTo(startX + width, y70);
      ctx.stroke();
      
      // 30 line
      const y30 = startY + height - ((30 - minVal) / range) * height;
      ctx.beginPath();
      ctx.moveTo(startX, y30);
      ctx.lineTo(startX + width, y30);
      ctx.stroke();
      
      ctx.setLineDash([]);
    }
  };

  const toggleIndicator = (indicatorName: string) => {
    setActiveIndicators(prev => 
      prev.includes(indicatorName) 
        ? prev.filter(name => name !== indicatorName)
        : [...prev, indicatorName]
    );
  };

  const availableIndicators = [
    'RSI', 'MACD', 'Bollinger', 'Stochastic', 'Williams', 'ADX', 'CCI', 'VWAP', 'Ichimoku', 'OBV'
  ];

  return (
    <div className="bg-gray-900 border border-cyan-500/30 rounded-lg p-4">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-bold text-white">{symbol}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-cyan-400">${currentPrice.toFixed(2)}</span>
            <span className={`text-sm font-medium ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
            </span>
          </div>
          {isLoading && <div className="text-cyan-400 animate-pulse">Loading...</div>}
        </div>
        
        {/* Chart Type Buttons */}
        <div className="flex space-x-2">
          {(['candlestick', 'line', 'area'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                chartType === type
                  ? 'bg-cyan-500 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Indicator Controls */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {availableIndicators.map((indicator) => (
            <button
              key={indicator}
              onClick={() => toggleIndicator(indicator)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                activeIndicators.includes(indicator)
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {indicator}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="relative mb-4">
        <canvas
          ref={canvasRef}
          className="chart-canvas w-full border border-gray-700 rounded"
        />
      </div>

      {/* Indicator Panel */}
      {indicatorResults.some(ind => ind.panel === 'bottom') && (
        <div className="relative">
          <canvas
            ref={indicatorCanvasRef}
            className="w-full h-48 border border-gray-700 rounded"
          />
        </div>
      )}

      {/* Chart Status */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
        <div className="flex space-x-4">
          <span>🔥 100% Independent</span>
          <span>🛡️ TradingView-Free</span>
          <span>⚡ Real-time Data</span>
        </div>
        <div className="flex space-x-2">
          <span>Active Indicators: {activeIndicators.length}</span>
          <span>Data Points: {chartData.length}</span>
        </div>
      </div>

      {/* Drawing Tools UI */}
      <DrawingToolsUI drawingManager={drawingManager} />

      {/* Smart Alerts UI */}
      <AlertUI alertEngine={alertEngine} />
    </div>
  );
};

export default EnhancedChart;