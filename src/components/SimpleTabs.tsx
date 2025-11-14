import React, { useState } from 'react';

const CATEGORY_DATA: Record<string, string[]> = {
  'FINANCIAL INSTRUMENTS & MARKETS': [
    'Bond Screener','CEX Screener','Crypto Coins Screener','DEX Screener','ETF Screener',
    'Forex Screener','Pine Screener','Stock Screener','Cryptocurrency Heatmap','Stock Heatmap',
    'ETF Heatmap','Live Forex Heatmap','Economic Calendar','Earnings Calendar'
  ],
  'CHARTING & ANALYSIS TOOLS': [
    'Advanced Charts','Live Charts','Lightweight Charts','Free Charting Library',
    'Trading Platform','Desktop Application','Mobile Applications','Widget Library'
  ],
  'MARKET DATA & PRICES': [
    'Top Crypto Gainers','Top Crypto Losers','Cryptocurrency Market','Forex Market','Futures Market',
    'Markets Overview','US Stock Market','World Stock Market','Bond Market','ETF Market','World Indices'
  ],
  'TRADING IDEAS & ANALYSIS': [
    'Trading Ideas','Bullish Patterns','Bearish Patterns','Chart Patterns','Trend Analysis','Wave Analysis',
    'Support and Resistance','Supply and Demand','Trend Line Break','Fundamental Analysis','Harmonic Patterns',
    'Elliott Wave','Fibonacci Analysis','Fibonacci Retracement','Moving Averages','Pivot Points'
  ],
  'TECHNICAL INDICATORS & SCRIPTS': [
    'Pine Script User Manual','Trading Strategies & Indicators','RSI Indicators','MACD Indicators',
    'Autocorrelation Indicator','Ultimate Oscillator','Volume Indicators','Multi-Asset Analysis Tools'
  ],
  'MARKET SECTORS & INSTRUMENTS': [
    'Energy Futures','Metals Futures','Agricultural Futures','Currency Futures','Interest Rate Futures',
    'Index Futures','Major Indices','High-Yield Corporate Bonds','Fixed-Rate Corporate Bonds',
    'Floating-Rate Corporate Bonds','Government Bonds'
  ],
  'STOCK CATEGORIES': [
    'Large Cap Stocks','Small Cap Stocks','High Dividend Stocks','Most Active Stocks','Most Volatile Stocks',
    '52-Week High Stocks','52-Week Low Stocks','All-Time High Stocks','All-Time Low Stocks','Penny Stocks',
    'Pink Sheet Stocks','Pre-Market Gainers','After-Hours Stocks'
  ],
  'CRYPTOCURRENCY CATEGORIES': [
    'Large-Cap Crypto','Small-Cap Crypto','DeFi Coins','All-Time High Crypto','All-Time Low Crypto',
    'Most Expensive Coins','Most Traded Crypto','Most Volatile Crypto','Crypto Dominance Chart','Bitcoin ETFs','Ethereum ETFs'
  ],
  'ECONOMIC DATA': [
    'Economic Indicators','Global Economic Trends','Inflation Charts','Employment Data','GDP Growth',
    'Interest Rates','Government Debt','Trade Balance','Real Estate Data','Economic Country Data'
  ],
  'ETF CATEGORIES': [
    'High-Dividend ETFs','Highest Returning ETFs','Most Traded ETFs','Highest AUM Growth ETFs'
  ],
  'REGIONAL MARKETS': [
    'US Markets','European Markets','Asian Markets','World Markets','German Stocks','Japanese Stocks',
    'Chinese Stocks','Indian Stocks','Egyptian Stocks'
  ],
  'PAPER TRADING & EDUCATION': [
    'Paper Trading Competition','Trading Education','Community Ideas','Social Network Features'
  ],
};

const SimpleTabs: React.FC = () => {
  const groups = Object.keys(CATEGORY_DATA);
  const [active, setActive] = useState(groups[0]);

  return (
    <section className="mt-2">
      {/* Tabs */}
      <div className="flex gap-2 p-4 flex-wrap border-b border-pink-900/30">
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => setActive(g)}
            className={`px-3.5 py-2 rounded-full bg-[#151522] text-sm whitespace-nowrap transition-all ${
              active === g
                ? 'outline outline-2 outline-pink-400 shadow-[0_0_12px_rgba(255,59,212,.6)] text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Panels */}
      <div className="p-4">
        <div className="grid gap-2 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
          {CATEGORY_DATA[active].map((item) => (
            <div
              key={item}
              className="px-3 py-2 bg-[#111423] border border-[#24273a] rounded-xl text-sm hover:border-pink-500/60 hover:shadow-[0_0_10px_rgba(59,130,246,.25)] transition"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimpleTabs;
