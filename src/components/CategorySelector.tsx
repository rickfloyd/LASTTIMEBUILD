import React, { useState } from 'react';
import { FiTrendingUp, FiDollarSign, FiZap, FiTarget, FiGlobe, FiBarChart2, FiLayers, FiAlertTriangle, FiClock } from 'react-icons/fi';

const CATEGORIES = [
    { name: 'Stocks', icon: <FiTrendingUp /> },
    { name: 'Funds & ETFs', icon: <FiDollarSign /> },
    { name: 'Futures', icon: <FiZap /> },
    { name: 'Forex', icon: <FiTarget /> },
    { name: 'Cryptocurrencies', icon: <FiGlobe /> },
    { name: 'Indices', icon: <FiBarChart2 /> },
    { name: 'Bonds', icon: <FiLayers /> },
    { name: 'Options', icon: <FiAlertTriangle /> },
    { name: 'Economic Indicators', icon: <FiClock /> },
];

export const CategorySelector: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>('Stocks');

    return (
        <div className="bg-[#0A0A0F] p-6 rounded-xl border border-gray-700 shadow-lg">
            <h2 className="text-xl font-black text-cyan-400 mb-6 neon-card-title">Primary Asset Selector (9 Categories)</h2>
            
            <div className="grid grid-cols-3 gap-6"> 
                {CATEGORIES.map((category) => {
                    const isActive = category.name === activeCategory;
                    
                    return (
                        <button
                            key={category.name}
                            onClick={() => setActiveCategory(category.name)}
                            className={`p-6 text-center transition-all neon-card ${isActive ? 'neon-card-glow' : 'neon-card-pulse'}`}>
                            <div className={`text-5xl mx-auto mb-2`}>
                                {category.icon}
                            </div>
                            <span className={`text-lg font-bold`}>
                                {category.name}
                            </span>
                        </button>
                    );
                })}
            </div>
            
            <div className="mt-6 text-sm text-gray-500 text-center">
                Currently loaded analysis for: <span className="text-white font-bold">{activeCategory}</span>
            </div>
        </div>
    );
};