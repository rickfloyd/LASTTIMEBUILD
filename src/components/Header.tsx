import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { useNewsData } from '../hooks/useNewsData';

const Header = () => {
  const [showPersonalities, setShowPersonalities] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Use news data hook for personality switching
  const { switchPersonality } = useNewsData();

  const personalities = [
    { name: 'Republican', description: 'Conservative market analysis', color: 'text-electric-orange' },
    { name: 'Democrat', description: 'Progressive economic insights', color: 'text-fluorescent-blue' },
    { name: 'Liberal', description: 'Social-focused market views', color: 'text-neon-green' },
    { name: 'Independent', description: 'Unbiased market perspective', color: 'text-pulsing-cyan' }
  ];

  const moreItems = [
    'Options Trading',
    'Forex Analysis',
    'Commodity Markets',
    'Economic Calendar',
    'News & Analysis'
  ];

  const handlePersonalityClick = (personality: string) => {
    switchPersonality(personality.toLowerCase() as 'republican' | 'democrat' | 'liberal' | 'independent');
    console.log(`Switched to ${personality} news perspective`);
    setShowPersonalities(false);
  };

  const handleMoreItemClick = (item: string) => {
    console.log(`Selected: ${item}`);
    setShowMore(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Searching for: ${searchQuery}`);
  };

  return (
    <header className="bg-charcoal-gradient border-b-2 border-fluorescent-pink shadow-neon-pink px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-fluorescent-gradient rounded-lg flex items-center justify-center shadow-neon-blue hover:animate-pulse-glow transition-all duration-300 cursor-pointer">
            <img 
              src="/pink.png" 
              alt="AI Quantum Charts Logo" 
             className="w-12 h-12 object-contain hover:animate-pulse-glow transition-all duration-300 cursor-pointer"
             style={{ filter: 'drop-shadow(0 0 2px black) drop-shadow(0 0 4px black)' }}
            />
            </div>
            <div className="group-hover:animate-pulse">
              <h1 className="text-xl font-bold text-fluorescent-pink drop-shadow-lg">AI QUANTUM</h1>
              <h2 className="text-xl font-bold text-electric-orange drop-shadow-lg">CHARTS</h2>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <div className="relative">
            <button 
              onClick={() => setShowPersonalities(!showPersonalities)}
              className="text-fluorescent-pink hover:text-pulsing-cyan transition-all duration-300 hover:shadow-neon-cyan px-3 py-2 rounded-lg hover:bg-charcoal/50 font-semibold"
            >
              Personalities
            </button>
            {showPersonalities && (
              <div className="absolute top-full left-0 mt-2 py-2 bg-deep-black border-2 border-fluorescent-blue rounded-lg shadow-neon-blue z-50 min-w-[250px] animate-slide-in">
                {personalities.map((personality) => (
                  <button
                    key={personality.name}
                    onClick={() => handlePersonalityClick(personality.name)}
                    className="block w-full text-left px-4 py-3 hover:bg-charcoal transition-all duration-200 hover:shadow-neon-pink"
                  >
                    <div className={`font-bold ${personality.color}`}>{personality.name}</div>
                    <div className="text-xs text-gray-300">{personality.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={() => {
              // Scroll to educational impact section
              const element = document.querySelector('.educational-impact-section');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-green-400 hover:text-green-300 transition-all duration-300 hover:shadow-neon-green px-3 py-2 rounded-lg hover:bg-charcoal/50 font-semibold flex items-center space-x-1"
          >
            <span>💚</span>
            <span>Impact</span>
          </button>
          
          {['Sports Betting', 'Sports', 'World Sports', 'Products', 'Markets'].map((item, index) => (
            <button 
              key={item}
              onClick={() => console.log(`${item} clicked`)}
              className={`font-semibold transition-all duration-300 px-3 py-2 rounded-lg hover:bg-charcoal/50 ${
                index % 2 === 0 
                  ? 'text-fluorescent-blue hover:text-electric-purple hover:shadow-neon-blue' 
                  : 'text-electric-orange hover:text-electric-yellow hover:shadow-neon-orange'
              }`}
            >
              {item}
            </button>
          ))}
          
          {/* Platform Selector with 18+ Warnings */}
          <div className="relative">
            <button 
              onClick={() => setShowMore(!showMore)}
              className="text-pulsing-cyan hover:text-neon-green transition-all duration-300 hover:shadow-neon-cyan px-3 py-2 rounded-lg hover:bg-charcoal/50 font-semibold"
            >
              More
            </button>
            {showMore && (
              <div className="absolute top-full left-0 mt-2 py-2 bg-deep-black border-2 border-electric-purple rounded-lg shadow-neon-blue z-50 min-w-[280px] animate-slide-in">
                <div className="px-4 py-2 border-b border-hot-pink/50">
                  <div className="text-hot-pink font-bold text-sm animate-pulse">🔞 ADULT PLATFORMS (18+)</div>
                  <div className="text-xs text-gray-400">Age verification required</div>
                </div>
                
                <a
                  href="http://localhost:5173"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-3 text-fluorescent-pink hover:bg-charcoal transition-all duration-200 hover:shadow-neon-pink"
                >
                  <div className="font-bold flex items-center">
                    <span className="mr-2">🎮</span>
                    Gaming Portal
                    <span className="ml-auto text-xs bg-hot-pink text-white px-2 py-1 rounded animate-pulse font-bold">18+</span>
                  </div>
                  <div className="text-xs text-gray-300">Secure chat, vault system, adult gaming</div>
                </a>
                
                <a
                  href="http://localhost:5174"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-3 text-fluorescent-blue hover:bg-charcoal transition-all duration-200 hover:shadow-neon-blue"
                >
                  <div className="font-bold flex items-center">
                    <span className="mr-2">⛏️</span>
                    Crypto Mining Hub
                    <span className="ml-auto text-xs bg-hot-pink text-white px-2 py-1 rounded animate-pulse font-bold">18+</span>
                  </div>
                  <div className="text-xs text-gray-300">Mining calculations, financial risks, adult content</div>
                </a>
                
                <div className="px-4 py-2 border-t border-electric-purple/30 mt-2">
                  <div className="text-pulsing-cyan font-bold text-sm">📊 TRADING PLATFORM</div>
                  <div className="text-xs text-gray-400">Current platform - professional trading</div>
                </div>
                
                {moreItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleMoreItemClick(item)}
                    className="block w-full text-left px-4 py-3 text-fluorescent-pink hover:bg-charcoal hover:text-electric-yellow transition-all duration-200"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right side navigation */}
        <div className="flex items-center space-x-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pulsing-cyan w-4 h-4 group-hover:text-electric-yellow transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search markets..."
                className="bg-deep-black text-fluorescent-pink placeholder-gray-400 border-2 border-fluorescent-blue rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-pulsing-cyan focus:shadow-neon-cyan transition-all duration-300 hover:shadow-neon-blue"
              />
            </div>
          </form>

          <div className="hidden md:flex items-center space-x-4 text-sm">
            {['Stocks', 'Community', 'Markets', 'Brokers'].map((item, index) => (
              <button 
                key={item}
                onClick={() => console.log(`${item} clicked`)}
                className={`font-semibold transition-all duration-300 px-3 py-2 rounded-lg hover:bg-charcoal/50 ${
                  index % 2 === 0 
                    ? 'text-fluorescent-pink hover:text-hot-pink hover:shadow-neon-pink' 
                    : 'text-fluorescent-blue hover:text-pulsing-cyan hover:shadow-neon-blue'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden text-fluorescent-pink hover:text-pulsing-cyan transition-all duration-300 hover:shadow-neon-pink p-2 rounded-lg"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden mt-4 py-4 border-t-2 border-electric-purple animate-slide-in">
          <div className="space-y-2">
            {['Personalities', 'Sports Betting', 'Sports', 'World Sports', 'Products', 'Markets'].map((item, index) => (
              <button 
                key={item}
                onClick={() => console.log(`${item} clicked`)}
                className={`block w-full text-left py-3 px-4 rounded-lg transition-all duration-300 font-semibold ${
                  index % 3 === 0 
                    ? 'text-fluorescent-pink hover:text-hot-pink hover:bg-charcoal/50' 
                    : index % 3 === 1
                    ? 'text-fluorescent-blue hover:text-pulsing-cyan hover:bg-charcoal/50'
                    : 'text-electric-orange hover:text-electric-yellow hover:bg-charcoal/50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;