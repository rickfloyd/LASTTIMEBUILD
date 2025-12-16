import React from 'react';

const tradingModes = [
  { title: 'Quantum Arbitrage', description: 'Exploits price differences across exchanges using quantum-speed calculations.', powerLevel: 98, color: 'cyan' },
  { title: 'Market Making Pro', description: 'Provides liquidity to the market by placing simultaneous bid and ask orders.', powerLevel: 95, color: 'green' },
  { title: 'AI Swing Trader', description: 'Uses machine learning to identify and capture multi-day price swings.', powerLevel: 92, color: 'blue' },
  { title: 'Neural Scalper', description: 'Executes a high volume of small, short-term trades based on neural network predictions.', powerLevel: 90, color: 'purple' },
  { title: 'Sentiment Analyst', description: 'Analyzes news and social media sentiment to predict market movements.', powerLevel: 88, color: 'yellow' },
  { title: 'Momentum Rider', description: 'Identifies and trades in the direction of strong market trends.', powerLevel: 85, color: 'orange' },
  { title: 'Volatility Breakout', description: 'Trades on sudden price movements that break out of a consolidation range.', powerLevel: 82, color: 'red' },
  { title: 'Mean Reversion', description: 'Bets on assets returning to their historical average price.', powerLevel: 80, color: 'pink' },
  { title: 'Event-Driven Trader', description: 'Trades based on predictable market-moving events like earnings reports.', powerLevel: 78, color: 'teal' },
  { title: 'Correlation Pairs', description: 'Trades based on the statistical relationship between two correlated assets.', powerLevel: 75, color: 'indigo' },
  { title: 'Options Strategist', description: 'Executes complex options strategies to hedge risk or speculate on volatility.', powerLevel: 72, color: 'lime' },
  { title: 'Crypto Quant', description: 'Applies quantitative models to the highly volatile cryptocurrency markets.', powerLevel: 70, color: 'amber' },
  { title: 'Forex Flow', description: 'Analyzes currency order flows to predict short-term price movements.', powerLevel: 68, color: 'emerald' },
  { title: 'Commodity Cycles', description: 'Trades based on the cyclical patterns of commodity prices.', powerLevel: 65, color: 'rose' },
  { title: 'ETF Specialist', description: 'Focuses on trading a wide range of Exchange-Traded Funds.', powerLevel: 62, color: 'fuchsia' },
  { title: 'Index Investor', description: 'Tracks and invests in major market indices for long-term growth.', powerLevel: 60, color: 'sky' },
  { title: 'Bond Laddering', description: 'Builds a portfolio of bonds with staggered maturities to manage interest rate risk.', powerLevel: 58, color: 'violet' },
  { title: 'Dividend Hunter', description: 'Invests in high-yield dividend stocks for a steady income stream.', powerLevel: 55, color: 'cyan' },
  { title: 'Growth Seeker', description: 'Identifies and invests in companies with high growth potential.', powerLevel: 52, color: 'green' },
  { title: 'Value Investor', description: 'Looks for undervalued stocks and invests in them for the long term.', powerLevel: 50, color: 'blue' },
  { title: 'IPO Hunter', description: 'Participates in Initial Public Offerings to capture early growth.', powerLevel: 48, color: 'purple' },
  { title: 'Merger Arbitrage', description: 'Trades the stocks of companies involved in a merger or acquisition.', powerLevel: 45, color: 'yellow' },
  { title: 'Short Seller', description: 'Bets against overvalued stocks, profiting from their decline in price.', powerLevel: 42, color: 'orange' },
  { title: 'Technical Analyst', description: 'Uses chart patterns and technical indicators to make trading decisions.', powerLevel: 40, color: 'red' },
  { title: 'Fundamental Analyst', description: 'Analyzes a company\'s financial health to determine its intrinsic value.', powerLevel: 38, color: 'pink' },
];

const TradingModeCard: React.FC<typeof tradingModes[0]> = ({ title, description, powerLevel, color }) => {
  const cardStyle = {
    borderColor: `var(--color-${color}-500)`,
    boxShadow: `0 0 10px var(--color-${color}-500)`,
  };

  const powerLevelStyle = {
    width: `${powerLevel}%`,
    backgroundColor: `var(--color-${color}-500)`,
  };

  return (
    <div className="neon-card p-4" style={cardStyle}>
      <h3 className="text-lg font-bold neon-card-title">{title}</h3>
      <p className="text-sm text-gray-400 mt-2">{description}</p>
      <div className="mt-4">
        <div className="text-xs font-bold text-gray-300">Power Level</div>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
          <div className="bg-blue-600 h-2.5 rounded-full" style={powerLevelStyle}></div>
        </div>
      </div>
    </div>
  );
};

const TradingModeGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {tradingModes.map((mode) => (
        <TradingModeCard key={mode.title} {...mode} />
      ))}
    </div>
  );
};

export default TradingModeGrid;
