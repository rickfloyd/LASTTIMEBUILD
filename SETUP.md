# AI Quantum Charts - Setup Guide

## 🚀 Quick Start

This is a **100% FREE** real-time cryptocurrency trading platform using free APIs.

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rickfloyd/AiQuantumCharts.git
   cd AiQuantumCharts
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Start the development servers**

   Open two terminal windows:

   **Terminal 1 - Backend Server (Port 3001):**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Frontend Server (Port 5179):**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to: `http://localhost:5179`

## 📊 Features Implemented

### ✅ Live Cryptocurrency Prices
- Real-time prices from CoinGecko API
- Top 6 cryptocurrencies by market cap
- Auto-refresh every 30 seconds
- 24h price change indicators
- Market cap and volume data

### ✅ Interactive Price Charts
- Historical price data visualization
- Chart.js with gradient fills
- Configurable time periods (7 days, 30 days, etc.)
- Multiple cryptocurrencies (Bitcoin, Ethereum, etc.)

### ✅ Real-time WebSocket Streaming
- Binance WebSocket integration
- Live price updates (no refresh needed)
- 5 popular trading pairs (BTC, ETH, BNB, SOL, ADA)
- Connection status indicator
- Auto-reconnect on disconnect

## 🔌 Free APIs Used

### CoinGecko API
- **Cost:** 100% FREE (unlimited requests)
- **Authentication:** Not required
- **Features:**
  - Live cryptocurrency prices
  - Historical price charts
  - Market cap and volume data
  - Trending coins
  - Coin search

### Binance Public API
- **Cost:** 100% FREE (public endpoints)
- **Authentication:** Not required
- **Features:**
  - Real-time price tickers
  - Candlestick (klines) data
  - Top trading pairs by volume
  - WebSocket live streaming

## 📁 Project Structure

```
quantum-charts/
├── src/                          # Frontend React application
│   ├── components/
│   │   ├── LiveCryptoPrices.tsx  # Live price widget
│   │   ├── CryptoChart.tsx       # Chart.js price charts
│   │   └── BinanceLiveWidget.tsx # WebSocket live streaming
│   └── App.tsx                   # Main application
├── server/                       # Backend Express API
│   ├── index.ts                  # Server entry point
│   ├── services/
│   │   ├── coingecko.ts         # CoinGecko API service
│   │   └── binance.ts           # Binance API service
│   └── routes/
│       ├── crypto.ts            # Crypto endpoints
│       ├── stocks.ts            # Stock endpoints (placeholder)
│       ├── news.ts              # News endpoints (placeholder)
│       └── economic.ts          # Economic data (placeholder)
└── package.json
```

## 🛠️ API Endpoints

### Crypto Data (CoinGecko)
- `GET /api/crypto/prices` - Top cryptocurrency prices
- `GET /api/crypto/trending` - Trending coins
- `GET /api/crypto/chart/:coinId?days=7` - Historical price data
- `GET /api/crypto/search?query=bitcoin` - Search coins

### Binance Data
- `GET /api/crypto/binance/ticker/:symbol` - 24h ticker stats
- `GET /api/crypto/binance/klines/:symbol?interval=1h&limit=24` - Candlestick data
- `GET /api/crypto/binance/top` - Top trading pairs by volume

### Health Check
- `GET /health` - Server status

## 🔮 Future Enhancements (Optional - Require API Keys)

### Stock Market Data (Alpha Vantage)
- Free tier: 5 calls/minute
- Get API key: https://www.alphavantage.co/support/#api-key

### Economic Data (FRED)
- 100% FREE with API key
- Get API key: https://fred.stlouisfed.org/docs/api/api_key.html

### News with Sentiment (MarketAux)
- Free tier: 100 calls/day
- Get API key: https://www.marketaux.com/

## 🐛 Troubleshooting

### Port Already in Use
If you get "port already in use" errors:
```bash
# Windows PowerShell
Get-Process -Name node | Stop-Process -Force

# macOS/Linux
killall node
```

### API Rate Limits
All current APIs are unlimited or have generous free tiers. If you hit rate limits:
- CoinGecko: No limits on public API
- Binance: No auth required for public data

### Browser Cache Issues
If you see old data after updates:
1. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Clear browser cache
3. Try incognito/private mode

## 📝 Development

### Run Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```

### Lint Code
```bash
npm run lint
```

## 🤝 Contributing
This is the official AI Quantum Charts skeleton. Feel free to:
- Add more data sources
- Implement additional chart types
- Enhance the UI/UX
- Add more trading features

## 📄 License
MIT License - Free to use and modify

## 🙏 Credits
- CoinGecko for free crypto data
- Binance for real-time market data
- Chart.js for beautiful visualizations
