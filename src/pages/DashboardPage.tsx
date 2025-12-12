import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StockChart from '../components/StockChart';
import DashboardStats from '../components/dashboard/DashboardStats';
import { CommunityPanel } from '../components/dashboard/CommunityPanel';
import PriceComparison from '../components/PriceComparison'; 
import EngineControlPanel from '../components/engines/EngineControlPanel';
import SportsFeedPanel from '../components/SportsFeedPanel'; 
import { DashboardModeGrid } from '../components/dashboard/DashboardModeGrid'; // The 25 Cards
import { FiUsers, FiDollarSign, FiLayers, FiActivity, FiZap, FiCpu, FiAlertTriangle, FiLayout, FiHeart } from 'react-icons/fi';
import { askGemini } from '../GeminiBridge'; // Import the AI function

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<string | null>(null); 
  const [activeTheme, setActiveTheme] = useState('LUCID'); 
  const [showCommunity, setShowCommunity] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showSportsFeed, setShowSportsFeed] = useState(false);
  const [showSimplePleasures, setShowSimplePleasures] = useState(false); // NEW STATE FOR SIMPLE PLEASURES
  const [mainView, setMainView] = useState<'grid' | 'chart'>('grid'); // FORCED TO GRID START
  
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

  const handleAiPrediction = async () => {
      setAiLoading(true);
      setAiPrediction("Running Quantum Algorithm...");

      try {
          const currentPrice = 176.37; 
          const prompt = `Analyze the current S&P 500 trend given high volatility and a price of $${currentPrice}. Provide a concise 2-sentence prediction for the next 48 hours.`;
          
          const result = await askGemini(prompt);
          setAiPrediction(result);
          
      } catch (e) {
          setAiPrediction("Error: Gemini connection failed. Check API Key/Network.");
      }
      setAiLoading(false);
  };

  // NEW: Simple Pleasures Navigation Function
  const handleSimplePleasuresClick = () => {
      // NOTE: Using state to show a modal/panel is usually better for overlays.
      // If you want a full page route: navigate('/simple-pleasures'); 
      // For now, we'll use state to show the modal (as requested earlier).
      setShowSimplePleasures(true);
  };

  return (
    <div className="min-h-full bg-black text-white font-sans overflow-x-hidden">
      
      {/* 2. MAIN CONTENT AREA */}
      <main className="p-4 sm:p-8 relative">
        
        {/* TOP BAR */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">
            
            {/* LEFT: TITLE & VIEW SWITCH */}
            <div className="w-full xl:w-auto mb-4 xl:mb-0 flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-black border border-[#00F7FF] flex items-center justify-center shadow-[0_0_15px_#00F7FF]">
                        <FiActivity className="text-xl text-[#00F7FF]" />
                    </div>
                    <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${colors.cyan}, ${colors.orchid})` }}>
                        AI QUANTUM CHARTS
                    </h1>
                </div>

                <button
                    onClick={() => setMainView(mainView === 'grid' ? 'chart' : 'grid')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-gray-700 text-gray-400 hover:text-green-500 hover:border-green-500"
                >
                    <FiLayout /> {mainView === 'grid' ? 'SHOW CHART' : 'SHOW GRID (25 MODES)'}
                </button>
            </div>

            {/* CENTER: THEME SELECTOR & SIMPLE PLEASURES BUTTON */}
            <div className="w-full xl:w-auto flex justify-center items-center gap-4">
                
                {/* THEME SELECTOR */}
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

                {/* SIMPLE PLEASURES BUTTON (HOT PINK CARD) - NOW ROUTES TO PAGE */}
                <button 
                    onClick={handleSimplePleasuresClick}
                    className="flex items-center justify-center bg-[#0A0A0F] border border-qc-pink text-qc-pink px-3 py-2 rounded-lg font-bold text-xs shadow-[0_0_15px_rgba(255,0,126,0.6)] hover:shadow-[0_0_25px_rgba(255,0,126,0.9)] transition-all"
                    style={{ borderColor: colors.pink, color: colors.pink }}
                >
                    <FiHeart className="mr-1" /> SIMPLE PLEASURES
                </button>
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

                {/* SPORTSFIRE BUTTON (NEW) */}
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
            </div>
        </div>

        {/* --- MAIN CONTENT SWITCH --- */}
        {/* THIS SECTION IS NOW THE 25-CARD GRID */}
        {mainView === 'grid' && (
            <div className="mt-8">
                 <h2 className="text-xl font-black text-cyan-400 mb-6">Quantum Mode Selector (25 Modules)</h2>
                 <DashboardModeGrid />
            </div>
        )}
        
        {/* THIS SECTION IS THE CHART VIEW (When grid is toggled off) */}
        {mainView === 'chart' && (
            <>
                {/* 4. KEY STATS CARDS */}
                <DashboardStats />

                {/* 5. VISUAL COMMAND CENTER CHART AREA */}
                <div className="flex flex-col lg:flex-row gap-6 mt-8">
                    <div className="lg:w-3/4">
                        <StockChart />
                    </div>

                    {/* AI PREDICTION PANEL */}
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
            </>
        )}


      </main>

      {/* EXTRAS */}
      {showCommunity && <CommunityPanel onClose={() => setShowCommunity(false)} />}
      {showPricing && <PriceComparison onClose={() => setShowPricing(false)} />}
      {showSportsFeed && <SportsFeedPanel onClose={() => setShowSportsFeed(false)} />}
      {/* ADDED MISSING SIMPLE PLEASURES MODAL */}
      {showSimplePleasures && <SimplePleasuresPanel onClose={() => setShowSimplePleasures(false)} />} 
      <EngineControlPanel />

    </div>
  );
};

export default DashboardPage; 