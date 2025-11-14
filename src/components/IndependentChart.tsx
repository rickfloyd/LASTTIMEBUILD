import React, { useState, useRef, useEffect } from 'react';
import './IndependentChart.css';

interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface IndependentChartProps {
  symbol?: string;
  interval?: string;
}

const IndependentChart: React.FC<IndependentChartProps> = ({ 
  symbol = 'AAPL', 
  interval = '1D' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0);

  // Generate realistic sample data
  useEffect(() => {
    const generateSampleData = (): ChartData[] => {
      const data: ChartData[] = [];
      let price = 150 + Math.random() * 50; // Base price between 150-200
      const now = new Date();
      
      for (let i = 100; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const open = price;
        const volatility = 0.02; // 2% daily volatility
        const change = (Math.random() - 0.5) * 2 * volatility * price;
        const close = price + change;
        const high = Math.max(open, close) + Math.random() * Math.abs(change) * 0.5;
        const low = Math.min(open, close) - Math.random() * Math.abs(change) * 0.5;
        const volume = Math.floor(Math.random() * 10000000) + 1000000;
        
        data.push({
          time: date.toISOString().split('T')[0],
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          close: parseFloat(close.toFixed(2)),
          volume
        });
        
        price = close;
      }
      
      const latest = data[data.length - 1];
      const previous = data[data.length - 2];
      setCurrentPrice(latest.close);
      setPriceChange(latest.close - previous.close);
      setPriceChangePercent(((latest.close - previous.close) / previous.close) * 100);
      
      return data;
    };

    setChartData(generateSampleData());
  }, [symbol]);

  // Draw the chart
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
    ctx.fillStyle = '#111827'; // gray-900
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Calculate price range
    const prices = chartData.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const padding = priceRange * 0.1;

    // Chart dimensions
    const chartWidth = rect.width - 60;
    const chartHeight = rect.height - 60;
    const startX = 30;
    const startY = 30;

    // Draw grid lines
    ctx.strokeStyle = '#374151'; // gray-700
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);

    // Horizontal grid lines (price levels)
    for (let i = 0; i <= 5; i++) {
      const y = startY + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + chartWidth, y);
      ctx.stroke();

      // Price labels
      const price = maxPrice + padding - ((maxPrice + padding - (minPrice - padding)) / 5) * i;
      ctx.fillStyle = '#9CA3AF'; // gray-400
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(price.toFixed(2), startX - 5, y + 4);
    }

    // Vertical grid lines (time)
    const timeStep = Math.floor(chartData.length / 6);
    for (let i = 0; i <= 6; i++) {
      const x = startX + (chartWidth / 6) * i;
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, startY + chartHeight);
      ctx.stroke();

      // Time labels
      if (i * timeStep < chartData.length) {
        const dataPoint = chartData[i * timeStep];
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(new Date(dataPoint.time).toLocaleDateString(), x, startY + chartHeight + 20);
      }
    }

    ctx.setLineDash([]);

    // Draw candlesticks
    const candleWidth = chartWidth / chartData.length * 0.8;
    
    chartData.forEach((candle, index) => {
      const x = startX + (chartWidth / chartData.length) * index + (chartWidth / chartData.length - candleWidth) / 2;
      const openY = startY + chartHeight - ((candle.open - (minPrice - padding)) / (maxPrice + padding - (minPrice - padding))) * chartHeight;
      const closeY = startY + chartHeight - ((candle.close - (minPrice - padding)) / (maxPrice + padding - (minPrice - padding))) * chartHeight;
      const highY = startY + chartHeight - ((candle.high - (minPrice - padding)) / (maxPrice + padding - (minPrice - padding))) * chartHeight;
      const lowY = startY + chartHeight - ((candle.low - (minPrice - padding)) / (maxPrice + padding - (minPrice - padding))) * chartHeight;

      const isGreen = candle.close >= candle.open;
      ctx.fillStyle = isGreen ? '#10B981' : '#EF4444'; // green-500 : red-500
      ctx.strokeStyle = isGreen ? '#10B981' : '#EF4444';
      ctx.lineWidth = 1;

      // Draw wick (high-low line)
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, highY);
      ctx.lineTo(x + candleWidth / 2, lowY);
      ctx.stroke();

      // Draw body (open-close rectangle)
      const bodyHeight = Math.abs(closeY - openY);
      ctx.fillRect(x, Math.min(openY, closeY), candleWidth, Math.max(bodyHeight, 1));
    });

    // Draw price line for current price
    const currentPriceY = startY + chartHeight - ((currentPrice - (minPrice - padding)) / (maxPrice + padding - (minPrice - padding))) * chartHeight;
    ctx.strokeStyle = '#06B6D4'; // cyan-500
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(startX, currentPriceY);
    ctx.lineTo(startX + chartWidth, currentPriceY);
    ctx.stroke();

    // Current price label
    ctx.setLineDash([]);
    ctx.fillStyle = '#06B6D4';
    ctx.fillRect(startX + chartWidth + 5, currentPriceY - 10, 60, 20);
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(currentPrice.toFixed(2), startX + chartWidth + 35, currentPriceY + 4);

  }, [chartData, currentPrice]);

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
        </div>
        
        {/* Time frame buttons */}
        <div className="flex space-x-2">
          {['1m', '5m', '15m', '1h', '4h', '1D'].map((timeframe) => (
            <button
              key={timeframe}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                interval === timeframe
                  ? 'bg-cyan-500 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="chart-canvas w-full h-96 border border-gray-700 rounded"
        />
        
        {/* Chart overlays */}
        <div className="absolute top-4 left-4 bg-gray-800/90 rounded px-3 py-2">
          <div className="text-xs text-gray-400">Volume: {chartData[chartData.length - 1]?.volume.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Data Source: Independent API</div>
        </div>
      </div>

      {/* Chart controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium">
            📊 Indicators
          </button>
          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium">
            📏 Drawing Tools
          </button>
          <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium">
            💾 Save Layout
          </button>
        </div>
        
        <div className="text-xs text-gray-400">
          🔥 100% Independent • No External Dependencies • Can't Be Shut Down
        </div>
      </div>
    </div>
  );
};

export default IndependentChart;