import React, { useState } from 'react';
import Personalities from './Personalities';
import { Settings, Maximize2, BarChart3, LineChart, CandlestickChart, Square, Zap, Activity, TrendingUp, Users } from 'lucide-react';

interface TradingInterfaceProps {
  onTimeframeChange?: (timeframe: string) => void;
  onChartTypeChange?: (chartType: string) => void;
}

const TradingInterface: React.FC<TradingInterfaceProps> = ({ 
  onTimeframeChange, 
  onChartTypeChange 
}) => {
  const [activeTimeframe, setActiveTimeframe] = useState('15m');
  const [activeChartType, setActiveChartType] = useState('line');
  const [isTrading, setIsTrading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('chart');

  const timeframes = [
    { label: '1m', value: '1m', color: 'fluorescent-pink' },
    { label: '5m', value: '5m', color: 'fluorescent-blue' },
    { label: '15m', value: '15m', color: 'electric-orange' },
    { label: '1h', value: '1h', color: 'pulsing-cyan' },
    { label: '4h', value: '4h', color: 'neon-green' },
    { label: '1D', value: '1D', color: 'electric-purple' }
  ];

  const chartTypes = [
    { type: 'bar', icon: BarChart3, label: 'Bar Chart', color: 'fluorescent-pink' },
    { type: 'line', icon: LineChart, label: 'Line Chart', color: 'fluorescent-blue' },
    { type: 'candle', icon: CandlestickChart, label: 'Candlestick', color: 'electric-orange' }
  ];

  const handleTimeframeClick = (timeframe: string) => {
    setActiveTimeframe(timeframe);
    onTimeframeChange?.(timeframe);
  };

  const handleChartTypeClick = (chartType: string) => {
    setActiveChartType(chartType);
    onChartTypeChange?.(chartType);
  };

  const handleTradeClick = () => {
    setIsTrading(!isTrading);
    console.log(isTrading ? 'Stopping trade...' : 'Starting trade...');
  };

  const handleMaximizeClick = () => {
    setIsMaximized(!isMaximized);
    console.log(isMaximized ? 'Minimizing chart...' : 'Maximizing chart...');
  };

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
    console.log('Opening settings...');
  };

  return (
    <div className="bg-charcoal-gradient border-b-2 border-pulsing-cyan shadow-neon-cyan px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Chart controls */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => handleTimeframeClick(tf.value)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 border-2 ${
                  activeTimeframe === tf.value
                    ? `bg-${tf.color} text-deep-black border-${tf.color} shadow-neon-pink animate-pulse-glow`
                    : `bg-deep-black/50 hover:bg-charcoal text-${tf.color} border-${tf.color} hover:shadow-neon-blue`
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
          
          <div className="h-8 w-px bg-electric-purple shadow-neon-blue"></div>
          
          <div className="flex items-center space-x-2">
            {chartTypes.map(({ type, icon: Icon, label, color }) => (
              <button
                key={type}
                onClick={() => handleChartTypeClick(type)}
                className={`p-3 rounded-lg transition-all duration-300 border-2 ${
                  activeChartType === type
                    ? `text-deep-black bg-${color} border-${color} shadow-neon-orange animate-bounce-glow`
                    : `text-${color} bg-deep-black/50 border-${color} hover:bg-charcoal hover:shadow-neon-cyan`
                }`}
                title={label}
              >
                <Icon size={20} />
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={() => setActiveTab('personalities')} className={`p-2 rounded-md ${activeTab === 'personalities' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
              <Users size={20} />
            </button>
            <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-md hover:bg-gray-700">
              <Settings size={20} />
            </button>
            <button onClick={handleMaximizeClick} className="p-2 rounded-md hover:bg-gray-700">
              <Maximize2 size={20} />
            </button>
          </div>
        </div>

        {/* Center - Symbol and price */}
        <div className="text-center p-4 bg-deep-black/70 rounded-xl border-2 border-fluorescent-pink shadow-neon-pink">
          <div className="text-fluorescent-pink text-xl font-bold drop-shadow-lg flex items-center justify-center">
            <Activity className="w-6 h-6 mr-2 animate-pulse" />
            DXY (US Dollar Index)
          </div>
          <div className="flex items-center justify-center space-x-3 mt-2">
            <span className="text-pulsing-cyan text-3xl font-bold drop-shadow-lg animate-cyber-pulse">105.42</span>
            <div className="flex items-center text-fluorescent-pink font-bold">
              <TrendingUp className="w-5 h-5 mr-1 animate-bounce" />
              <span className="text-lg">-0.38 (-0.36%)</span>
            </div>
          </div>
        </div>

        {/* Right side - Tools */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSettingsClick}
            className={`p-3 rounded-lg transition-all duration-300 border-2 ${
              showSettings
                ? 'text-deep-black bg-electric-yellow border-electric-yellow shadow-neon-orange'
                : 'text-electric-yellow bg-deep-black/50 border-electric-yellow hover:bg-charcoal hover:shadow-neon-cyan'
            }`}
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={handleMaximizeClick}
            className={`p-3 rounded-lg transition-all duration-300 border-2 ${
              isMaximized
                ? 'text-deep-black bg-pulsing-cyan border-pulsing-cyan shadow-neon-cyan'
                : 'text-pulsing-cyan bg-deep-black/50 border-pulsing-cyan hover:bg-charcoal hover:shadow-neon-blue'
            }`}
            title={isMaximized ? 'Minimize' : 'Maximize'}
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleTradeClick}
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 font-bold border-2 ${
              isTrading
                ? 'bg-fluorescent-pink hover:bg-hot-pink text-deep-black border-fluorescent-pink shadow-neon-pink animate-pulse-glow'
                : 'bg-neon-green hover:bg-electric-yellow text-deep-black border-neon-green shadow-neon-cyan hover:animate-bounce-glow'
            }`}
          >
            {isTrading ? (
              <>
                <Square className="w-5 h-5" />
                <span>STOP</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 animate-bounce" />
                <span>TRADE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-4 bg-gray-900 rounded-b-lg">
        {activeTab === 'chart' && (
          <div className="h-full w-full bg-black rounded-md">
            {/* EnhancedChart or other chart component will go here */}
          </div>
        )}
        {activeTab === 'personalities' && (
          <div className="h-full w-full bg-black rounded-md">
            {/* Personalities component will go here */}
          </div>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mt-6 p-6 bg-deep-black/80 rounded-xl border-2 border-electric-purple shadow-neon-blue animate-slide-in">
          <h3 className="text-fluorescent-pink font-bold text-lg mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 animate-spin" />
            Chart Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-fluorescent-blue text-sm font-bold mb-2">Grid Lines</label>
              <select className="w-full bg-charcoal text-fluorescent-pink border-2 border-fluorescent-blue rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pulsing-cyan focus:shadow-neon-cyan transition-all duration-300">
                <option>Show</option>
                <option>Hide</option>
              </select>
            </div>
            <div>
              <label className="block text-electric-orange text-sm font-bold mb-2">Price Scale</label>
              <select className="w-full bg-charcoal text-fluorescent-pink border-2 border-electric-orange rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-electric-yellow focus:shadow-neon-orange transition-all duration-300">
                <option>Auto</option>
                <option>Linear</option>
                <option>Logarithmic</option>
              </select>
            </div>
            <div>
              <label className="block text-pulsing-cyan text-sm font-bold mb-2">Theme</label>
              <select className="w-full bg-charcoal text-fluorescent-pink border-2 border-pulsing-cyan rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neon-green focus:shadow-neon-cyan transition-all duration-300">
                <option>Cyber Dark</option>
                <option>Neon Light</option>
                <option>Auto</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingInterface;