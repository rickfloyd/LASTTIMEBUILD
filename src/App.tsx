import React, { useState, useEffect } from "react";
import MinimalTheme from "./themes/MinimalTheme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Header from "./components/Header";
import MarketSummary from "./components/MarketSummary";
import ModeDashboard from "./components/ModeDashboard";
import AITradingUI from "./components/AITradingUI";
import Education from "./components/Education";
import Transparency from "./components/Transparency";
import Impact from "./components/Impact";
import LogoCandles from "./components/LogoCandles";
import PublicCommunityPage from "./pages/PublicCommunityPage";
import PrivateCommunityPage from "./pages/PrivateCommunityPage";
import IdeasPage from "./pages/IdeasPage";
import ScriptsPage from "./pages/ScriptsPage";
import ModeratorsPage from "./pages/ModeratorsPage";
import BrokersPage from "./pages/BrokersPage";
import TradingModeGrid from "./components/TradingModeGrid";
import WhatYouOwnPanel from "./components/WhatYouOwnPanel";
import AutomationRulesPanel from "./components/AutomationRulesPanel";
import RiskSizingPanel from "./components/RiskSizingPanel";
import JournalPanel from "./components/JournalPanel";

const Modal: React.FC<{ children: React.ReactNode, onClose: () => void, title: string }> = ({ children, onClose, title }) => (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border-2 border-neon-blue rounded-xl shadow-neon-blue w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold text-neon-green">{title}</h2>
                <button onClick={onClose} className="text-magenta text-3xl">&times;</button>
            </div>
            <div className="overflow-y-auto flex-grow p-4">
                {children}
            </div>
        </div>
    </div>
);

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-crystal-shadow min-h-screen flex flex-col items-center justify-center text-crystal-highlight text-center p-10">
          <h1 className="text-5xl font-bold animate-bounce-glow">Something went wrong</h1>
          <p className="mt-4 text-xl text-pulsing-cyan">The platform hit a glitch try refreshing or check the console.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Sidebar: React.FC = () => (
  <div className="w-80 bg-crystal-deep border-r border-crystal-glow p-6 min-h-screen">
    <div className="mb-2 flex items-center justify-start">
      <LogoCandles />
    </div>
    <h3 className="text-crystal-highlight font-bold text-lg mb-6 animate-cyber-pulse">AI Trading Platform</h3>
    <ul className="space-y-3 text-sm">
      <li className="flex items-center text-crystal-glow"><div className="w-3 h-3 bg-crystal-glow rounded-full mr-3"></div>Long-Term Mode</li>
      <li className="flex items-center text-crystal-glow"><div className="w-3 h-3 bg-crystal-glow rounded-full mr-3"></div>Crypto Mode</li>
      <li className="flex items-center text-crystal-glow"><div className="w-3 h-3 bg-crystal-glow rounded-full mr-3"></div>Futures Mode</li>
      <li className="flex items-center text-crystal-glow"><div className="w-3 h-3 bg-crystal-glow rounded-full mr-3"></div>News-Driven Mode</li>
      <li className="flex items-center text-crystal-glow"><div className="w-3 h-3 bg-crystal-glow rounded-full mr-3"></div>Options Mode</li>
      <li className="flex items-center text-crystal-glow"><div className="w-3 h-3 bg-crystal-glow rounded-full mr-3"></div>Price Action Mode</li>
      <li className="flex items-center text-crystal-glow"><div className="w-3 h-3 bg-crystal-glow rounded-full mr-3"></div>SMC Mode</li>
      <li className="flex items-center text-crystal-glow"><div className="w-3 h-3 bg-crystal-glow rounded-full mr-3"></div>Algo Mode</li>
      <li className="flex items-center text-crystal-glow"><div className="w-3 h-3 bg-crystal-glow rounded-full mr-3"></div>Scalper’s Mode</li>
      <li className="flex items-center text-crystal-glow"><div className="w-3 h-3 bg-crystal-glow rounded-full mr-3"></div>Swing Mode</li>
    </ul>
    <div className="mt-8 p-4 bg-crystal-glow/10 border border-crystal-glow rounded-lg">
      <p className="text-crystal-glow font-bold text-sm mb-2 animate-cyber-pulse">Revolutionary AI Trading Platform!</p>
      <p className="text-xs text-crystal-glow">Empowering traders with quantum-level insights and automation.</p>
    </div>
  </div>
);


function App() {
  const [theme, setTheme] = useState('neon');
  const [modal, setModal] = useState<{ component: React.ReactNode; title: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('siteTheme');
    if (stored) setTheme(stored);
  }, []);

  const handleToggle = () => {
    const next = theme === 'neon' ? 'minimal' : 'neon';
    setTheme(next);
    localStorage.setItem('siteTheme', next);
  };

  const openModal = (component: React.ReactNode, title: string) => {
    setModal({ component, title });
  };

  const closeModal = () => {
    setModal(null);
  };

  return (
    <Router future={{ v7_relativeSplatPath: true }}>
      <div className="App min-h-screen bg-charcoal-gradient border-8 border-transparent" style={{
        borderImage: 'linear-gradient(to right, #FF7124, #FF00A8) 1'
      }}>
        <ErrorBoundary>
          {modal && <Modal onClose={closeModal} title={modal.title}>{modal.component}</Modal>}
          {theme === 'minimal' ? null : (
            <button
              onClick={handleToggle}
              className="fixed top-4 left-4 z-50 px-4 py-2 rounded-lg font-bold text-xs bg-crystal-deep text-crystal-highlight border border-crystal-glow hover:bg-crystal-top hover:text-magenta transition-all"
              aria-label="Toggle site theme"
            >
              {theme === 'neon' ? 'Switch to Minimal Theme' : 'Switch to Neon Theme'}
            </button>
          )}
          <Routes>
            <Route path="/simple" element={<MinimalTheme />} />
            <Route path="/community/public" element={<PublicCommunityPage />} />
            <Route path="/community/private" element={<PrivateCommunityPage />} />
            <Route path="/community/ideas" element={<IdeasPage />} />
            <Route path="/community/scripts" element={<ScriptsPage />} />
            <Route path="/community/moderators" element={<ModeratorsPage />} />
            <Route path="/community/brokers" element={<BrokersPage />} />
          </Routes>

          {theme === 'minimal' ? (
            <MinimalTheme />
          ) : (
            <div className="flex">
              <Sidebar />
              <main className="flex-1">
                <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-2 md:py-6">
                  <Header />
                  <MarketSummary />
                  <ModeDashboard />
                  <div className="mt-8">
                    <TradingModeGrid />
                  </div>
                  <div className="mt-8">
                    <AITradingUI symbol="AAPL" />
                  </div>
                  <div className="mt-8">
                    <WhatYouOwnPanel />
                  </div>
                  <div className="mt-8">
                    <AutomationRulesPanel />
                  </div>
                  <div className="mt-8">
                    <RiskSizingPanel />
                  </div>
                  <div className="mt-8">
                    <JournalPanel />
                  </div>
                  <button onClick={() => openModal(<Education />, "Educational Initiatives")} className='w-full mt-8'><Education /></button>
                  <button onClick={() => openModal(<Transparency />, "Transparency & Open Source")} className='w-full mt-2'><Transparency /></button>
                  <button onClick={() => openModal(<Impact />, "Live Impact Stats")} className='w-full mt-2'><Impact /></button>
                  <Routes>
                    <Route path="/" element={<div />} />
                  </Routes>
                </div>
              </main>
            </div>
          )}
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
