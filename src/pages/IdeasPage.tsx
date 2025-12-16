
import React from 'react';

const IdeasPage: React.FC = () => {
  // Mock data for trade ideas
  const tradeIdeas = [
    { id: 1, title: 'BTC/USD Long Setup', author: 'CryptoGoddess', category: 'Crypto', tags: ['BTC', 'Long', 'Breakout'] },
    { id: 2, title: 'Shorting NVDA on Earnings', author: 'StockWizard', category: 'Stocks', tags: ['NVDA', 'Short', 'Earnings'] },
    { id: 3, title: 'EUR/JPY Forex Analysis', author: 'ForexPhantom', category: 'Forex', tags: ['EUR', 'JPY', 'Trend'] },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          Market Analysis & Trade Ideas
        </h1>
        <p className="text-center text-lg text-gray-400 mt-2">
          General trade setups shared by the community.
        </p>
      </header>

      {/* Placeholder for idea cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tradeIdeas.map(idea => (
          <div key={idea.id} className="neon-card p-6">
            <h3 className="text-xl font-bold neon-card-title">{idea.title}</h3>
            <p className="text-gray-400">by @{idea.author}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {idea.tags.map(tag => (
                <span key={tag} className="bg-gray-700 text-gray-300 px-2 py-1 rounded-md text-sm">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdeasPage;
