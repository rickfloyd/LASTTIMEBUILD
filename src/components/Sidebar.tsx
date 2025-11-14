import React from 'react';
import { NavLink } from "react-router-dom";
import { Zap } from 'lucide-react';

const groups: { label: string; items: { to: string; label: string }[] }[] = [
  {
    label: "Markets",
    items: [
      { to: "/markets/overview", label: "Overview" },
      { to: "/markets/forex", label: "Forex" },
      { to: "/markets/crypto", label: "Crypto" },
      { to: "/markets/stocks", label: "Stocks" },
      { to: "/markets/commodities", label: "Commodities" },
      { to: "/markets/indexes", label: "Indexes" },
      { to: "/markets/futures", label: "Futures" },
      { to: "/markets/options", label: "Options" },
    ],
  },
  {
    label: "Analytics",
    items: [
      { to: "/analytics/indicators", label: "Indicators" },
      { to: "/analytics/strategies", label: "Strategies" },
      { to: "/analytics/backtests", label: "Backtests" },
      { to: "/analytics/alerts", label: "Alerts" },
      { to: "/analytics/screeners", label: "Screeners" },
      { to: "/analytics/heatmaps", label: "Heatmaps" },
      { to: "/analytics/market-breadth", label: "Market Breadth" },
      { to: "/analytics/correlation", label: "Correlation" },
    ],
  },
  {
    label: "Community",
    items: [
      { to: "/community/ideas", label: "Ideas" },
      { to: "/community/streams", label: "Streams" },
      { to: "/community/chat", label: "Chat" },
      { to: "/community/profiles", label: "Profiles" },
      { to: "/community/leaderboard", label: "Leaderboard" },
    ],
  },
  {
    label: "Trading",
    items: [
      { to: "/trading/dex", label: "DEX" },
      { to: "/trading/wallet", label: "Wallet" },
      { to: "/trading/orders", label: "Orders" },
      { to: "/trading/history", label: "History" },
      { to: "/trading/risk", label: "Risk Controls" },
      { to: "/trading/journal", label: "Journal" },
      { to: "/trading/copy", label: "Copy Trading" },
    ],
  },
  {
    label: "Learning",
    items: [
      { to: "/learn/academy", label: "Academy" },
      { to: "/learn/gamified", label: "Gamified Quests" },
      { to: "/learn/webinars", label: "Webinars" },
      { to: "/learn/glossary", label: "Glossary" },
      { to: "/learn/certifications", label: "Certifications" },
    ],
  },
  {
    label: "Investor Portal",
    items: [
      { to: "/investor/portfolio", label: "Portfolio" },
      { to: "/investor/research", label: "Research Hub" },
      { to: "/investor/reports", label: "Reports" },
      { to: "/investor/risk", label: "Risk Management" },
      { to: "/investor/insights", label: "AI Insights" },
      { to: "/investor/global", label: "Global Markets" },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/system/dashboard", label: "System Dashboard" },
      { to: "/system/theme", label: "Theme" },
      { to: "/system/layouts", label: "Layouts" },
      { to: "/system/watchlists", label: "Watchlists" },
      { to: "/system/accounts", label: "Accounts" },
      { to: "/system/legal", label: "Legal" },
      { to: "/system/about", label: "About" },
    ],
  },
];

const Sidebar = () => {
  return (
    <aside className="w-80 bg-charcoal-gradient border-l-4 border-electric-purple shadow-neon-blue p-6 overflow-y-auto">
      <div className="flex items-center space-x-3 mb-8 group">
        <div className="w-10 h-10 bg-fluorescent-gradient rounded-lg flex items-center justify-center shadow-neon-blue hover:animate-pulse-glow transition-all duration-300">
          <Zap className="w-5 h-5 text-white animate-bounce-glow" />
        </div>
        <div className="font-bold text-lg text-pulsing-cyan drop-shadow-lg group-hover:animate-pulse">
          Quantum Charts
        </div>
      </div>

      {groups.map((group, groupIndex) => (
        <div key={group.label} className="mb-8">
          <div className={`text-xs font-bold mb-4 uppercase tracking-wider opacity-80 ${
            groupIndex % 6 === 0 ? 'text-fluorescent-pink' :
            groupIndex % 6 === 1 ? 'text-fluorescent-blue' :
            groupIndex % 6 === 2 ? 'text-electric-orange' :
            groupIndex % 6 === 3 ? 'text-pulsing-cyan' :
            groupIndex % 6 === 4 ? 'text-neon-green' : 'text-electric-purple'
          }`}>
            {group.label}
          </div>
          <div className="space-y-2">
            {group.items.map((item, itemIndex) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  block px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 border-2
                  ${isActive 
                    ? `bg-fluorescent-gradient text-deep-black border-fluorescent-pink shadow-neon-pink animate-pulse-glow` 
                    : `text-${
                        itemIndex % 6 === 0 ? 'fluorescent-pink' :
                        itemIndex % 6 === 1 ? 'fluorescent-blue' :
                        itemIndex % 6 === 2 ? 'electric-orange' :
                        itemIndex % 6 === 3 ? 'pulsing-cyan' :
                        itemIndex % 6 === 4 ? 'neon-green' : 'electric-purple'
                      } bg-deep-black/50 hover:bg-charcoal/50 border-${
                        itemIndex % 6 === 0 ? 'fluorescent-pink' :
                        itemIndex % 6 === 1 ? 'fluorescent-blue' :
                        itemIndex % 6 === 2 ? 'electric-orange' :
                        itemIndex % 6 === 3 ? 'pulsing-cyan' :
                        itemIndex % 6 === 4 ? 'neon-green' : 'electric-purple'
                      } hover:text-white hover:shadow-neon-cyan`
                  }
                `}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;