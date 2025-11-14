import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Star, Plus, Trash2, Eye, Settings } from 'lucide-react';
import { marketDataManager, QuoteData } from '../services/marketData';

interface WatchlistItem {
  symbol: string;
  name: string;
  sector?: string;
  addedDate: string;
  notes?: string;
}

interface Portfolio {
  id: string;
  name: string;
  items: WatchlistItem[];
  color: string;
  isDefault: boolean;
}

interface PortfolioPosition {
  symbol: string;
  shares: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

const PortfolioManager: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([
    {
      id: 'default',
      name: 'Main Watchlist',
      items: [
        { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', addedDate: '2024-01-15' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', addedDate: '2024-01-16' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology', addedDate: '2024-01-17' },
        { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive', addedDate: '2024-01-18' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology', addedDate: '2024-01-19' }
      ],
      color: 'from-cyan-400 to-blue-600',
      isDefault: true
    },
    {
      id: 'crypto',
      name: 'Crypto Watch',
      items: [
        { symbol: 'BTC-USD', name: 'Bitcoin', sector: 'Cryptocurrency', addedDate: '2024-01-20' },
        { symbol: 'ETH-USD', name: 'Ethereum', sector: 'Cryptocurrency', addedDate: '2024-01-21' }
      ],
      color: 'from-orange-400 to-red-600',
      isDefault: false
    }
  ]);

  const [activePortfolio, setActivePortfolio] = useState<string>('default');
  const [quotes, setQuotes] = useState<{ [symbol: string]: QuoteData }>({});
  const [positions] = useState<PortfolioPosition[]>([
    {
      symbol: 'AAPL',
      shares: 100,
      averagePrice: 150.00,
      currentPrice: 175.00,
      totalValue: 17500,
      gainLoss: 2500,
      gainLossPercent: 16.67
    },
    {
      symbol: 'GOOGL',
      shares: 50,
      averagePrice: 120.00,
      currentPrice: 140.00,
      totalValue: 7000,
      gainLoss: 1000,
      gainLossPercent: 16.67
    }
  ]);

  const [newSymbol, setNewSymbol] = useState('');
  const [showAddSymbol, setShowAddSymbol] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load quotes for all symbols in active portfolio
  useEffect(() => {
    const loadQuotes = async () => {
      const currentPortfolio = portfolios.find(p => p.id === activePortfolio);
      if (!currentPortfolio) return;

      setIsLoading(true);
      try {
        const symbols = currentPortfolio.items.map(item => item.symbol);
        const quoteData = await marketDataManager.getMultipleQuotes(symbols);
        
        const quotesMap: { [symbol: string]: QuoteData } = {};
        quoteData.forEach(quote => {
          quotesMap[quote.symbol] = quote;
        });
        
        setQuotes(quotesMap);
      } catch (error) {
        console.error('Failed to load quotes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuotes();
    
    // Set up real-time updates
    const currentPortfolio = portfolios.find(p => p.id === activePortfolio);
    if (currentPortfolio) {
      const symbols = currentPortfolio.items.map(item => item.symbol);
      const cleanup = marketDataManager.startRealTimeUpdates(symbols, (updatedQuotes) => {
        const quotesMap: { [symbol: string]: QuoteData } = {};
        updatedQuotes.forEach(quote => {
          quotesMap[quote.symbol] = quote;
        });
        setQuotes(prev => ({ ...prev, ...quotesMap }));
      });

      return cleanup;
    }
  }, [activePortfolio, portfolios]);

  const addSymbol = async () => {
    if (!newSymbol.trim()) return;

    try {
      const quote = await marketDataManager.getQuote(newSymbol.toUpperCase());
      const newItem: WatchlistItem = {
        symbol: quote.symbol,
        name: quote.symbol, // In real app, would fetch company name
        addedDate: new Date().toISOString().split('T')[0]
      };

      setPortfolios(prev => prev.map(portfolio => 
        portfolio.id === activePortfolio 
          ? { ...portfolio, items: [...portfolio.items, newItem] }
          : portfolio
      ));

      setNewSymbol('');
      setShowAddSymbol(false);
    } catch (error) {
      console.error('Failed to add symbol:', error);
    }
  };

  const removeSymbol = (symbol: string) => {
    setPortfolios(prev => prev.map(portfolio => 
      portfolio.id === activePortfolio 
        ? { ...portfolio, items: portfolio.items.filter(item => item.symbol !== symbol) }
        : portfolio
    ));
  };

  const createNewPortfolio = () => {
    const newPortfolio: Portfolio = {
      id: `portfolio-${Date.now()}`,
      name: `Watchlist ${portfolios.length + 1}`,
      items: [],
      color: 'from-purple-400 to-pink-600',
      isDefault: false
    };

    setPortfolios(prev => [...prev, newPortfolio]);
    setActivePortfolio(newPortfolio.id);
  };

  const currentPortfolio = portfolios.find(p => p.id === activePortfolio);
  
  const calculatePortfolioStats = () => {
    const totalValue = positions.reduce((sum, pos) => sum + pos.totalValue, 0);
    const totalGainLoss = positions.reduce((sum, pos) => sum + pos.gainLoss, 0);
    const totalGainLossPercent = totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0;

    return { totalValue, totalGainLoss, totalGainLossPercent };
  };

  const stats = calculatePortfolioStats();

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
          Portfolio Manager
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={createNewPortfolio}
            className="flex items-center space-x-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Portfolio</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-all">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Portfolio Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700 pb-4">
        {portfolios.map((portfolio) => (
          <button
            key={portfolio.id}
            onClick={() => setActivePortfolio(portfolio.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activePortfolio === portfolio.id
                ? `bg-gradient-to-r ${portfolio.color} text-white shadow-lg`
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span>{portfolio.name}</span>
            {portfolio.isDefault && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
          </button>
        ))}
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Total Value</div>
          <div className="text-2xl font-bold text-white">${stats.totalValue.toLocaleString()}</div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Total Gain/Loss</div>
          <div className={`text-2xl font-bold ${stats.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stats.totalGainLoss >= 0 ? '+' : ''}${stats.totalGainLoss.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Total Return</div>
          <div className={`text-2xl font-bold ${stats.totalGainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stats.totalGainLossPercent >= 0 ? '+' : ''}{stats.totalGainLossPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Add Symbol Section */}
      {showAddSymbol && (
        <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-cyan-500/30">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              placeholder="Enter symbol (e.g., AAPL)"
              className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
              onKeyPress={(e) => e.key === 'Enter' && addSymbol()}
            />
            <button
              onClick={addSymbol}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-all"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddSymbol(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Watchlist */}
      {currentPortfolio && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {currentPortfolio.name} ({currentPortfolio.items.length} symbols)
            </h3>
            <button
              onClick={() => setShowAddSymbol(true)}
              className="flex items-center space-x-1 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Symbol</span>
            </button>
          </div>

          {isLoading && (
            <div className="text-center py-8">
              <div className="text-cyan-400 animate-pulse">Loading market data...</div>
            </div>
          )}

          <div className="space-y-2">
            {currentPortfolio.items.map((item) => {
              const quote = quotes[item.symbol];
              return (
                <div key={item.symbol} className="bg-gray-800/50 hover:bg-gray-700/50 rounded-lg p-4 border border-gray-700 hover:border-cyan-500/50 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{item.symbol.substring(0, 2)}</span>
                      </div>
                      
                      <div>
                        <div className="font-semibold text-white">{item.symbol}</div>
                        <div className="text-sm text-gray-400">{item.name}</div>
                        {item.sector && <div className="text-xs text-gray-500">{item.sector}</div>}
                      </div>
                    </div>

                    {quote ? (
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">${quote.price.toFixed(2)}</div>
                          <div className={`text-sm flex items-center ${quote.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {quote.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                            {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeSymbol(item.symbol)}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400 animate-pulse">Loading...</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {currentPortfolio.items.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">No symbols in this portfolio</div>
              <button
                onClick={() => setShowAddSymbol(true)}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-all"
              >
                Add Your First Symbol
              </button>
            </div>
          )}
        </div>
      )}

      {/* Feature Status */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex space-x-4">
            <span>🔥 Real-time Updates</span>
            <span>💼 Unlimited Portfolios</span>
            <span>📊 Advanced Analytics</span>
          </div>
          <div className="flex space-x-2">
            <span>Symbols: {currentPortfolio?.items.length || 0}</span>
            <span>Portfolios: {portfolios.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioManager;