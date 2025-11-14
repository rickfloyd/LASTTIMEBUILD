import { useState, useEffect } from 'react';

export interface TradingIdea {
  id: string;
  author: string;
  title: string;
  description: string;
  symbol: string;
  type: 'long' | 'short' | 'neutral';
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  timeframe: string;
  confidence: number;
  likes: number;
  comments: Comment[];
  createdAt: Date;
  tags: string[];
  image?: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  likes: number;
  createdAt: Date;
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isActive: boolean;
  category: 'general' | 'forex' | 'crypto' | 'stocks' | 'options';
}

export default function CommunityHub() {
  const [activeTab, setActiveTab] = useState<'ideas' | 'chat' | 'rooms'>('ideas');
  const [tradingIdeas, setTradingIdeas] = useState<TradingIdea[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [showCreateIdea, setShowCreateIdea] = useState(false);

  useEffect(() => {
    // Mock trading ideas
    setTradingIdeas([
      {
        id: '1',
        author: 'TradeMaster',
        title: 'EURUSD Long Setup - Perfect Retracement',
        description: 'Beautiful fibonacci retracement at 61.8% level with bullish divergence on RSI. Risk/reward 1:3.',
        symbol: 'EURUSD',
        type: 'long',
        entryPrice: 1.0850,
        targetPrice: 1.0950,
        stopLoss: 1.0800,
        timeframe: '4H',
        confidence: 85,
        likes: 42,
        comments: [
          { id: '1', author: 'TraderJoe', text: 'Great analysis! I see the same setup.', likes: 5, createdAt: new Date() }
        ],
        createdAt: new Date('2024-10-13'),
        tags: ['Forex', 'Fibonacci', 'RSI']
      },
      {
        id: '2',
        author: 'CryptoQueen',
        title: 'BTC Breaking Out - Target $75K',
        description: 'Bitcoin is breaking out of a 6-month consolidation pattern. Volume confirms the move.',
        symbol: 'BTCUSD',
        type: 'long',
        entryPrice: 67500,
        targetPrice: 75000,
        stopLoss: 65000,
        timeframe: '1D',
        confidence: 78,
        likes: 89,
        comments: [],
        createdAt: new Date('2024-10-12'),
        tags: ['Crypto', 'Breakout', 'Volume']
      }
    ]);

    // Mock chat rooms
    setChatRooms([
      { id: '1', name: 'General Trading', description: 'General discussion about trading', memberCount: 1247, isActive: true, category: 'general' },
      { id: '2', name: 'Forex Masters', description: 'Professional forex trading discussion', memberCount: 832, isActive: true, category: 'forex' },
      { id: '3', name: 'Crypto Alerts', description: 'Real-time crypto signals and alerts', memberCount: 2156, isActive: true, category: 'crypto' },
      { id: '4', name: 'Stock Picks', description: 'Share your best stock picks', memberCount: 945, isActive: true, category: 'stocks' },
      { id: '5', name: 'Options Strategy', description: 'Advanced options trading strategies', memberCount: 567, isActive: true, category: 'options' }
    ]);
  }, []);

  const renderIdeas = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-cyan-400">Trading Ideas</h2>
        <button
          onClick={() => setShowCreateIdea(true)}
          className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg"
        >
          + Share Idea
        </button>
      </div>

      {tradingIdeas.map(idea => (
        <div key={idea.id} className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-cyan-300">{idea.title}</h3>
              <p className="text-gray-400">by {idea.author} • {idea.createdAt.toLocaleDateString()}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${
              idea.type === 'long' ? 'bg-green-600' : idea.type === 'short' ? 'bg-red-600' : 'bg-gray-600'
            }`}>
              {idea.type.toUpperCase()}
            </div>
          </div>

          <p className="text-gray-300 mb-4">{idea.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-sm">
            <div>
              <span className="text-gray-400">Symbol:</span>
              <div className="font-bold text-cyan-300">{idea.symbol}</div>
            </div>
            <div>
              <span className="text-gray-400">Entry:</span>
              <div className="font-bold">{idea.entryPrice}</div>
            </div>
            <div>
              <span className="text-gray-400">Target:</span>
              <div className="font-bold text-green-400">{idea.targetPrice}</div>
            </div>
            <div>
              <span className="text-gray-400">Stop Loss:</span>
              <div className="font-bold text-red-400">{idea.stopLoss}</div>
            </div>
            <div>
              <span className="text-gray-400">Confidence:</span>
              <div className="font-bold text-yellow-400">{idea.confidence}%</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {idea.tags.map(tag => (
              <span key={tag} className="bg-purple-600 text-xs px-2 py-1 rounded">{tag}</span>
            ))}
          </div>

          <div className="flex gap-4 text-sm">
            <button className="flex items-center gap-1 text-pink-400 hover:text-pink-300">
              ❤️ {idea.likes}
            </button>
            <button className="flex items-center gap-1 text-gray-400 hover:text-gray-300">
              💬 {idea.comments.length}
            </button>
            <button className="text-gray-400 hover:text-gray-300">Share</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderChatRooms = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {chatRooms.map(room => (
        <div
          key={room.id}
          className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700 hover:border-cyan-500 cursor-pointer"
          onClick={() => setSelectedRoom(room)}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-cyan-300">{room.name}</h3>
            <span className={`w-3 h-3 rounded-full ${room.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
          </div>
          <p className="text-gray-400 text-sm mb-3">{room.description}</p>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{room.memberCount} members</span>
            <span className="capitalize bg-purple-600 px-2 py-1 rounded">{room.category}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderChat = () => (
    <div className="bg-gray-800 rounded-lg h-96 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-bold text-cyan-300">
          {selectedRoom ? selectedRoom.name : 'Select a room to start chatting'}
        </h3>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedRoom ? (
          <div className="space-y-2">
            <div className="text-gray-400 text-sm">Welcome to {selectedRoom.name}!</div>
            <div className="bg-gray-700 p-2 rounded">
              <span className="font-bold text-cyan-300">TraderPro:</span> Market looking bullish today!
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <span className="font-bold text-pink-300">CryptoKing:</span> Agreed, seeing strong momentum in tech stocks
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center">Select a chat room from the rooms tab</div>
        )}
      </div>
      {selectedRoom && (
        <div className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <input
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2"
            />
            <button className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded">Send</button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">Community Hub</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {(['ideas', 'rooms', 'chat'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg capitalize ${
              activeTab === tab 
                ? 'bg-pink-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tab === 'ideas' ? 'Trading Ideas' : tab === 'rooms' ? 'Chat Rooms' : 'Live Chat'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'ideas' && renderIdeas()}
        {activeTab === 'rooms' && renderChatRooms()}
        {activeTab === 'chat' && renderChat()}
      </div>

      {/* Create Idea Modal */}
      {showCreateIdea && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-cyan-300 mb-4">Share Trading Idea</h2>
            <form className="space-y-4">
              <input placeholder="Title" className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2" />
              <input placeholder="Symbol (e.g., EURUSD)" className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2" />
              <textarea placeholder="Description" rows={3} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2" />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Entry Price" type="number" className="bg-gray-700 border border-gray-600 rounded px-3 py-2" />
                <input placeholder="Target Price" type="number" className="bg-gray-700 border border-gray-600 rounded px-3 py-2" />
                <input placeholder="Stop Loss" type="number" className="bg-gray-700 border border-gray-600 rounded px-3 py-2" />
                <select className="bg-gray-700 border border-gray-600 rounded px-3 py-2" aria-label="Trade Direction">
                  <option>Long</option>
                  <option>Short</option>
                  <option>Neutral</option>
                </select>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateIdea(false)}
                  className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded">Share Idea</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}