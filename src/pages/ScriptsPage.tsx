import React, { useState } from 'react';

const ScriptsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Indicators');

  const scripts = {
    Indicators: [
      { id: 1, title: 'SuperTrend V2', author: 'ScriptMaster', description: 'A more accurate trend-following indicator.' },
      { id: 2, title: 'Smart Money Concepts', author: 'PriceActionPro', description: 'Visualizes order blocks and liquidity zones.' },
    ],
    Strategies: [
      { id: 1, title: 'Mean Reversion Bot', author: 'AlgoTrader', description: 'Automated strategy for trading range-bound assets.' },
      { id: 2, title: 'Breakout Momentum Strategy', author: 'ChartSurfer', description: 'A strategy for capturing explosive breakout moves.' },
    ],
    Libraries: [
      { id: 1, title: 'Risk Management Library', author: 'SystemArchitect', description: 'A set of functions for calculating position size and stop-loss.' },
      { id: 2, title: 'Technical Analysis Toolkit', author: 'DevDude', description: 'Reusable functions for common TA calculations.' },
    ],
  };

  const renderContent = () => {
    const content = scripts[activeTab];
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map(item => (
          <div key={item.id} className="neon-card p-6">
            <h3 className="text-xl font-bold neon-card-title">{item.title}</h3>
            <p className="text-gray-400">by @{item.author}</p>
            <p className="text-sm text-gray-300 mt-2">{item.description}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
          QUBIT Scripts
        </h1>
        <p className="text-center text-lg text-gray-400 mt-2">
          The main hub for custom code created with QUBIT Script.
        </p>
      </header>

      <div className="flex justify-center mb-8">
        <div className="bg-gray-800 rounded-lg p-1 flex space-x-1">
          {Object.keys(scripts).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-gray-700'
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default ScriptsPage;
