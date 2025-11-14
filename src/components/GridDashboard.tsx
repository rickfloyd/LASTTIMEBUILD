import React, { useState } from 'react';
import { 
  TrendingUp, 
  BookOpen, 
  UtensilsCrossed, 
  Share2, 
  ShoppingBag, 
  Play, 
  Heart,
  ExternalLink,
  Clock,
  Star,
  BarChart3
} from 'lucide-react';
import EnhancedChart from './EnhancedChart';

interface GridSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  items: GridItem[];
  description: string;
}

interface GridItem {
  name: string;
  url: string;
  description: string;
  logo?: string;
  isPopular?: boolean;
}

const GridDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('charts');

  const gridSections: GridSection[] = [
    {
      id: 'charts',
      title: 'Trading Charts',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'from-cyan-400 to-blue-600',
      description: '100% Independent Trading Charts - Cannot Be Shut Down',
      items: []
    },
    {
      id: 'financial',
      title: 'Financial News',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-green-400 to-emerald-600',
      description: 'Stay updated with real-time financial news and market analysis',
      items: [
        { name: 'Bloomberg', url: 'https://bloomberg.com', description: 'Global financial news and data', isPopular: true },
        { name: 'CNBC', url: 'https://cnbc.com', description: 'Business news and market updates' },
        { name: 'Reuters Finance', url: 'https://reuters.com/finance', description: 'Breaking financial news' },
        { name: 'MarketWatch', url: 'https://marketwatch.com', description: 'Stock market news and analysis', isPopular: true },
        { name: 'Yahoo Finance', url: 'https://finance.yahoo.com', description: 'Financial news and data' },
        { name: 'Financial Times', url: 'https://ft.com', description: 'Global financial journalism' },
        { name: 'Wall Street Journal', url: 'https://wsj.com', description: 'Business and financial news', isPopular: true },
        { name: 'Seeking Alpha', url: 'https://seekingalpha.com', description: 'Stock analysis and insights' }
      ]
    },
    {
      id: 'magazines',
      title: 'Popular Magazines',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'from-purple-400 to-violet-600',
      description: 'Access to popular magazines and publications',
      items: [
        { name: 'Time Magazine', url: 'https://time.com', description: 'News and current affairs', isPopular: true },
        { name: 'National Geographic', url: 'https://nationalgeographic.com', description: 'Science and nature' },
        { name: 'The Atlantic', url: 'https://theatlantic.com', description: 'Politics and culture', isPopular: true },
        { name: 'Scientific American', url: 'https://scientificamerican.com', description: 'Science and technology' },
        { name: 'Wired', url: 'https://wired.com', description: 'Technology and innovation' },
        { name: 'The Economist', url: 'https://economist.com', description: 'Global affairs and economics', isPopular: true },
        { name: 'Fortune', url: 'https://fortune.com', description: 'Business and finance' },
        { name: 'Forbes', url: 'https://forbes.com', description: 'Business and entrepreneurship' }
      ]
    },
    {
      id: 'food',
      title: 'Food Ordering',
      icon: <UtensilsCrossed className="w-6 h-6" />,
      color: 'from-orange-400 to-red-600',
      description: 'Order food from your favorite restaurants',
      items: [
        { name: 'DoorDash', url: 'https://doordash.com', description: 'Food delivery service', isPopular: true },
        { name: 'Uber Eats', url: 'https://ubereats.com', description: 'Restaurant delivery' },
        { name: 'Grubhub', url: 'https://grubhub.com', description: 'Online food ordering', isPopular: true },
        { name: 'Postmates', url: 'https://postmates.com', description: 'Delivery service' },
        { name: 'Seamless', url: 'https://seamless.com', description: 'Food delivery and pickup' },
        { name: 'Zomato', url: 'https://zomato.com', description: 'Restaurant discovery and delivery' },
        { name: 'Skip The Dishes', url: 'https://skipthedishes.com', description: 'Canadian food delivery' },
        { name: 'Just Eat', url: 'https://just-eat.com', description: 'International food delivery' }
      ]
    },
    {
      id: 'social',
      title: 'Social Media',
      icon: <Share2 className="w-6 h-6" />,
      color: 'from-blue-400 to-cyan-600',
      description: 'Connect with all your social networks',
      items: [
        { name: 'Twitter/X', url: 'https://x.com', description: 'Real-time social updates', isPopular: true },
        { name: 'Instagram', url: 'https://instagram.com', description: 'Photo and video sharing', isPopular: true },
        { name: 'Facebook', url: 'https://facebook.com', description: 'Social networking platform' },
        { name: 'LinkedIn', url: 'https://linkedin.com', description: 'Professional networking', isPopular: true },
        { name: 'TikTok', url: 'https://tiktok.com', description: 'Short-form video content' },
        { name: 'YouTube', url: 'https://youtube.com', description: 'Video sharing platform', isPopular: true },
        { name: 'Reddit', url: 'https://reddit.com', description: 'Social news aggregation' },
        { name: 'Discord', url: 'https://discord.com', description: 'Voice and text chat' }
      ]
    },
    {
      id: 'shopping',
      title: 'Shopping',
      icon: <ShoppingBag className="w-6 h-6" />,
      color: 'from-pink-400 to-rose-600',
      description: 'Shop from top online retailers',
      items: [
        { name: 'Amazon', url: 'https://amazon.com', description: 'Online marketplace', isPopular: true },
        { name: 'eBay', url: 'https://ebay.com', description: 'Auction and shopping' },
        { name: 'Walmart', url: 'https://walmart.com', description: 'Retail shopping', isPopular: true },
        { name: 'Target', url: 'https://target.com', description: 'Department store' },
        { name: 'Best Buy', url: 'https://bestbuy.com', description: 'Electronics retailer' },
        { name: 'Costco', url: 'https://costco.com', description: 'Warehouse club' },
        { name: 'Etsy', url: 'https://etsy.com', description: 'Handmade and vintage items' },
        { name: 'Shopify', url: 'https://shopify.com', description: 'E-commerce platform' }
      ]
    },
    {
      id: 'entertainment',
      title: 'Entertainment',
      icon: <Play className="w-6 h-6" />,
      color: 'from-indigo-400 to-purple-600',
      description: 'Stream movies, shows, and entertainment',
      items: [
        { name: 'Netflix', url: 'https://netflix.com', description: 'Streaming service', isPopular: true },
        { name: 'Disney+', url: 'https://disneyplus.com', description: 'Disney streaming platform' },
        { name: 'Hulu', url: 'https://hulu.com', description: 'TV shows and movies', isPopular: true },
        { name: 'HBO Max', url: 'https://hbomax.com', description: 'Premium content streaming' },
        { name: 'Prime Video', url: 'https://primevideo.com', description: 'Amazon streaming service' },
        { name: 'Apple TV+', url: 'https://tv.apple.com', description: 'Apple original content' },
        { name: 'Paramount+', url: 'https://paramountplus.com', description: 'CBS and Paramount content' },
        { name: 'Peacock', url: 'https://peacocktv.com', description: 'NBCUniversal streaming' }
      ]
    }
  ];

  const currentSection = gridSections.find(section => section.id === activeSection);

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6">
      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700 pb-4">
        {gridSections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeSection === section.id
                ? `bg-gradient-to-r ${section.color} text-white shadow-lg`
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {section.icon}
            <span>{section.title}</span>
          </button>
        ))}
      </div>

      {/* Current Section Content */}
      {currentSection && (
        <div>
          {activeSection === 'charts' ? (
            <div>
              <div className="mb-6">
                <h2 className={`text-2xl font-bold bg-gradient-to-r ${currentSection.color} bg-clip-text text-transparent mb-2`}>
                  {currentSection.title}
                </h2>
                <p className="text-gray-400">{currentSection.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">🔥 No TradingView</span>
                  <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">🛡️ Can't Be Shut Down</span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">⚡ 100% Independent</span>
                </div>
              </div>
              <EnhancedChart />
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h2 className={`text-2xl font-bold bg-gradient-to-r ${currentSection.color} bg-clip-text text-transparent mb-2`}>
                  {currentSection.title}
                </h2>
                <p className="text-gray-400">{currentSection.description}</p>
              </div>

              {/* Grid of Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentSection.items.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => openLink(item.url)}
                    className="group bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-cyan-500/50 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 transform hover:scale-105"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentSection.color}`}></div>
                        <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                          {item.name}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-1">
                        {item.isPopular && (
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        )}
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      {item.description}
                    </p>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500">Click to visit</span>
                      <div className={`w-8 h-1 rounded-full bg-gradient-to-r ${currentSection.color} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Last updated: Just now</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{currentSection.items.filter(item => item.isPopular).length} popular items</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span>Curated for traders</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GridDashboard;