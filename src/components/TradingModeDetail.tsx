import React from 'react';

interface TradingModeDetailProps {
  mode: {
    name: string;
    description: string;
  };
}

const TradingModeDetail: React.FC<TradingModeDetailProps> = ({ mode }) => {
  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">{mode.name}</h2>
      <p className="text-gray-300">{mode.description}</p>
      <div className="mt-6">
        {/* Placeholder for mode-specific components and charts */}
        <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
          <p className="text-gray-500">
            Components, charts, and tools for {mode.name} will be loaded here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TradingModeDetail;
