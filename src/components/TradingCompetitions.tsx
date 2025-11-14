import { useState, useEffect } from 'react';

export interface Competition {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed';
  participants: number;
  maxParticipants: number;
  entryFee: number;
  prizePool: number;
  rules: string[];
  category: 'forex' | 'stocks' | 'crypto' | 'mixed';
  duration: string;
  startingBalance: number;
}

export interface Participant {
  id: string;
  username: string;
  currentBalance: number;
  totalPnL: number;
  totalTrades: number;
  winRate: number;
  rank: number;
  isCurrentUser?: boolean;
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  pnl: number;
  timestamp: Date;
  status: 'open' | 'closed';
}

export default function TradingCompetitions() {
  const [activeTab, setActiveTab] = useState<'competitions' | 'leaderboard' | 'myTrades'>('competitions');
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [leaderboard, setLeaderboard] = useState<Participant[]>([]);
  const [myTrades, setMyTrades] = useState<Trade[]>([]);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    // Mock competitions
    setCompetitions([
      {
        id: '1',
        name: 'Weekly Forex Challenge',
        description: 'Test your forex trading skills in this week-long competition',
        startDate: new Date('2024-10-14'),
        endDate: new Date('2024-10-21'),
        status: 'active',
        participants: 234,
        maxParticipants: 500,
        entryFee: 0,
        prizePool: 5000,
        rules: ['Virtual trading only', 'Major currency pairs only', 'Max 5% risk per trade'],
        category: 'forex',
        duration: '7 days',
        startingBalance: 10000
      },
      {
        id: '2',
        name: 'Crypto Bull Run Contest',
        description: 'Ride the crypto wave and compete for the top spot',
        startDate: new Date('2024-10-20'),
        endDate: new Date('2024-11-20'),
        status: 'upcoming',
        participants: 156,
        maxParticipants: 1000,
        entryFee: 25,
        prizePool: 15000,
        rules: ['All major cryptocurrencies allowed', 'Leverage up to 10x', 'Minimum 3 trades per week'],
        category: 'crypto',
        duration: '30 days',
        startingBalance: 50000
      },
      {
        id: '3',
        name: 'Stock Picking Masters',
        description: 'Show your stock analysis skills in this monthly competition',
        startDate: new Date('2024-09-15'),
        endDate: new Date('2024-10-15'),
        status: 'completed',
        participants: 445,
        maxParticipants: 500,
        entryFee: 10,
        prizePool: 8000,
        rules: ['US stocks only', 'Long positions only', 'Hold minimum 3 days'],
        category: 'stocks',
        duration: '30 days',
        startingBalance: 25000
      }
    ]);

    // Mock leaderboard
    setLeaderboard([
      { id: '1', username: 'TradingWizard', currentBalance: 12850, totalPnL: 2850, totalTrades: 23, winRate: 87, rank: 1 },
      { id: '2', username: 'ForexKing', currentBalance: 12340, totalPnL: 2340, totalTrades: 19, winRate: 84, rank: 2 },
      { id: '3', username: 'CryptoBeast', currentBalance: 11920, totalPnL: 1920, totalTrades: 31, winRate: 71, rank: 3 },
      { id: '4', username: 'YourUsername', currentBalance: 11650, totalPnL: 1650, totalTrades: 15, winRate: 80, rank: 4, isCurrentUser: true },
      { id: '5', username: 'MarketMaster', currentBalance: 11420, totalPnL: 1420, totalTrades: 28, winRate: 68, rank: 5 }
    ]);

    // Mock trades
    setMyTrades([
      { id: '1', symbol: 'EURUSD', type: 'buy', quantity: 10000, entryPrice: 1.0850, exitPrice: 1.0890, pnl: 400, timestamp: new Date('2024-10-13'), status: 'closed' },
      { id: '2', symbol: 'GBPUSD', type: 'sell', quantity: 8000, entryPrice: 1.2650, exitPrice: 1.2610, pnl: 320, timestamp: new Date('2024-10-12'), status: 'closed' },
      { id: '3', symbol: 'USDJPY', type: 'buy', quantity: 12000, entryPrice: 149.50, pnl: 0, timestamp: new Date('2024-10-14'), status: 'open' }
    ]);
  }, []);

  const renderCompetitions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-cyan-400">Trading Competitions</h2>
        <button className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg">
          Create Competition
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.map(comp => (
          <div key={comp.id} className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-cyan-300">{comp.name}</h3>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                comp.status === 'active' ? 'bg-green-600' : 
                comp.status === 'upcoming' ? 'bg-yellow-600' : 'bg-gray-600'
              }`}>
                {comp.status.toUpperCase()}
              </span>
            </div>

            <p className="text-gray-400 mb-4">{comp.description}</p>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span>{comp.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Prize Pool:</span>
                <span className="text-green-400 font-bold">${comp.prizePool.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Entry Fee:</span>
                <span>{comp.entryFee === 0 ? 'FREE' : `$${comp.entryFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Participants:</span>
                <span>{comp.participants}/{comp.maxParticipants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Starting Balance:</span>
                <span>${comp.startingBalance.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCompetition(comp)}
                className="flex-1 bg-purple-600 hover:bg-purple-500 py-2 rounded text-sm"
              >
                View Details
              </button>
              {comp.status === 'upcoming' && (
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 py-2 rounded text-sm"
                >
                  Join
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-cyan-400">Leaderboard - Weekly Forex Challenge</h2>
      
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 gap-4 p-4 bg-gray-700 font-bold text-sm">
          <div>Rank</div>
          <div>Trader</div>
          <div>Balance</div>
          <div>P&L</div>
          <div>Trades</div>
          <div>Win Rate</div>
          <div>Actions</div>
        </div>
        
        {leaderboard.map(participant => (
          <div
            key={participant.id}
            className={`grid grid-cols-7 gap-4 p-4 border-b border-gray-700 ${
              participant.isCurrentUser ? 'bg-cyan-900/30' : ''
            }`}
          >
            <div className="flex items-center">
              <span className={`text-lg font-bold ${
                participant.rank === 1 ? 'text-yellow-400' :
                participant.rank === 2 ? 'text-gray-300' :
                participant.rank === 3 ? 'text-orange-400' : 'text-white'
              }`}>
                #{participant.rank}
              </span>
            </div>
            <div className="flex items-center">
              <span className={participant.isCurrentUser ? 'text-cyan-300 font-bold' : ''}>
                {participant.username}
                {participant.isCurrentUser && ' (You)'}
              </span>
            </div>
            <div className="flex items-center font-bold">
              ${participant.currentBalance.toLocaleString()}
            </div>
            <div className={`flex items-center font-bold ${
              participant.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {participant.totalPnL >= 0 ? '+' : ''}${participant.totalPnL.toLocaleString()}
            </div>
            <div className="flex items-center">{participant.totalTrades}</div>
            <div className="flex items-center">{participant.winRate}%</div>
            <div className="flex items-center">
              <button className="text-cyan-400 hover:text-cyan-300 text-sm">View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMyTrades = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-cyan-400">My Trades - Weekly Forex Challenge</h2>
      
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-8 gap-4 p-4 bg-gray-700 font-bold text-sm">
          <div>Symbol</div>
          <div>Type</div>
          <div>Quantity</div>
          <div>Entry</div>
          <div>Exit</div>
          <div>P&L</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        
        {myTrades.map(trade => (
          <div key={trade.id} className="grid grid-cols-8 gap-4 p-4 border-b border-gray-700">
            <div className="flex items-center font-bold text-cyan-300">{trade.symbol}</div>
            <div className={`flex items-center font-bold ${
              trade.type === 'buy' ? 'text-green-400' : 'text-red-400'
            }`}>
              {trade.type.toUpperCase()}
            </div>
            <div className="flex items-center">{trade.quantity.toLocaleString()}</div>
            <div className="flex items-center">{trade.entryPrice}</div>
            <div className="flex items-center">{trade.exitPrice || '-'}</div>
            <div className={`flex items-center font-bold ${
              trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {trade.pnl >= 0 ? '+' : ''}${trade.pnl}
            </div>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded text-xs ${
                trade.status === 'open' ? 'bg-yellow-600' : 'bg-green-600'
              }`}>
                {trade.status.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center">
              {trade.status === 'open' ? (
                <button className="text-red-400 hover:text-red-300 text-sm">Close</button>
              ) : (
                <button className="text-cyan-400 hover:text-cyan-300 text-sm">Details</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">Trading Competitions</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {(['competitions', 'leaderboard', 'myTrades'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg capitalize ${
              activeTab === tab 
                ? 'bg-pink-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tab === 'myTrades' ? 'My Trades' : tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'competitions' && renderCompetitions()}
        {activeTab === 'leaderboard' && renderLeaderboard()}
        {activeTab === 'myTrades' && renderMyTrades()}
      </div>

      {/* Competition Details Modal */}
      {selectedCompetition && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-cyan-300">{selectedCompetition.name}</h2>
              <button
                onClick={() => setSelectedCompetition(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <p className="text-gray-400 mb-4">{selectedCompetition.description}</p>
            
            <div className="mb-4">
              <h3 className="font-bold mb-2">Rules:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                {selectedCompetition.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-400">Start Date:</span>
                <div>{selectedCompetition.startDate.toLocaleDateString()}</div>
              </div>
              <div>
                <span className="text-gray-400">End Date:</span>
                <div>{selectedCompetition.endDate.toLocaleDateString()}</div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setSelectedCompetition(null)}
                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
              >
                Close
              </button>
              {selectedCompetition.status === 'upcoming' && (
                <button className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded">
                  Join Competition
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Join Competition Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-cyan-300 mb-4">Join Competition</h2>
            <p className="text-gray-400 mb-4">
              Are you sure you want to join this competition? Entry fee will be charged immediately.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded"
              >
                Cancel
              </button>
              <button className="flex-1 bg-cyan-600 hover:bg-cyan-500 py-2 rounded">
                Confirm Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}