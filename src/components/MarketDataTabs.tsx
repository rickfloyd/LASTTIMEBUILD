import { TrendingUp, TrendingDown } from 'lucide-react';

const MarketDataTabs = () => {
  const stocksData = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '.31', change: '+1.24%', positive: true },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: ',847.42', change: '-0.85%', positive: false },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: '.85', change: '+2.10%', positive: true },
  ];

  return (
    <div className="bg-gray-900 p-8">
      <h2 className="text-white text-2xl font-bold mb-6">Market Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stocksData.map((item, index) => (
          <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-bold text-lg">{item.symbol}</div>
                <div className="text-gray-300 text-sm">{item.name}</div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-lg">{item.price}</div>
                <div className={`text-sm flex items-center justify-end font-bold ${item.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {item.positive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {item.change}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketDataTabs;
