
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Eye, EyeOff, Zap, Activity, X } from 'lucide-react';

const MarketSummary = () => {
  return (
    <div className="bg-charcoal-gradient px-6 py-6 border-b-2 border-electric-purple shadow-neon-blue">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-fluorescent-pink text-xl font-bold drop-shadow-lg flex items-center">
            <Activity className="w-6 h-6 mr-2 animate-pulse" />
            {'Market Summary >'}
          </h2>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          {['Stocks', 'Spreads', 'Float', 'Crypto', 'Futures'].map((tab, index) => (
            <button 
              key={tab}
              onClick={() => console.log(`Switched to ${tab} tab`)}
              className={`font-bold transition-all duration-300 px-4 py-2 rounded-lg hover:bg-charcoal/50 ${
                index % 2 === 0 
                  ? 'text-fluorescent-blue hover:text-pulsing-cyan hover:shadow-neon-blue' 
                  : 'text-electric-orange hover:text-electric-yellow hover:shadow-neon-orange'
              }`}
            >
              
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-black rounded-lg two-tone-glow-pink flex flex-col">
          <div className="flex items-center justify-between p-2 bg-gray-800 rounded-t-lg">
            <span className="text-fluorescent-pink font-bold">SIMPLE PLEASURES</span>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
          <div className="p-4 flex-grow flex items-center justify-center">
          </div>
        </div>
        <div className="bg-black rounded-lg two-tone-glow-orange flex flex-col">
          <div className="flex items-center justify-between p-2 bg-gray-800 rounded-t-lg">
            <span className="text-fluorescent-pink font-bold">MAKE LIFE EASIER</span>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
          <div className="p-4 flex-grow flex items-center justify-center">
          </div>
        </div>
        <div className="bg-black rounded-lg two-tone-glow-pink flex flex-col">
          <div className="flex items-center justify-between p-2 bg-gray-800 rounded-t-lg">
            <span className="text-fluorescent-pink font-bold">PERSONALITIES</span>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
          <div className="p-4 flex-grow flex items-center justify-center">
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketSummary;