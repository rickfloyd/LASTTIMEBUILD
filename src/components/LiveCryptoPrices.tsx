import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image?: string;
  market_cap: number;
  total_volume: number;
}

const LiveCryptoPrices: React.FC = () => {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/crypto/prices');
      if (response.data.success) {
        setPrices(response.data.data);
        setError(null);
      }
    } catch (err: unknown) {
      setError('Failed to fetch crypto prices');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPrices, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-pulsing-cyan rounded-lg p-6 shadow-neon-cyan">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-fluorescent-pink"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 border border-laser-red rounded-lg p-6 shadow-neon-red">
        <div className="text-laser-red text-center">
          <p className="text-xl font-bold animate-pulse">⚠️ {error}</p>
          <div className="text-gray-400 text-sm mt-2">
            Make sure the server is running on port 3001
          </div>
          <button 
            onClick={fetchPrices}
            className="mt-4 px-6 py-2 bg-fluorescent-pink text-black font-bold rounded-lg hover:scale-105 transition-transform"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-pulsing-cyan rounded-lg p-6 shadow-neon-cyan">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-fluorescent-pink animate-cyber-pulse">🔥 Live Crypto Prices</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
          <span className="text-neon-green text-sm font-bold">LIVE</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prices.slice(0, 6).map((coin) => (
          <div
            key={coin.id}
            className="bg-deep-black/50 border border-electric-purple rounded-lg p-4 hover:shadow-neon-purple hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {coin.image && (
                  <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                )}
                <div>
                  <div className="font-bold text-fluorescent-blue">{coin.symbol.toUpperCase()}</div>
                  <div className="text-xs text-gray-400">{coin.name}</div>
                </div>
              </div>
              <div
                className={`px-2 py-1 rounded text-xs font-bold ${
                  coin.price_change_percentage_24h >= 0
                    ? 'bg-neon-green/20 text-neon-green'
                    : 'bg-laser-red/20 text-laser-red'
                }`}
              >
                {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'}{' '}
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </div>
            </div>
            
            <div className="text-2xl font-bold text-pulsing-cyan mb-1">
              ${coin.current_price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            
            <div className="flex justify-between text-xs text-gray-400">
              <div>
                <div>MCap</div>
                <div className="text-electric-yellow">${(coin.market_cap / 1e9).toFixed(2)}B</div>
              </div>
              <div>
                <div>Vol 24h</div>
                <div className="text-bright-magenta">${(coin.total_volume / 1e9).toFixed(2)}B</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-gray-400 text-center">
        <span className="animate-pulse">Data from CoinGecko • Updates every 30 seconds</span>
      </div>
    </div>
  );
};

export default LiveCryptoPrices;
