import { useState } from 'react';

export interface TradingViewData {
  watchlists: Watchlist[];
  scripts: ImportedScript[];
  ideas: TradingIdea[];
  alerts: Alert[];
  layouts: ChartLayout[];
}

export interface Watchlist {
  id: string;
  name: string;
  symbols: string[];
  createdAt: Date;
}

export interface ImportedScript {
  id: string;
  name: string;
  code: string;
  type: 'indicator' | 'strategy';
  isPrivate: boolean;
}

export interface TradingIdea {
  id: string;
  title: string;
  description: string;
  symbol: string;
  type: 'long' | 'short';
  publishedAt: Date;
}

export interface Alert {
  id: string;
  symbol: string;
  condition: string;
  message: string;
  isActive: boolean;
}

export interface ChartLayout {
  id: string;
  name: string;
  timeframe: string;
  indicators: string[];
  drawingTools: string[];
}

export default function TradingViewMigration() {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'connect' | 'select' | 'import' | 'complete'>('welcome');
  const [isConnecting, setIsConnecting] = useState(false);
  const [migrationData, setMigrationData] = useState<TradingViewData | null>(null);
  const [selectedItems, setSelectedItems] = useState({
    watchlists: true,
    scripts: true,
    ideas: true,
    alerts: true,
    layouts: true
  });
  const [importProgress, setImportProgress] = useState(0);

  const mockTradingViewData: TradingViewData = {
    watchlists: [
      { id: '1', name: 'Forex Majors', symbols: ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD'], createdAt: new Date('2024-08-15') },
      { id: '2', name: 'Crypto Portfolio', symbols: ['BTCUSD', 'ETHUSD', 'ADAUSD', 'DOTUSD'], createdAt: new Date('2024-09-01') },
      { id: '3', name: 'US Stocks', symbols: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'], createdAt: new Date('2024-07-20') }
    ],
    scripts: [
      { id: '1', name: 'Custom RSI Strategy', code: '//@version=5\nstrategy("Custom RSI", overlay=true)', type: 'strategy', isPrivate: true },
      { id: '2', name: 'Volume Profile Indicator', code: '//@version=5\nindicator("Volume Profile", overlay=true)', type: 'indicator', isPrivate: false },
      { id: '3', name: 'MA Crossover Alert', code: '//@version=5\nindicator("MA Cross", overlay=true)', type: 'indicator', isPrivate: true }
    ],
    ideas: [
      { id: '1', title: 'EURUSD Long Setup', description: 'Bullish setup on EURUSD with fibonacci support', symbol: 'EURUSD', type: 'long', publishedAt: new Date('2024-10-10') },
      { id: '2', title: 'BTC Breakout', description: 'Bitcoin breaking key resistance', symbol: 'BTCUSD', type: 'long', publishedAt: new Date('2024-10-08') }
    ],
    alerts: [
      { id: '1', symbol: 'EURUSD', condition: 'Price > 1.0900', message: 'EURUSD breakout', isActive: true },
      { id: '2', symbol: 'BTCUSD', condition: 'RSI < 30', message: 'BTC oversold', isActive: false },
      { id: '3', symbol: 'AAPL', condition: 'Volume > 50M', message: 'High volume alert', isActive: true }
    ],
    layouts: [
      { id: '1', name: 'Forex Trading Setup', timeframe: '4H', indicators: ['RSI', 'MACD', 'Bollinger Bands'], drawingTools: ['Trendlines', 'Fibonacci'] },
      { id: '2', name: 'Crypto Analysis', timeframe: '1D', indicators: ['EMA', 'Volume', 'Stoch'], drawingTools: ['Support/Resistance'] }
    ]
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate API connection
    await new Promise(resolve => setTimeout(resolve, 3000));
    setMigrationData(mockTradingViewData);
    setIsConnecting(false);
    setCurrentStep('select');
  };

  const handleImport = async () => {
    setCurrentStep('import');
    // Simulate import process
    for (let i = 0; i <= 100; i += 10) {
      setImportProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    setCurrentStep('complete');
  };

  const renderWelcome = () => (
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6">Welcome to AiQuantum Charts!</h2>
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-pink-400 mb-4">🚀 Why Switch to AiQuantum?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div>
            <h4 className="font-bold text-cyan-300 mb-2">✨ Advanced Features</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• AI-powered trading signals</li>
              <li>• Advanced pattern recognition</li>
              <li>• Real-time sentiment analysis</li>
              <li>• Professional order flow tools</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-cyan-300 mb-2">💰 Better Value</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• 50% lower subscription costs</li>
              <li>• More features included</li>
              <li>• No premium tier limitations</li>
              <li>• Free AI trading assistant</li>
            </ul>
          </div>
        </div>
      </div>
      <p className="text-gray-400 mb-6">
        Migrate your TradingView data seamlessly. We'll import your watchlists, scripts, ideas, alerts, and chart layouts automatically.
      </p>
      <button
        onClick={() => setCurrentStep('connect')}
        className="bg-cyan-600 hover:bg-cyan-500 px-8 py-3 rounded-lg font-bold text-lg"
      >
        Start Migration
      </button>
    </div>
  );

  const renderConnect = () => (
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">Connect Your TradingView Account</h2>
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="mb-4">
          <h3 className="font-bold text-pink-400 mb-2">🔒 Secure Connection</h3>
          <p className="text-gray-400 text-sm">
            We use OAuth 2.0 and industry-standard encryption to securely access your TradingView data. 
            Your login credentials are never stored on our servers.
          </p>
        </div>
        <div className="mb-4">
          <h3 className="font-bold text-pink-400 mb-2">📊 What We'll Import</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
            <div>• Watchlists & Symbols</div>
            <div>• Custom Scripts & Indicators</div>
            <div>• Trading Ideas</div>
            <div>• Price Alerts</div>
            <div>• Chart Layouts</div>
            <div>• Drawing Tools</div>
          </div>
        </div>
      </div>
      
      {isConnecting ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-400">Connecting to TradingView...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={handleConnect}
            className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-bold text-lg w-full"
          >
            Connect TradingView Account
          </button>
          <p className="text-xs text-gray-500">
            By connecting, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      )}
    </div>
  );

  const renderSelect = () => (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">Select Data to Import</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Watchlists */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              id="watchlists"
              checked={selectedItems.watchlists}
              onChange={(e) => setSelectedItems(prev => ({ ...prev, watchlists: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="watchlists" className="font-bold text-cyan-300">Watchlists ({migrationData?.watchlists.length})</label>
          </div>
          {migrationData?.watchlists.map(watchlist => (
            <div key={watchlist.id} className="text-sm text-gray-400 mb-1">
              • {watchlist.name} ({watchlist.symbols.length} symbols)
            </div>
          ))}
        </div>

        {/* Scripts */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              id="scripts"
              checked={selectedItems.scripts}
              onChange={(e) => setSelectedItems(prev => ({ ...prev, scripts: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="scripts" className="font-bold text-cyan-300">Scripts & Indicators ({migrationData?.scripts.length})</label>
          </div>
          {migrationData?.scripts.map(script => (
            <div key={script.id} className="text-sm text-gray-400 mb-1">
              • {script.name} ({script.type})
            </div>
          ))}
        </div>

        {/* Ideas */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              id="ideas"
              checked={selectedItems.ideas}
              onChange={(e) => setSelectedItems(prev => ({ ...prev, ideas: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="ideas" className="font-bold text-cyan-300">Trading Ideas ({migrationData?.ideas.length})</label>
          </div>
          {migrationData?.ideas.map(idea => (
            <div key={idea.id} className="text-sm text-gray-400 mb-1">
              • {idea.title} ({idea.symbol})
            </div>
          ))}
        </div>

        {/* Alerts */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              id="alerts"
              checked={selectedItems.alerts}
              onChange={(e) => setSelectedItems(prev => ({ ...prev, alerts: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="alerts" className="font-bold text-cyan-300">Price Alerts ({migrationData?.alerts.length})</label>
          </div>
          {migrationData?.alerts.map(alert => (
            <div key={alert.id} className="text-sm text-gray-400 mb-1">
              • {alert.symbol}: {alert.condition}
            </div>
          ))}
        </div>

        {/* Layouts */}
        <div className="bg-gray-800 rounded-lg p-4 md:col-span-2">
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              id="layouts"
              checked={selectedItems.layouts}
              onChange={(e) => setSelectedItems(prev => ({ ...prev, layouts: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="layouts" className="font-bold text-cyan-300">Chart Layouts ({migrationData?.layouts.length})</label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {migrationData?.layouts.map(layout => (
              <div key={layout.id} className="text-sm text-gray-400">
                • {layout.name} ({layout.timeframe}) - {layout.indicators.length} indicators
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleImport}
          className="bg-cyan-600 hover:bg-cyan-500 px-8 py-3 rounded-lg font-bold text-lg"
        >
          Import Selected Data
        </button>
      </div>
    </div>
  );

  const renderImport = () => (
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">Importing Your Data</h2>
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="mb-4">
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className={`bg-cyan-600 h-4 rounded-full transition-all duration-300 ${
                importProgress === 0 ? 'w-0' :
                importProgress <= 25 ? 'w-1/4' :
                importProgress <= 50 ? 'w-1/2' :
                importProgress <= 75 ? 'w-3/4' : 'w-full'
              }`}
            ></div>
          </div>
          <p className="text-cyan-400 mt-2 font-bold">{importProgress}% Complete</p>
        </div>
        
        <div className="text-left space-y-2 text-sm">
          <div className={`flex items-center ${importProgress >= 20 ? 'text-green-400' : 'text-gray-400'}`}>
            <span className="mr-2">{importProgress >= 20 ? '✅' : '⏳'}</span>
            Importing watchlists...
          </div>
          <div className={`flex items-center ${importProgress >= 40 ? 'text-green-400' : 'text-gray-400'}`}>
            <span className="mr-2">{importProgress >= 40 ? '✅' : '⏳'}</span>
            Converting scripts and indicators...
          </div>
          <div className={`flex items-center ${importProgress >= 60 ? 'text-green-400' : 'text-gray-400'}`}>
            <span className="mr-2">{importProgress >= 60 ? '✅' : '⏳'}</span>
            Migrating trading ideas...
          </div>
          <div className={`flex items-center ${importProgress >= 80 ? 'text-green-400' : 'text-gray-400'}`}>
            <span className="mr-2">{importProgress >= 80 ? '✅' : '⏳'}</span>
            Setting up price alerts...
          </div>
          <div className={`flex items-center ${importProgress >= 100 ? 'text-green-400' : 'text-gray-400'}`}>
            <span className="mr-2">{importProgress >= 100 ? '✅' : '⏳'}</span>
            Finalizing chart layouts...
          </div>
        </div>
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-green-400 mb-6">🎉 Migration Complete!</h2>
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Successfully Imported:</h3>
        <div className="grid grid-cols-2 gap-4 text-left">
          <div>
            <div className="text-green-400 font-bold">✅ {migrationData?.watchlists.length} Watchlists</div>
            <div className="text-green-400 font-bold">✅ {migrationData?.scripts.length} Scripts</div>
            <div className="text-green-400 font-bold">✅ {migrationData?.ideas.length} Trading Ideas</div>
          </div>
          <div>
            <div className="text-green-400 font-bold">✅ {migrationData?.alerts.length} Price Alerts</div>
            <div className="text-green-400 font-bold">✅ {migrationData?.layouts.length} Chart Layouts</div>
            <div className="text-green-400 font-bold">✅ Account Settings</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-cyan-900 to-pink-900 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-yellow-400 mb-2">🎁 Welcome Bonus!</h3>
        <p className="text-gray-300 mb-4">
          As a new AiQuantum user, you get 30 days of Premium features for FREE!
        </p>
        <ul className="text-sm text-gray-300 text-left space-y-1">
          <li>• Unlimited AI trading signals</li>
          <li>• Advanced pattern recognition</li>
          <li>• Premium indicators library</li>
          <li>• Priority customer support</li>
        </ul>
      </div>

      <div className="flex gap-4 justify-center">
        <button className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-lg font-bold">
          Start Trading
        </button>
        <button className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-bold">
          Explore Features
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-cyan-400 mb-2">TradingView Migration</h1>
        <div className="flex items-center space-x-4">
          {(['welcome', 'connect', 'select', 'import', 'complete'] as const).map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep === step 
                  ? 'bg-cyan-600 text-white' 
                  : index < (['welcome', 'connect', 'select', 'import', 'complete'] as const).indexOf(currentStep)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-gray-400'
              }`}>
                {index + 1}
              </div>
              {index < 4 && <div className="w-8 h-0.5 bg-gray-600 mx-2"></div>}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {currentStep === 'welcome' && renderWelcome()}
        {currentStep === 'connect' && renderConnect()}
        {currentStep === 'select' && renderSelect()}
        {currentStep === 'import' && renderImport()}
        {currentStep === 'complete' && renderComplete()}
      </div>
    </div>
  );
}