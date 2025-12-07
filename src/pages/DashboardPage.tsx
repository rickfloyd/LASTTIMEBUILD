import React, { useState } from 'react';
import StockChart from '../components/StockChart';
import DashboardStats from '../components/dashboard/DashboardStats';
import { CommunityPanel } from '../components/dashboard/CommunityPanel';
import PriceComparison from '../components/PriceComparison'; 
import EngineControlPanel from '../components/engines/EngineControlPanel';
import SportsFeedPanel from '../components/SportsFeedPanel'; 
import AmericanSports from '../components/AmericanSports';
import WorldSports from '../components/WorldSports';
import MAKINGLIFEEASIER from '../components/MakingLifeEasier';
import CategoryFeeds from '../components/CategoryFeeds';
import QuantumNews from '../components/QuantumNews';
import { FiUsers, FiDollarSign, FiLayers, FiActivity, FiZap, FiCpu, FiAlertTriangle, FiGlobe, FiFlag, FiSmile, FiRss, FiBookOpen } from 'react-icons/fi';
import { askGemini } from '../GeminiBridge'; // Import the AI function

const DashboardPage: React.FC = () => {
  const [activeMode, setActiveMode] = useState('Long-Term');
  const [activeTheme, setActiveTheme] = useState('LUCID'); 
  const [showCommunity, setShowCommunity] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showSportsFeed, setShowSportsFeed] = useState(false);
  const [showAmericanSports, setShowAmericanSports] = useState(false);
  const [showWorldSports, setShowWorldSports] = useState(false);
  const [showMakingLifeEasier, setShowMakingLifeEasier] = useState(false);
  const [showCategoryFeeds, setShowCategoryFeeds] = useState(false);
  const [showQuantumNews, setShowQuantumNews] = useState(false);
  
  // New AI State
  const [aiPrediction, setAiPrediction] = useState("Awaiting command from AI Bridge.");
  const [aiLoading, setAiLoading] = useState(false);

  // 1. COLOR PALETTE 
  const colors = {
      green: '#39FF14',
      yellow: '#FFFF00',
      orange: '#FF7124',
      lime: '#7FFF00',
      cyan: '#00F7FF',
      orchid: '#CB0FFF',
      pink: '#FF007E',
      deepblue: '#00BFFF'
  };

  // --- NEW: AI COMMAND FUNCTION ---
  const handleAiPrediction = async () => {
      setAiLoading(true);
      setAiPrediction("Running Quantum Algorithm...");

      try {
          // This is a simplified prompt. In a real app, we'd send chart data.
          const currentPrice = 176.37; // Mock price from the stats card
          const prompt = `Analyze the current S&P 500 trend given high volatility and a price of $${currentPrice}. Provide a concise 2-sentence prediction for the next 48 hours.`;
          
          const result = await askGemini(prompt);
          setAiPrediction(result);
          
      } catch (e) {
          setAiPrediction("Error: Gemini connection failed. Check API Key/Network.");
      }
      setAiLoading(false);
  };
  // ------------------------------

  return (
    <div className="min-h-full bg-black text-white font-sans overflow-x-hidden">
      
      {/* 2. MAIN CONTENT AREA */}
      <main className="p-4 sm:p-8 relative">
        
        {/* TOP BAR */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">
            
            {/* LEFT: TITLE */}
            <div className="w-full xl:w-auto mb-4 xl:mb-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-black border border-[#00F7FF] flex items-center justify-center shadow-[0_0_15px_#00F7FF]">
                        <FiActivity className="text-xl text-[#00F7FF]" />
                    </div>
                    <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${colors.cyan}, ${colors.orchid})` }}>
                        AI QUANTUM CHARTS
                    </h1>
                </div>
            </div>

            {/* CENTER: THEME SELECTOR */}
            <div className="w-full xl:w-auto flex justify-center">
                <div className="flex bg-[#0A0A0F] p-1 rounded-xl border border-gray-800 shadow-lg overflow-x-auto max-w-full gap-1">
                    {['LUCID', 'MINIMAL', 'COLOR SENSITIVE'].map((theme) => (
                        <button
                            key={theme}
                            onClick={() => setActiveTheme(theme)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                                activeTheme === theme
                                ? 'bg-[#39FF14]/20 border-[#39FF14] text-[#39FF14] shadow-[0_0_15px_#39FF14]'
                                : 'border-transparent text-gray-500 hover:text-white'
                            }`}
                        >
                            {theme}
                        </button>
                    ))}
                </div>
            </div>

            {/* RIGHT: COMMUNITY, PRICING, & SPORTS */}
            <div className="w-full xl:w-auto flex flex-col gap-2 items-end">
                
                {/* COMMUNITY BUTTON */}
                <button 
                    onClick={() => setShowCommunity(true)}
                    className="w-full xl:w-48 flex items-center justify-center gap-2 bg-gradient-to-r from-[#00E6FF] to-[#00BFFF] hover:brightness-110 px-4 py-3 rounded-lg font-bold text-black shadow-[0_0_20px_#00E6FF] transition-all transform hover:scale-105"
                >
                    <FiUsers /> COMMUNITY
                </button>

                {/* COMPARE PRICES BUTTON */}
                <button 
                    onClick={() => setShowPricing(true)}
                    className="w-full xl:w-48 flex items-center justify-center gap-2 border-2 text-[#FF007E] hover:bg-[#FF007E] hover:text-white px-3 py-2 rounded-lg font-bold text-xs transition-all tracking-wider"
                    style={{ 
                        borderColor: colors.pink, 
                        boxShadow: `0 0 20px ${colors.cyan}` 
                    }}
                >
                    <FiDollarSign /> COMPARE PRICES
                </button>

                {/* SPORTSFIRE BUTTON */}
                <button 
                    onClick={() => setShowSportsFeed(true)}
                    className="w-full xl:w-48 flex items-center justify-center gap-2 border-2 text-[#FFFF00] hover:bg-[#FFFF00] hover:text-black px-3 py-2 rounded-lg font-bold text-xs transition-all tracking-wider"
                    style={{ 
                        borderColor: colors.yellow, 
                        boxShadow: `0 0 20px ${colors.lime}` 
                    }}
                >
                    <FiZap /> SPORTSFIRE FEED
                </button>

                 {/* CATEGORY FEEDS BUTTON */}
                <button 
                    onClick={() => setShowCategoryFeeds(true)}
                    className="w-full xl:w-48 flex items-center justify-center gap-2 border-2 text-lime-400 hover:bg-lime-400 hover:text-white px-3 py-2 rounded-lg font-bold text-xs transition-all tracking-wider"
                    style={{ 
                        borderColor: 'lime', 
                        boxShadow: `0 0 20px lime` 
                    }}
                >
                    <FiRss /> MARKET FEEDS
                </button>

                {/* QUANTUM NEWS BUTTON */}
                <button 
                    onClick={() => setShowQuantumNews(true)}
                    className="w-full xl:w-48 flex items-center justify-center gap-2 border-2 text-orange-400 hover:bg-orange-400 hover:text-white px-3 py-2 rounded-lg font-bold text-xs transition-all tracking-wider"
                    style={{ 
                        borderColor: 'orange', 
                        boxShadow: `0 0 20px orange` 
                    }}
                >
                    <FiBookOpen /> QUANTUM NEWS
                </button>


                {/* AMERICAN SPORTS BUTTON */}
                <button 
                    onClick={() => setShowAmericanSports(true)}
                    className="w-full xl:w-48 flex items-center justify-center gap-2 border-2 text-blue-400 hover:bg-blue-400 hover:text-white px-3 py-2 rounded-lg font-bold text-xs transition-all tracking-wider"
                    style={{ 
                        borderColor: 'blue', 
                        boxShadow: `0 0 20px blue` 
                    }}
                >
                    <FiFlag /> AMERICAN SPORTS
                </button>

                {/* WORLD SPORTS BUTTON */}
                <button 
                    onClick={() => setShowWorldSports(true)}
                    className="w-full xl:w-48 flex items-center justify-center gap-2 border-2 text-green-400 hover:bg-green-400 hover:text-white px-3 py-2 rounded-lg font-bold text-xs transition-all tracking-wider"
                    style={{ 
                        borderColor: 'green', 
                        boxShadow: `0 0 20px green` 
                    }}
                >
                    <FiGlobe /> WORLD SPORTS
                </button>

                {/* MAKING LIFE EASIER BUTTON */}
                <button 
                    onClick={() => setShowMakingLifeEasier(true)}
                    className="w-full xl:w-48 flex items-center justify-center gap-2 border-2 text-purple-400 hover:bg-purple-400 hover:text-white px-3 py-2 rounded-lg font-bold text-xs transition-all tracking-wider"
                    style={{ 
                        borderColor: 'purple', 
                        boxShadow: `0 0 20px purple` 
                    }}
                >
                    <FiSmile /> MAKING LIFE EASIER
                </button>
            </div>
        </div>

        {/* 4. KEY STATS CARDS */}
        <DashboardStats />

        {/* 5. VISUAL COMMAND CENTER CHART AREA */}
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-3/4">
                <StockChart />
            </div>

            {/* AI PREDICTION PANEL (NEW) */}
            <div className="lg:w-1/4 bg-[#0A0A0F] p-4 rounded-xl border border-gray-700 shadow-lg">
                <h3 className="text-lg font-bold text-cyan-400 mb-3 border-b border-gray-800 pb-2 flex items-center gap-2">
                    <FiCpu className="text-pink-500" /> AI PREDICTION
                </h3>
                
                <p className="text-xs text-gray-400 mb-4 h-16 overflow-y-auto">
                    {aiPrediction}
                </p>

                <button 
                    onClick={handleAiPrediction}
                    disabled={aiLoading}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-bold text-xs transition-all ${
                        aiLoading 
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-500 text-black'
                    }`}
                >
                    {aiLoading ? <FiActivity className="animate-spin" /> : <FiZap />}
                    {aiLoading ? "ANALYZING..." : "RUN AI QUANTUM"}
                </button>

                <div className="mt-4 text-center text-[10px] text-gray-500">
                    <FiAlertTriangle className="inline mr-1 text-yellow-500" /> For informational use only.
                </div>
            </div>
        </div>


      </main>

      {/* EXTRAS */}
      {showCommunity && <CommunityPanel onClose={() => setShowCommunity(false)} />}
      {showPricing && <PriceComparison onClose={() => setShowPricing(false)} />}
      {showSportsFeed && <SportsFeedPanel onClose={() => setShowSportsFeed(false)} />}
      {showAmericanSports && <AmericanSports onClose={() => setShowAmericanSports(false)} />}
      {showWorldSports && <WorldSports onClose={() => setShowWorldSports(false)} />}
      {showCategoryFeeds && <CategoryFeeds onClose={() => setShowCategoryFeeds(false)} />}
      {showQuantumNews && <QuantumNews onClose={() => setShowQuantumNews(false)} />}
      {showMakingLifeEasier && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-6xl">
                <MAKINGLIFEEASIER />
                <button
                    onClick={() => setShowMakingLifeEasier(false)}
                    className="absolute top-4 right-4 bg-deep-black/80 text-white border border-fluorescent-pink rounded-full p-2 text-xl z-10 hover:bg-fluorescent-pink hover:text-deep-black shadow-neon-pink"
                >
                    &times;
                </button>
            </div>
        </div>
      )}
      <EngineControlPanel />

    </div>
  );
};

export default DashboardPage;