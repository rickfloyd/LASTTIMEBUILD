import React, { useState, useEffect } from "react";
import MinimalTheme from "./themes/MinimalTheme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Header from "./components/Header";
import MarketSummary from "./components/MarketSummary";
import MarketDataTabs from "./components/MarketDataTabs";
import Education from "./components/Education";
import Transparency from "./components/Transparency";
import Impact from "./components/Impact";
import LogoCandles from "./components/LogoCandles";

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
        <div className="bg-deep-black min-h-screen flex flex-col items-center justify-center text-fluorescent-pink text-center p-10">
          <h1 className="text-5xl font-bold animate-bounce-glow">Something went wrong</h1>
          <p className="mt-4 text-xl text-pulsing-cyan">The platform hit a glitch try refreshing or check the console.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const PlatformStatus: React.FC = () => (
  <div className="fixed top-4 right-4 bg-gray-900 border border-neon-green rounded-lg p-3 text-sm z-50 shadow-neon-green">
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
      <span className="text-neon-green font-bold">Platform Status: Online</span>
    </div>
    <div className="text-gray-300 text-xs mt-1">
      AI Models: Active | Market Data: Live | APIs: Connected
    </div>
  </div>
);

const Sidebar: React.FC = () => (
  <div className="w-80 bg-deep-black border-r border-pulsing-cyan p-6 min-h-screen">
    <div className="mb-2 flex items-center justify-start">
      <LogoCandles />
    </div>
    <h3 className="text-fluorescent-pink font-bold text-lg mb-6 animate-cyber-pulse">AI Trading Platform</h3>
    <ul className="space-y-3 text-sm">
      <li className="flex items-center text-pulsing-cyan"><div className="w-3 h-3 bg-neon-green rounded-full mr-3"></div>AI Price Prediction Engine</li>
      <li className="flex items-center text-pulsing-cyan"><div className="w-3 h-3 bg-neon-green rounded-full mr-3"></div>ML Pattern Recognition</li>
      <li className="flex items-center text-pulsing-cyan"><div className="w-3 h-3 bg-neon-green rounded-full mr-3"></div>Sentiment Analysis AI</li>
      <li className="flex items-center text-pulsing-cyan"><div className="w-3 h-3 bg-neon-green rounded-full mr-3"></div>Smart Risk Management</li>
      <li className="flex items-center text-pulsing-cyan"><div className="w-3 h-3 bg-neon-green rounded-full mr-3"></div>Automated Trading Signals</li>
      <li className="flex items-center text-pulsing-cyan"><div className="w-3 h-3 bg-neon-green rounded-full mr-3"></div>Neural Networks & LSTM</li>
      <li className="flex items-center text-pulsing-cyan"><div className="w-3 h-3 bg-neon-green rounded-full mr-3"></div>Advanced Drawing Tools</li>
      <li className="flex items-center text-pulsing-cyan"><div className="w-3 h-3 bg-neon-green rounded-full mr-3"></div>Real-Time Market Data</li>
      <li className="flex items-center text-pulsing-cyan"><div className="w-3 h-3 bg-neon-green rounded-full mr-3"></div>Portfolio Management</li>
      <li className="flex items-center text-pulsing-cyan"><div className="w-3 h-3 bg-neon-green rounded-full mr-3"></div>Custom Scripting Engine</li>
    </ul>
    <div className="mt-8 p-4 bg-fluorescent-blue/10 border border-fluorescent-blue rounded-lg">
      <p className="text-fluorescent-blue font-bold text-sm mb-2 animate-cyber-pulse">Revolutionary AI Trading Platform!</p>
      <p className="text-xs text-pulsing-cyan">Empowering traders with quantum-level insights and automation.</p>
    </div>
  </div>
);


function App() {
  // Theme toggle state and logic
  const [theme, setTheme] = useState('neon');
  useEffect(() => {
    const stored = localStorage.getItem('siteTheme');
    if (stored) setTheme(stored);
  }, []);
  const handleToggle = () => {
    const next = theme === 'neon' ? 'minimal' : 'neon';
    setTheme(next);
    localStorage.setItem('siteTheme', next);
  };

  return (
    <Router>
      <div className="App min-h-screen">
        <ErrorBoundary>
          <PlatformStatus />
          {/* Move theme toggle button into MinimalTheme header when minimal theme is active */}
          {theme === 'minimal' ? null : (
            <button
              onClick={handleToggle}
              className="fixed top-4 left-4 z-50 px-4 py-2 rounded-lg font-bold text-xs bg-gray-900 text-pink-400 border border-pink-500 shadow-neon-pink hover:bg-pink-900 hover:text-white transition-all"
              aria-label="Toggle site theme"
            >
              {theme === 'neon' ? 'Switch to Minimal Theme' : 'Switch to Neon Theme'}
            </button>
          )}
          {/* Route to directly access Simple View */}
          <Routes>
            <Route path="/simple" element={<MinimalTheme />} />
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
                  <MarketDataTabs />
                  <Education />
                  <Transparency />
                  <Impact />
                  <Routes>
                    {/* other routes can be defined here */}
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
