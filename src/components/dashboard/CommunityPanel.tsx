
import React, { useState } from 'react';
import { FiX, FiMessageSquare, FiCode, FiLock, FiEye, FiLink, FiBook, FiUserCheck, FiGlobe } from 'react-icons/fi';

interface CommunityPanelProps {
  onClose: () => void;
}

// Mock Data based on the provided structure
const publicIdeas = [
  { id: 1, title: "BTC Long-Term Bullish Fractal", author: "CryptoWizard", likes: 125, comments: 42, type: "Public Idea" },
  { id: 2, title: "SPX Correction Imminent - Elliott Wave", author: "WaveRider", likes: 301, comments: 150, type: "Public Idea" },
];

const publicScripts = [
  { id: 1, name: "QuantumFlow Oscillator", author: "AlgoQueen", users: 5200, type: "Open Script", visibility: "Open Source" },
  { id: 2, name: "Neon Trendlines PRO", author: "ChartArtisan", users: 12500, type: "Protected Script", visibility: "Protected" },
  { id: 3, name: "Institutional Order Block Detector", author: "SmartMoneyDev", users: 750, type: "Invite-Only Script", visibility: "Invite-Only" },
];

const privateContent = [
    { id: 1, title: "ETH/USD Accumulation Schematic (Private Notes)", type: "Private Idea", shared_with: 3 },
    { id: 2, name: "Project Chimera Strategy", type: "Invite-Only Script", shared_with: 10 },
];


export const CommunityPanel: React.FC<CommunityPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('ideas');

  const renderContent = () => {
    switch (activeTab) {
      case 'ideas':
        return (
          <div>
            <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center"><FiGlobe className="mr-2" /> Public Ideas Stream</h3>
            <div className="space-y-4">
              {publicIdeas.map(idea => (
                <div key={idea.id} className="bg-deep-black/60 p-4 rounded-lg border border-gray-700 hover:border-cyan-500 transition-all">
                  <p className="font-bold text-white">{idea.title}</p>
                  <p className="text-xs text-gray-400">by {idea.author}</p>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-green-400">{idea.likes} Likes</span>
                    <span className="text-blue-400">{idea.comments} Comments</span>
                    <span className="flex items-center bg-blue-900/50 text-blue-300 px-2 py-1 rounded-full"><FiMessageSquare className="mr-1" />{idea.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'scripts':
        return (
          <div>
            <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center"><FiBook className="mr-2" /> Community Scripts Library</h3>
             <div className="space-y-4">
              {publicScripts.map(script => (
                <div key={script.id} className="bg-deep-black/60 p-4 rounded-lg border border-gray-700 hover:border-green-500 transition-all">
                  <p className="font-bold text-white">{script.name}</p>
                  <p className="text-xs text-gray-400">by {script.author} - {script.users.toLocaleString()} users</p>
                  <div className="flex items-center justify-between mt-2 text-xs">
                     <span className={`flex items-center px-2 py-1 rounded-full ${
                       script.visibility === 'Open Source' ? 'bg-green-900/50 text-green-300' :
                       script.visibility === 'Protected' ? 'bg-orange-900/50 text-orange-300' :
                       'bg-purple-900/50 text-purple-300'
                     }`}>
                      {script.visibility === 'Open Source' ? <FiCode className="mr-1" /> : script.visibility === 'Protected' ? <FiLock className="mr-1" /> : <FiUserCheck className="mr-1" />}
                      {script.visibility}
                    </span>
                    <button className="text-cyan-400 hover:text-white"><FiLink className="mr-1" /> Add to Chart</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'private':
        return (
           <div>
            <h3 className="text-lg font-bold text-pink-400 mb-4 flex items-center"><FiLock className="mr-2" /> My Private Content</h3>
             <div className="space-y-4">
              {privateContent.map(item => (
                <div key={item.id} className="bg-deep-black/60 p-4 rounded-lg border border-gray-700 hover:border-pink-500 transition-all">
                  <p className="font-bold text-white">{item.title || item.name}</p>
                  <div className="flex items-center justify-between mt-2 text-xs">
                   <span className={`flex items-center px-2 py-1 rounded-full ${
                       item.type === 'Private Idea' ? 'bg-gray-700 text-gray-300' : 'bg-purple-900/50 text-purple-300'
                     }`}>
                      {item.type === 'Private Idea' ? <FiEye className="mr-1" /> : <FiUserCheck className="mr-1" />}
                      {item.type}
                    </span>
                    <span className="text-gray-400">Shared with {item.shared_with} users</span>
                    <button className="text-cyan-400 hover:text-white"><FiLink className="mr-1" /> Get Share Link</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return null;
    }
  };

  const getTabClass = (tabName: string) => {
    const isActive = activeTab === tabName;
    const baseClass = "px-4 py-2 font-bold transition-all duration-300 rounded-t-lg";
    if (isActive) {
        switch(tabName) {
            case 'ideas': return `${baseClass} bg-cyan-500/20 border-b-2 border-cyan-500 text-cyan-400`;
            case 'scripts': return `${baseClass} bg-green-500/20 border-b-2 border-green-500 text-green-400`;
            case 'private': return `${baseClass} bg-pink-500/20 border-b-2 border-pink-500 text-pink-400`;
        }
    }
    return `${baseClass} text-gray-500 hover:bg-gray-700/50 hover:text-white`;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl h-[80vh] bg-charcoal-black border-2 border-gray-700 rounded-2xl shadow-neon-blue flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Community Hub</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-all transform hover:rotate-90">
            <FiX size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex space-x-2">
            <button className={getTabClass('ideas')} onClick={() => setActiveTab('ideas')}>
              Ideas Stream
            </button>
            <button className={getTabClass('scripts')} onClick={() => setActiveTab('scripts')}>
              Script Library
            </button>
             <button className={getTabClass('private')} onClick={() => setActiveTab('private')}>
              My Private Content
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
