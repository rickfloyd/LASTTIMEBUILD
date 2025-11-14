import { useState, useEffect } from 'react';

export interface CommunityIndicator {
  id: string;
  name: string;
  description: string;
  author: string;
  category: 'momentum' | 'trend' | 'volume' | 'volatility' | 'support_resistance' | 'custom';
  type: 'indicator' | 'strategy' | 'screener' | 'alert';
  rating: number;
  totalRatings: number;
  downloads: number;
  price: number; // 0 for free
  isVerified: boolean;
  tags: string[];
  previewImage?: string;
  codeSnippet: string;
  createdAt: Date;
  updatedAt: Date;
  compatibility: string[];
  features: string[];
}

export interface Review {
  id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: Date;
  helpful: number;
}

export default function CommunityLibrary() {
  const [indicators, setIndicators] = useState<CommunityIndicator[]>([]);
  const [filteredIndicators, setFilteredIndicators] = useState<CommunityIndicator[]>([]);
  const [selectedIndicator, setSelectedIndicator] = useState<CommunityIndicator | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating' | 'downloads'>('popular');
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    // Mock indicators data
    setIndicators([
      {
        id: '1',
        name: 'AI-Powered RSI Divergence',
        description: 'Advanced RSI indicator that uses machine learning to detect hidden divergences with 90% accuracy',
        author: 'AlgoTrader_Pro',
        category: 'momentum',
        type: 'indicator',
        rating: 4.8,
        totalRatings: 234,
        downloads: 1567,
        price: 0,
        isVerified: true,
        tags: ['RSI', 'Divergence', 'AI', 'Machine Learning'],
        codeSnippet: '//@version=5\nindicator("AI RSI Divergence", overlay=true)\n// Advanced AI algorithms...',
        createdAt: new Date('2024-09-15'),
        updatedAt: new Date('2024-10-10'),
        compatibility: ['TradingView', 'MetaTrader', 'NinjaTrader'],
        features: ['Real-time alerts', 'Backtesting', 'Custom timeframes', 'Multi-asset support']
      },
      {
        id: '2',
        name: 'Volume Profile Elite',
        description: 'Professional volume profile with market structure analysis and institutional order flow',
        author: 'VolumeKing_Official',
        category: 'volume',
        type: 'indicator',
        rating: 4.9,
        totalRatings: 567,
        downloads: 3421,
        price: 49.99,
        isVerified: true,
        tags: ['Volume Profile', 'Market Structure', 'Order Flow', 'Professional'],
        codeSnippet: '//@version=5\nindicator("Volume Profile Elite", overlay=true)\n// Professional volume analysis...',
        createdAt: new Date('2024-08-20'),
        updatedAt: new Date('2024-10-05'),
        compatibility: ['TradingView', 'MetaTrader'],
        features: ['POC identification', 'Value area calculation', 'Volume delta', 'Institutional levels']
      },
      {
        id: '3',
        name: 'Smart Money Concepts',
        description: 'Identify institutional money flow and smart money movements in the market',
        author: 'SmartMoney_Tracker',
        category: 'trend',
        type: 'strategy',
        rating: 4.7,
        totalRatings: 189,
        downloads: 892,
        price: 29.99,
        isVerified: true,
        tags: ['Smart Money', 'Institutional', 'Order Blocks', 'Liquidity'],
        codeSnippet: '//@version=5\nstrategy("Smart Money Concepts", overlay=true)\n// Smart money tracking...',
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2024-10-08'),
        compatibility: ['TradingView'],
        features: ['Order block detection', 'Liquidity sweeps', 'Fair value gaps', 'Market structure']
      },
      {
        id: '4',
        name: 'Fibonacci Retracement Pro',
        description: 'Advanced Fibonacci tool with automatic level detection and confluence zones',
        author: 'FibMaster',
        category: 'support_resistance',
        type: 'indicator',
        rating: 4.6,
        totalRatings: 445,
        downloads: 2156,
        price: 0,
        isVerified: false,
        tags: ['Fibonacci', 'Retracement', 'Support', 'Resistance'],
        codeSnippet: '//@version=5\nindicator("Fibonacci Pro", overlay=true)\n// Advanced fibonacci calculations...',
        createdAt: new Date('2024-09-10'),
        updatedAt: new Date('2024-09-25'),
        compatibility: ['TradingView', 'MetaTrader', 'cTrader'],
        features: ['Auto detection', 'Confluence zones', 'Extension levels', 'Custom ratios']
      },
      {
        id: '5',
        name: 'Volatility Breakout Scanner',
        description: 'Real-time scanner for volatility breakouts across multiple timeframes and assets',
        author: 'BreakoutHunter',
        category: 'volatility',
        type: 'screener',
        rating: 4.5,
        totalRatings: 123,
        downloads: 678,
        price: 19.99,
        isVerified: true,
        tags: ['Volatility', 'Breakout', 'Scanner', 'Multi-timeframe'],
        codeSnippet: '//@version=5\nindicator("Volatility Scanner", overlay=false)\n// Breakout detection logic...',
        createdAt: new Date('2024-10-01'),
        updatedAt: new Date('2024-10-12'),
        compatibility: ['TradingView'],
        features: ['Real-time scanning', 'Multi-asset support', 'Custom filters', 'Alert system']
      }
    ]);

    // Mock reviews
    setReviews([
      {
        id: '1',
        userId: 'user1',
        username: 'TraderJoe123',
        rating: 5,
        comment: 'Absolutely amazing indicator! The AI divergence detection is spot on. Made my trading much more profitable.',
        createdAt: new Date('2024-10-10'),
        helpful: 23
      },
      {
        id: '2',
        userId: 'user2',
        username: 'ForexQueen',
        rating: 4,
        comment: 'Great tool, works well on most pairs. Sometimes gives false signals in ranging markets.',
        createdAt: new Date('2024-10-08'),
        helpful: 15
      }
    ]);
  }, []);

  useEffect(() => {
    let filtered = indicators;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(indicator =>
        indicator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        indicator.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        indicator.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(indicator => indicator.category === categoryFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'downloads':
          return b.downloads - a.downloads;
        default: // popular
          return (b.downloads * b.rating) - (a.downloads * a.rating);
      }
    });

    setFilteredIndicators(filtered);
  }, [indicators, searchTerm, categoryFilter, sortBy]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'momentum', label: 'Momentum' },
    { value: 'trend', label: 'Trend' },
    { value: 'volume', label: 'Volume' },
    { value: 'volatility', label: 'Volatility' },
    { value: 'support_resistance', label: 'Support/Resistance' },
    { value: 'custom', label: 'Custom' }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'}>
        ★
      </span>
    ));
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-cyan-400">Community Library</h1>
        <button className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg">
          Submit Indicator
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search indicators, strategies, and tools..."
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Category Filter"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <select
          className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'popular' | 'newest' | 'rating' | 'downloads')}
          aria-label="Sort By"
        >
          <option value="popular">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="rating">Highest Rated</option>
          <option value="downloads">Most Downloaded</option>
        </select>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto">
        {filteredIndicators.map(indicator => (
          <div
            key={indicator.id}
            className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700 hover:border-cyan-500 cursor-pointer transition-colors"
            onClick={() => setSelectedIndicator(indicator)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-cyan-300">{indicator.name}</h3>
              {indicator.isVerified && (
                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">✓ Verified</span>
              )}
            </div>

            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{indicator.description}</p>

            <div className="flex items-center mb-2">
              <div className="flex mr-2">{renderStars(indicator.rating)}</div>
              <span className="text-sm text-gray-400">
                {indicator.rating} ({indicator.totalRatings} reviews)
              </span>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {indicator.tags.slice(0, 3).map(tag => (
                <span key={tag} className="bg-purple-600 text-xs px-2 py-1 rounded">{tag}</span>
              ))}
            </div>

            <div className="flex justify-between items-center mb-3 text-sm text-gray-400">
              <span>by {indicator.author}</span>
              <span>{indicator.downloads} downloads</span>
            </div>

            <div className="flex justify-between items-center">
              <span className={`font-bold text-lg ${indicator.price === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                {indicator.price === 0 ? 'FREE' : `$${indicator.price}`}
              </span>
              <button className="bg-cyan-600 hover:bg-cyan-500 px-3 py-1 rounded text-sm">
                {indicator.price === 0 ? 'Download' : 'Purchase'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Indicator Detail Modal */}
      {selectedIndicator && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-cyan-300">{selectedIndicator.name}</h2>
                <p className="text-gray-400">by {selectedIndicator.author}</p>
              </div>
              <button
                onClick={() => setSelectedIndicator(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-bold mb-2">Description</h3>
                <p className="text-gray-300 mb-4">{selectedIndicator.description}</p>

                <h3 className="font-bold mb-2">Features</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-300 mb-4">
                  {selectedIndicator.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>

                <h3 className="font-bold mb-2">Compatibility</h3>
                <div className="flex gap-2 mb-4">
                  {selectedIndicator.compatibility.map(platform => (
                    <span key={platform} className="bg-blue-600 text-xs px-2 py-1 rounded">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">Rating & Reviews</h3>
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">{renderStars(selectedIndicator.rating)}</div>
                  <span className="text-lg font-bold">{selectedIndicator.rating}</span>
                  <span className="text-gray-400 ml-2">({selectedIndicator.totalRatings} reviews)</span>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-1">Downloads: {selectedIndicator.downloads}</div>
                  <div className="text-sm text-gray-400">Last updated: {selectedIndicator.updatedAt.toLocaleDateString()}</div>
                </div>

                <h3 className="font-bold mb-2">Code Preview</h3>
                <pre className="bg-gray-900 p-3 rounded text-xs overflow-x-auto mb-4">
                  <code>{selectedIndicator.codeSnippet}</code>
                </pre>
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              <button className={`px-6 py-2 rounded font-bold ${
                selectedIndicator.price === 0 
                  ? 'bg-green-600 hover:bg-green-500' 
                  : 'bg-yellow-600 hover:bg-yellow-500'
              }`}>
                {selectedIndicator.price === 0 ? 'Download Free' : `Purchase for $${selectedIndicator.price}`}
              </button>
              <button
                onClick={() => setShowReviews(!showReviews)}
                className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded"
              >
                {showReviews ? 'Hide Reviews' : 'View Reviews'}
              </button>
              <button className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded">
                Add to Favorites
              </button>
            </div>

            {/* Reviews Section */}
            {showReviews && (
              <div className="border-t border-gray-700 pt-4">
                <h3 className="font-bold mb-4">User Reviews</h3>
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-gray-700 rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-bold">{review.username}</span>
                          <div className="flex mt-1">{renderStars(review.rating)}</div>
                        </div>
                        <span className="text-sm text-gray-400">{review.createdAt.toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-300 mb-2">{review.comment}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <button className="hover:text-gray-300">👍 Helpful ({review.helpful})</button>
                        <button className="hover:text-gray-300">Reply</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}