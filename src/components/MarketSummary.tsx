import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import SimplePleasures from './SimplePleasures';
import MakingLifeEasier from './MakingLifeEasier';
import Lifestyle from './Lifestyle';

const Modal: React.FC<{ children: React.ReactNode, onClose: () => void, title: string }> = ({ children, onClose, title }) => (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border-2 border-neon-blue rounded-xl shadow-neon-blue w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold text-neon-green">{title}</h2>
                <button onClick={onClose} className="text-white text-3xl">&times;</button>
            </div>
            <div className="overflow-y-auto flex-grow p-4">
                {children}
            </div>
        </div>
    </div>
);

const MarketSummary = () => {
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [modalTitle, setModalTitle] = useState('');

  const openModal = (component: React.ReactNode, title: string) => {
    setModalContent(component);
    setModalTitle(title);
  };

  const closeModal = () => {
    setModalContent(null);
    setModalTitle('');
  };

  return (
    <div className="bg-crystal-deep px-6 py-6 border-b-2 border-crystal-glow shadow-neon-blue">
      {modalContent && <Modal onClose={closeModal} title={modalTitle}>{modalContent}</Modal>}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-crystal-highlight text-xl font-bold drop-shadow-lg flex items-center">
            <Activity className="w-6 h-6 mr-2 animate-pulse" />
            {'Market Summary >'}
          </h2>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          {['Futures'].map((tab) => (
            <button 
              key={tab}
              onClick={() => console.log(`Switched to ${tab} tab`)}
              className="font-bold transition-all duration-300 px-4 py-2 rounded-lg hover:bg-crystal-top/50 text-crystal-highlight hover:text-white"
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <button onClick={() => openModal(<SimplePleasures />, 'Simple Pleasures')} className="bg-black rounded-lg border border-outline-magenta shadow-outline-magenta flex flex-col text-left">
          <div className="flex items-center justify-between p-2 bg-gray-800 rounded-t-lg">
            <span className="text-crystal-highlight font-bold">SIMPLE PLEASURES</span>
          </div>
        </button>
        <button onClick={() => openModal(<MakingLifeEasier />, 'Make Life Easier')} className="bg-black rounded-lg border border-outline-orange shadow-outline-orange flex flex-col text-left">
          <div className="flex items-center justify-between p-2 bg-gray-800 rounded-t-lg">
            <span className="text-crystal-highlight font-bold">MAKE LIFE EASIER</span>
          </div>
        </button>
        <button onClick={() => openModal(<Lifestyle />, 'Lifestyle')} className="bg-black rounded-lg border border-crystal-glow shadow-neon-blue flex flex-col text-left">
          <div className="flex items-center justify-between p-2 bg-gray-800 rounded-t-lg">
            <span className="text-crystal-highlight font-bold">LIFESTYLE</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default MarketSummary;
