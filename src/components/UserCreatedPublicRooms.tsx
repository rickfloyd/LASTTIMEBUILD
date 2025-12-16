import React from 'react';
import { FiUsers, FiHash, FiChevronRight } from 'react-icons/fi';

// Mock data for rooms. In a real app, this would come from an API.
const publicRooms = [
    {
        id: '1',
        name: 'Quantum-Leap Algos',
        description: 'Discussing next-gen algorithmic trading strategies and research.',
        onlineCount: 78,
        tags: ['AI', 'Trading', 'Quantum'],
    },
    {
        id: '2',
        name: 'DeFi & Options Plays',
        description: 'Exploring decentralized finance and advanced options strategies.',
        onlineCount: 123,
        tags: ['DeFi', 'Options', 'Crypto'],
    },
    {
        id: '3',
        name: 'Global Macro Trends',
        description: 'High-level discussion on market-moving economic indicators.',
        onlineCount: 45,
        tags: ['Macro', 'Economics', 'Forex'],
    },
    {
        id: '4',
        name: 'SMC Veterans',
        description: 'For experienced traders using Smart Money Concepts and price action.',
        onlineCount: 92,
        tags: ['SMC', 'Price Action'],
    },
];

const UserCreatedPublicRooms: React.FC = () => {
    return (
        <div className="neon-card p-6">
            <h3 className="text-2xl font-bold mb-4 neon-card-title">User-Created Public Rooms</h3>
            <div className="space-y-4">
                {publicRooms.map(room => (
                    <div key={room.id} className="bg-slate-800/50 p-4 rounded-lg flex items-center justify-between hover:bg-slate-700/70 transition-colors cursor-pointer">
                        <div className="flex items-center">
                            <div className="text-cyan-400 text-2xl mr-4">
                                <FiHash />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">{room.name}</h4>
                                <p className="text-sm text-gray-400">{room.description}</p>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                    <FiUsers className="mr-2" />
                                    {room.onlineCount} Online
                                </div>
                            </div>
                        </div>
                        <FiChevronRight className="text-gray-500 text-2xl" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserCreatedPublicRooms;
