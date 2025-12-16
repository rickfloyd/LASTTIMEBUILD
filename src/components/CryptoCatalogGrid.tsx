import React from 'react';
import { FiTrendingUp, FiLock, FiGlobe } from 'react-icons/fi';

const CRYPTO_CATALOG = [
    { name: 'BTC/USD', status: 'Active', color: 'text-orange-500', icon: 'trend' },
    { name: 'ETH/USD', status: 'Active', color: 'text-purple-500', icon: 'trend' },
    { name: 'SOL/USD', status: 'Volatile', color: 'text-cyan-500', icon: 'trend' },
    { name: 'XRP/USD', status: 'Locked', color: 'text-gray-500', icon: 'lock' },
    { name: 'ADA/USD', status: 'Stable', color: 'text-green-500', icon: 'globe' },
    { name: 'DOGE/USD', status: 'Active', color: 'text-yellow-500', icon: 'trend' },
    { name: 'AVAX/USD', status: 'Active', color: 'text-red-500', icon: 'trend' },
    { name: 'MATIC/USD', status: 'Active', color: 'text-indigo-500', icon: 'trend' },
    { name: 'LINK/USD', status: 'Volatile', color: 'text-lime-500', icon: 'trend' },
    { name: 'DOT/USD', status: 'Locked', color: 'text-gray-500', icon: 'lock' },
    { name: 'UNI/USD', status: 'Active', color: 'text-fuchsia-500', icon: 'trend' },
    { name: 'LTC/USD', status: 'Stable', color: 'text-blue-500', icon: 'globe' },
    { name: 'BCH/USD', status: 'Active', color: 'text-emerald-500', icon: 'trend' },
    { name: 'XLM/USD', status: 'Locked', color: 'text-gray-500', icon: 'lock' },
    { name: 'TRX/USD', status: 'Active', color: 'text-pink-500', icon: 'trend' },
    { name: 'ATOM/USD', status: 'Volatile', color: 'text-rose-500', icon: 'trend' },
    { name: 'ALGO/USD', status: 'Active', color: 'text-teal-500', icon: 'trend' },
    // Total 25 Assets
    { name: 'XTZ/USD', status: 'Locked', color: 'text-gray-500', icon: 'lock' },
    { name: 'VET/USD', status: 'Stable', color: 'text-green-500', icon: 'globe' },
    { name: 'EOS/USD', status: 'Active', color: 'text-amber-500', icon: 'trend' },
    { name: 'NEO/USD', status: 'Active', color: 'text-cyan-500', icon: 'trend' },
    { name: 'DASH/USD', status: 'Volatile', color: 'text-purple-500', icon: 'trend' },
    { name: 'ZEC/USD', status: 'Locked', color: 'text-gray-500', icon: 'lock' },
    { name: 'AAVE/USD', status: 'Active', color: 'text-blue-500', icon: 'trend' },
    { name: 'SNX/USD', status: 'Stable', color: 'text-emerald-500', icon: 'globe' },
];

// --- FIXED SVG ICON FUNCTION ---
// This uses clean, safe SVG icons that cannot be corrupted.
const getIconSvg = (iconType: string, color: string) => {
    const className = `w-4 h-4 ${color}`;
    
    if (iconType === 'trend') {
        // Safe SVG for Trending Up
        return (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
        );
    }
    if (iconType === 'lock') {
        // Safe SVG for Locked
        return (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zm10-11V7a4 4 0 00-8 0v3"></path>
            </svg>
        );
    }
    // Safe SVG for Globe
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1h5.5M19.945 11H17a2 2 0 00-2-2V8a2 2 0 00-2-2h-3M5 11a7 7 0 1114 0M12 17c1.38 0 2.5-1.12 2.5-2.5S13.38 12 12 12s-2.5 1.12-2.5 2.5S10.62 17 12 17z"></path>
        </svg>
    );
};

export const CryptoCatalogGrid: React.FC = () => {
    
    return (
        <div className="p-4 bg-[#0A0A0F] rounded-xl border border-gray-700 shadow-lg mt-6">
            <h3 className="text-xl font-black text-white mb-4 border-b border-gray-800 pb-2">
                Wall of Crypto Catalogs (5x5 Matrix)
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto">
                {CRYPTO_CATALOG.map((item, index) => (
                    <button
                        key={index}
                        className={`p-3 bg-black/50 border border-gray-700 rounded-lg text-left transition-all hover:bg-gray-800/70 hover:shadow-xl`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className={`text-sm font-bold ${item.color}`}>{item.name}</span>
                            {getIconSvg(item.icon, item.color)} {/* USING THE SAFE SVG FUNCTION */}
                        </div>
                        <p className="text-xs text-gray-400">{item.status}</p>
                    </button>
                ))}
            </div>

            <p className="text-xs text-gray-600 mt-4 text-center">
                Total Assets Tracked: {CRYPTO_CATALOG.length}. Click to load dedicated analysis chart.
            </p>
        </div>
    );
};
