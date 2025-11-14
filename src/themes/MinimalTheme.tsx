import React, { useState } from "react";
import SimpleTabs from "../components/SimpleTabs";
import AnimatedLogo from "../components/AnimatedLogo";

const MinimalTheme: React.FC = () => {
  const [activeTab, setActiveTab] = useState("forex");

  const tabs = [
    { id: "forex", label: "FOREX" },
    { id: "crypto", label: "CRYPTO" },
    { id: "stocks", label: "STOCKS" },
    { id: "bonds", label: "BONDS" },
    { id: "indices", label: "INDICES" },
    { id: "futures", label: "FUTURES" },
  ];

  return (
    <div className="bg-gradient-to-b from-black via-gray-950 to-black min-h-screen text-gray-100">
      <header className="flex flex-col items-start px-6 py-4 border-b border-pink-900/30">
        <div className="flex items-center space-x-3">
          <AnimatedLogo />
          <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            AI QUANTUM CHARTS
          </span>
        </div>
        {/* Theme toggle button below logo, spaced by margin */}
        <button
          onClick={() => {
            const next = 'neon';
            window.localStorage.setItem('siteTheme', next);
            window.location.reload();
          }}
          className="mt-8 mb-2 px-4 py-2 rounded-lg font-bold text-xs bg-gray-900 text-pink-400 border border-pink-500 shadow-neon-pink hover:bg-pink-900 hover:text-white transition-all"
          aria-label="Switch to Neon Theme"
        >
          Switch to Neon Theme
        </button>
        <nav className="flex items-center space-x-6 text-base mt-2">
          <a href="#exchange" className="text-pink-400 hover:text-pink-300">
            Exchange
          </a>
          <a href="#markets" className="text-blue-400 hover:text-blue-300">
            Markets
          </a>
          <a href="#wallet" className="text-pink-400 hover:text-pink-300">
            Wallet
          </a>
          <a href="#login" className="text-blue-400 hover:text-blue-300">
            Login
          </a>
        </nav>
      </header>

      <div className="bg-transparent">
        <div className="max-w-6xl mx-auto px-4">
          <div className="py-4 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-wider bg-gradient-to-r from-pink-400 via-pink-500 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(255,105,180,0.35)]">
              SIMPLE VIEW • AI QUANTUM CHARTS
            </h2>
          </div>
        </div>
      </div>

      <div className="border-b border-pink-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-bold text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-pink-600 to-blue-600 text-white border-b-2 border-pink-400"
                    : "text-gray-400 hover:text-pink-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
          {tabs.find((t) => t.id === activeTab)?.label} Market Summary
        </h1>

        <SimpleTabs />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-pink-950/50 to-blue-950/50 rounded-lg p-6 border border-pink-900/30">
            <div className="flex items-center mb-2">
              <span className="bg-gradient-to-r from-pink-600 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold mr-2">
                BTC
              </span>
              <span className="font-semibold text-pink-300">BTC/USDT</span>
            </div>
            <div className="text-2xl font-bold mb-1">37,058.22</div>
            <div className="text-sm text-blue-400">+1.8%</div>
          </div>
          <div className="bg-gradient-to-br from-blue-950/50 to-pink-950/50 rounded-lg p-6 border border-blue-900/30">
            <div className="flex items-center mb-2">
              <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold mr-2">
                ETH
              </span>
              <span className="font-semibold text-blue-300">ETH/USDT</span>
            </div>
            <div className="text-2xl font-bold mb-1">2,564.81</div>
            <div className="text-sm text-pink-400">+7.3%</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-950/30 to-blue-950/30 rounded-lg p-6 mb-8 border border-pink-900/30">
          <h2 className="text-lg font-bold mb-4 bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
            BTC/USD Chart
          </h2>
          <div className="h-48 flex items-center justify-center text-gray-500">[Chart Placeholder]</div>
        </div>

        <form className="bg-gradient-to-br from-blue-950/30 to-pink-950/30 rounded-lg p-6 flex flex-col gap-4 max-w-md mx-auto border border-blue-900/30">
          <label className="text-sm font-semibold text-pink-300">Sell BTC</label>
          <input
            type="number"
            placeholder="Amount"
            className="bg-black/50 text-gray-100 rounded px-3 py-2 border border-pink-900/30 focus:border-pink-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Price"
            className="bg-black/50 text-gray-100 rounded px-3 py-2 border border-blue-900/30 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-pink-600 to-blue-600 text-white font-bold py-2 rounded hover:from-pink-500 hover:to-blue-500"
          >
            Sell
          </button>
        </form>
      </main>

      <footer className="text-center py-6 text-gray-500 text-xs border-t border-pink-900/30 mt-8">
        Quantum Charts &copy; 2025. Minimal version for accessibility and focus.
      </footer>
    </div>
  );
};

export default MinimalTheme;
