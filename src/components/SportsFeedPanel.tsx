import React, { useState } from 'react';
import { FiX, FiZap, FiActivity, FiGlobe, FiTarget } from 'react-icons/fi';

type Game = {
    id: number;
    home: string;
    away: string;
    score: string;
    time: string;
    status: 'LIVE' | 'FINAL' | 'UPCOMING';
    odds: string;
};

// Mock data for display purposes
const mockGames: Game[] = [
    { id: 1, home: 'Quantum Tigers', away: 'Phoenix Bears', score: '88 - 79', time: 'Q4 2:30', status: 'LIVE', odds: 'TIGERS -4.5' },
    { id: 2, home: 'Electric Lightning', away: 'Data Vikings', score: '3 - 1', time: '78:00', status: 'LIVE', odds: 'O/U 4.5' },
    { id: 3, home: 'New York Stocks', away: 'London Bonds', score: '0 - 0', time: '1:05 PM ET', status: 'UPCOMING', odds: 'BONDS +150' },
    { id: 4, home: 'Crypto Bulls', away: 'Hedge Fund Hawks', score: '24 - 45', time: 'FINAL', status: 'FINAL', odds: 'HAWKS +3.5' },
];

const SportsFeedPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [liveGames, setLiveGames] = useState<Game[]>(mockGames);

    return (
        // FIXED: Using bg-[#000000] and opacity to ensure no white bleed-through
        <div className="fixed inset-0 z-[100] bg-[#000000]/95 backdrop-blur-sm p-4 flex items-center justify-center">
            <div className="w-full max-w-5xl h-[85vh] bg-[#0A0A0F] border-2 border-yellow-400 rounded-2xl shadow-[0_0_50px_rgba(255,255,0,0.3)] flex flex-col overflow-hidden">
                
                {/* Header */}
                <div className="p-4 border-b-2 border-lime-400 flex justify-between items-center bg-[#0A0A0F]">
                    <h2 className="text-2xl font-black text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, yellow, lime)` }}>
                        <FiZap className="inline mr-2" /> QUANTUM SPORTSFEED ENGINE
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-yellow-400 transition-colors">
                        <FiX className="text-2xl" />
                    </button>
                </div>

                {/* Content Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-y-auto">
                    
                    {/* Column 1: Live Scores */}
                    <div className="md:col-span-2 p-6 border-r border-gray-800">
                        <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
                            <FiActivity className="text-green-500" /> Live Action & Scores
                        </h3>
                        <div className="space-y-4">
                            {liveGames.map(game => (
                                <div key={game.id} className="bg-gray-900/50 p-4 rounded-xl border border-gray-700 flex justify-between items-center hover:border-lime-500 transition-all">
                                    <div>
                                        <p className="text-sm font-bold text-white">
                                            {game.home} vs. {game.away}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Odds: <span className="text-green-500 font-mono">{game.odds}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-xl font-black ${game.status === 'LIVE' ? 'text-orange-500 animate-pulse' : 'text-gray-300'}`}>
                                            {game.score}
                                        </div>
                                        <div className={`text-xs font-bold mt-1 ${game.status === 'LIVE' ? 'text-orange-500' : 'text-gray-500'}`}>
                                            {game.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-xs text-gray-500 mt-6">
                            *Scores simulated. Connect your live data API for real-time updates.
                        </p>
                    </div>

                    {/* Column 2: News & Odds */}
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
                            <FiGlobe className="text-cyan-400" /> Global Sports News
                        </h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="hover:text-white cursor-pointer transition-colors border-b border-gray-900 pb-2">
                                <span className="text-orange-500 mr-2">•</span> NBA Q4 analysis: Bears volatility spike.
                            </li>
                            <li className="hover:text-white cursor-pointer transition-colors border-b border-gray-900 pb-2">
                                <span className="text-orange-500 mr-2">•</span> Soccer algorithm detects defensive shifts.
                            </li>
                            <li className="hover:text-white cursor-pointer transition-colors border-b border-gray-900 pb-2">
                                <span className="text-orange-500 mr-2">•</span> Betting volumes surge on Diamond League futures.
                            </li>
                        </ul>
                        
                        <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
                            <FiTarget className="text-purple-400" /> Prediction Engine
                        </h3>
                         <div className="bg-black p-4 rounded-xl text-xs text-gray-300 border border-gray-700">
                            <p className="mb-2 font-mono text-green-500">
                                &gt; Prediction: Electric Lightning 65% Win Probability.
                            </p>
                            <p className="text-gray-500">
                                This engine cross-references historical data, player fatigue, and market sentiment to calculate live outcomes.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};S