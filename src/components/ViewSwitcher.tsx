import React from 'react';
import { useQuantumApp } from '../contexts/QuantumAppContext';
import { Eye, Zap, Sliders } from 'lucide-react';

const ViewSwitcher: React.FC = () => {
  const { appMode, setAppMode } = useQuantumApp();

  const modes = [
    { id: 'lucid', name: 'Lucid', icon: Eye, color: 'cyan' },
    { id: 'minimal', name: 'Minimal', icon: Zap, color: 'pink' },
    { id: 'custom', name: 'Custom', icon: Sliders, color: 'orange' },
  ];

  return (
    <div className="fixed top-24 right-4 bg-gray-800/50 backdrop-blur-md border border-cyan-500/30 rounded-full p-2 flex items-center space-x-2 z-50">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => setAppMode(mode.id as 'lucid' | 'minimal' | 'custom')}
          className={`px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 transition-all duration-300 ${
            appMode === mode.id
              ? `bg-cyan-500 text-black shadow-lg shadow-cyan-500/50`
              : `text-gray-300 hover:bg-gray-700/50 hover:text-white`
          }`}>
          <mode.icon className={`w-5 h-5 text-${mode.color}-400`} />
          <span>{mode.name}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewSwitcher;