import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
  highPrice: string;
  lowPrice: string;
}

const BinanceLiveWidget: React.FC = () => {
  const [tickers, setTickers] = useState<BinanceTicker[]>([]);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const popularPairs = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT'];

  const fetchInitialData = async () => {
    try {
      const promises = popularPairs.map((symbol) =>
        axios.get(`http://localhost:3001/api/crypto/binance/ticker/${symbol}`)
      );
      
      const responses = await Promise.all(promises);
      const data = responses.map((r) => r.data.data);
      setTickers(data);
    } catch (error) {
      console.error('Failed to fetch Binance data:', error);
    }
  };

  useEffect(() => {
    fetchInitialData();

    // WebSocket for real-time updates
    const streams = popularPairs.map((p) => `${p.toLowerCase()}@ticker`).join('/');
    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;
    
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log('✅ Binance WebSocket connected');
      setWsConnected(true);
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.data) {
        const ticker = data.data;
        
        setTickers((prev) =>
          prev.map((t) =>
            t.symbol === ticker.s
              ? {
                  symbol: ticker.s,
                  lastPrice: ticker.c,
                  priceChangePercent: ticker.P,
                  volume: ticker.v,
                  highPrice: ticker.h,
                  lowPrice: ticker.l,
                }
              : t
          )
        );
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWsConnected(false);
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
      setWsConnected(false);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="bg-gray-900 border border-purple-500 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-purple-400">⚡ Binance Live Stream</h2>
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              wsConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}
          ></div>
          <span className={wsConnected ? 'text-green-400' : 'text-red-400'}>
            {wsConnected ? 'WebSocket Connected' : 'Connecting...'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {tickers.map((ticker) => (
          <div
            key={ticker.symbol}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:border-purple-500 transition-all"
          >
            <div>
              <div className="font-bold text-white text-lg">{ticker.symbol}</div>
              <div className="text-sm text-gray-400">
                24h: {parseFloat(ticker.lowPrice).toFixed(2)} -{' '}
                {parseFloat(ticker.highPrice).toFixed(2)}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">
                ${parseFloat(ticker.lastPrice).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div
                className={`text-sm font-bold ${
                  parseFloat(ticker.priceChangePercent) >= 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {parseFloat(ticker.priceChangePercent) >= 0 ? '▲' : '▼'}{' '}
                {Math.abs(parseFloat(ticker.priceChangePercent)).toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-400 text-center">
        Real-time data from Binance WebSocket
      </div>
    </div>
  );
};

export default BinanceLiveWidget;
