import React, { useState, useEffect } from 'react';
import { FiCpu, FiActivity, FiLayers, FiToggleLeft, FiToggleRight, FiShield } from 'react-icons/fi';

// Define the available engines
const AVAILABLE_ENGINES = [
    { id: 'marketBridge', name: 'Market Data Bridge', icon: <FiActivity />, desc: 'Real-time connection to exchange feeds.' },
    { id: 'patternLab', name: 'Pattern Recognition Lab', icon: <FiLayers />, desc: 'Auto-detects wedges, flags, and pennants.' },
    { id: 'aiAnalyzer', name: 'AI Market Analyzer', icon: <FiCpu />, desc: 'Gemini-powered trend prediction.' },
];

const EngineControlPanel: React.FC = () => {
    // Default state: All ON per Rick's request
    const [userEngines, setUserEngines] = useState({
        marketBridge: true,
        patternLab: true,
        aiAnalyzer: true
    });

    const [isOpen, setIsOpen] = useState(false);

    // Load saved preferences on boot
    useEffect(() => {
        const saved = localStorage.getItem('activeEngines');
        if (saved) {
            setUserEngines(JSON.parse(saved));
        }
    }, []);

    // Toggle an engine on/off
    const toggleEngine = (engineId: string) => {
        const newState = {
            ...userEngines,
            [engineId]: !userEngines[engineId as keyof typeof userEngines]
        };
        setUserEngines(newState);
        localStorage.setItem('activeEngines', JSON.stringify(newState));
    };

    return (
        <div className="fixed bottom-6 left-6 z-50">
            {/* Main Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-3 rounded-full font-bold shadow-lg transition-all ${
                    isOpen ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'
                }`}
            >
                <FiCpu className={isOpen ? "animate-pulse" : ""} />
                {isOpen ? "ENGINE ROOM OPEN" : "ENGINES"}
            </button>

            {/* The Control Panel */}
            {isOpen && (
                <div className="absolute bottom-16 left-0 w-80 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl p-4 shadow-2xl">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
                        <h3 className="text-white font-bold flex items-center gap-2">
                            <FiShield className="text-green-400" /> Compliance Core
                        </h3>
                        <span className="text-[10px] text-gray-500 uppercase">User Controlled</span>
                    </div>

                    <div className="space-y-4">
                        {AVAILABLE_ENGINES.map((engine) => (
                            <div key={engine.id} className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${userEngines[engine.id as keyof typeof userEngines] ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-500'}`}>
                                        {engine.icon}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-200">{engine.name}</div>
                                        <div className="text-[10px] text-gray-500 leading-tight">{engine.desc}</div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => toggleEngine(engine.id)}
                                    className={`text-2xl transition-colors ${
                                        userEngines[engine.id as keyof typeof userEngines] 
                                        ? 'text-green-500 hover:text-green-400' 
                                        : 'text-gray-600 hover:text-gray-500'
                                    }`}
                                >
                                    {userEngines[engine.id as keyof typeof userEngines] ? <FiToggleRight /> : <FiToggleLeft />}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-800 text-[10px] text-gray-500 text-center font-mono">
                        INFO ONLY. NO AUTO-EXECUTION.
                    </div>
                </div>
            )}
        </div>
    );
};

export default EngineControlPanel;S