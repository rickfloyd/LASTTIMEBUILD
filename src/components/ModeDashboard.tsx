import React from 'react';
import TradingModeDetail from './TradingModeDetail';

const tradingModes = [
  { name: 'Long-Term Mode', description: 'Focused on long-term investment strategies and fundamental analysis.' },
  { name: 'Crypto Mode', description: 'Specialized tools and indicators for the volatile cryptocurrency markets.' },
  { name: 'Futures Mode', description: 'Advanced features for trading futures contracts across various assets.' },
  { name: 'News-Driven Mode', description: 'Real-time news analysis and sentiment tracking for event-driven trading.' },
  { name: 'Options Mode', description: 'Complex options strategies and risk analysis at your fingertips.' },
  { name: 'Price Action Mode', description: 'Pure chart analysis with a focus on candlestick patterns and price movements.' },
  { name: 'SMC Mode', description: 'Smart Money Concepts for tracking institutional buying and selling.' },
  { name: 'Algo Mode', description: 'Develop and deploy your own automated trading algorithms.' },
  { name: 'Scalper’s Mode', description: 'High-frequency trading tools for capitalizing on small price changes.' },
  { name: 'Swing Mode', description: 'Capture market swings over several days or weeks with specialized analytics.' },
];

interface ModeDashboardProps {
  openModal: (component: React.ReactNode, title: string) => void;
}

const ModeDashboard: React.FC<ModeDashboardProps> = ({ openModal }) => {
  return (
    <div className="p-4 md:p-6 bg-gray-900 text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {tradingModes.map((mode, index) => (
          <button
            key={index}
            onClick={() => openModal(<TradingModeDetail mode={mode} />, mode.name)}
            className="bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col justify-between hover:bg-gray-700 transition-colors duration-300 text-left w-full"
          >
            <div>
              <h3 className="text-lg font-bold text-cyan-400">{mode.name}</h3>
              <p className="text-sm text-gray-300 mt-2">{mode.description}</p>
            </div>
            <div className="mt-4 text-cyan-500 font-bold">
              Activate Mode
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModeDashboard;
