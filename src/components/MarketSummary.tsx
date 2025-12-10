
import React from 'react';
import { Activity } from 'lucide-react';

const MarketSummary = () => {
  return (
    <div className="bg-crystal-deep px-6 py-6 border-b-2 border-crystal-glow shadow-neon-blue">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-crystal-highlight text-xl font-bold drop-shadow-lg flex items-center">
            <Activity className="w-6 h-6 mr-2 animate-pulse" />
            {'Market Summary >'}
          </h2>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          {['Stocks', 'Spreads', 'Float', 'Crypto', 'Futures'].map((tab) => (
            <button 
              key={tab}
              onClick={() => console.log(`Switched to ${tab} tab`)}
              className="font-bold transition-all duration-300 px-4 py-2 rounded-lg hover:bg-crystal-top/50 text-crystal-highlight hover:text-white"
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-black rounded-lg border border-outline-magenta shadow-outline-magenta flex flex-col">
          <div className="flex items-center justify-between p-2 bg-gray-800 rounded-t-lg">
            <span className="text-crystal-highlight font-bold">SIMPLE PLEASURES</span>
          </div>
          <div className="p-4 flex-grow flex items-center justify-center">
          </div>
        </div>
        <div className="bg-black rounded-lg border border-outline-orange shadow-outline-orange flex flex-col">
          <div className="flex items-center justify-between p-2 bg-gray-800 rounded-t-lg">
            <span className="text-crystal-highlight font-bold">MAKE LIFE EASIER</span>
          </div>
          <div className="p-4 flex-grow flex items-center justify-center">
          </div>
        </div>
        <div className="bg-black rounded-lg border border-crystal-glow shadow-neon-blue flex flex-col">
          <div className="flex items-center justify-between p-2 bg-gray-800 rounded-t-lg">
            <span className="text-crystal-highlight font-bold">PERSONALITIES</span>
          </div>
          <div className="p-4 flex-grow flex items-center justify-center">
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketSummary;
