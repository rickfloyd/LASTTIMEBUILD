import { useState, useEffect } from 'react';

export interface Script {
  id: string;
  name: string;
  description: string;
  code: string;
  type: 'indicator' | 'strategy' | 'study';
  author: string;
  version: string;
  isPrivate: boolean;
  invitedUsers: string[];
  likes: number;
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export default function ScriptManager() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');

  useEffect(() => {
    // Mock data for demonstration
    setScripts([
      {
        id: '1',
        name: 'Advanced RSI Divergence',
        description: 'Detects bullish and bearish divergences with RSI',
        code: '// Pine Script code here\n//@version=5\nindicator("Advanced RSI Divergence", overlay=true)',
        type: 'indicator',
        author: 'TraderPro',
        version: '1.2',
        isPrivate: true,
        invitedUsers: ['user123', 'user456'],
        likes: 145,
        downloads: 89,
        createdAt: new Date('2024-10-01'),
        updatedAt: new Date('2024-10-10'),
        tags: ['RSI', 'Divergence', 'Momentum']
      },
      {
        id: '2',
        name: 'Volume Profile Enhanced',
        description: 'Professional volume profile with market structure',
        code: '// Pine Script code here\n//@version=5\nindicator("Volume Profile Enhanced", overlay=true)',
        type: 'indicator',
        author: 'VolumeKing',
        version: '2.0',
        isPrivate: false,
        invitedUsers: [],
        likes: 287,
        downloads: 156,
        createdAt: new Date('2024-09-15'),
        updatedAt: new Date('2024-10-05'),
        tags: ['Volume', 'Profile', 'Market Structure']
      }
    ]);
  }, []);

  const filteredScripts = scripts.filter(script => {
    if (filter === 'public') return !script.isPrivate;
    if (filter === 'private') return script.isPrivate;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-cyan-400">Script Manager</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg font-semibold"
        >
          + Create Script
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6">
        {(['all', 'public', 'private'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === f 
                ? 'bg-pink-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {f} Scripts
          </button>
        ))}
      </div>

      {/* Scripts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto">
        {filteredScripts.map(script => (
          <div 
            key={script.id}
            className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700 hover:border-cyan-500 cursor-pointer transition-colors"
            onClick={() => setSelectedScript(script)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-cyan-300">{script.name}</h3>
              {script.isPrivate && (
                <div className="bg-yellow-600 text-black px-2 py-1 rounded text-xs font-bold">
                  🔒 PRIVATE
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm mb-3">{script.description}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {script.tags.map(tag => (
                <span key={tag} className="bg-purple-600 text-xs px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>by {script.author}</span>
              <span>{script.likes} ❤️ {script.downloads} ⬇️</span>
            </div>
          </div>
        ))}
      </div>

      {/* Script Detail Modal */}
      {selectedScript && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-cyan-300">{selectedScript.name}</h2>
                <p className="text-gray-400">{selectedScript.description}</p>
              </div>
              <button
                onClick={() => setSelectedScript(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4">
              <h3 className="font-bold mb-2">Code:</h3>
              <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{selectedScript.code}</code>
              </pre>
            </div>

            {selectedScript.isPrivate && (
              <div className="mb-4">
                <h3 className="font-bold mb-2">Invited Users:</h3>
                <div className="flex gap-2">
                  {selectedScript.invitedUsers.map(user => (
                    <span key={user} className="bg-yellow-600 text-black px-2 py-1 rounded text-sm">
                      {user}
                    </span>
                  ))}
                  <button className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm">
                    + Invite User
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded">
                Add to Chart
              </button>
              <button className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded">
                ❤️ Like ({selectedScript.likes})
              </button>
              <button className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded">
                ⬇️ Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Script Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-cyan-300 mb-4">Create New Script</h2>
            <form className="space-y-4">
              <input
                placeholder="Script Name"
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              />
              <textarea
                placeholder="Description"
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              />
              <label htmlFor="scriptType" className="block text-sm font-medium mb-1">Script Type</label>
              <select id="scriptType" className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2" aria-label="Script Type">
                <option>Indicator</option>
                <option>Strategy</option>
                <option>Study</option>
              </select>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="private" />
                <label htmlFor="private">Make Private (Premium only)</label>
              </div>
              <textarea
                placeholder="Pine Script Code"
                rows={10}
                className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 font-mono text-sm"
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded"
                >
                  Create Script
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}