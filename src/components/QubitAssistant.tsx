// src/components/QubitAssistant.tsx
import React from 'react';

interface QubitAssistantProps {
  onClose: () => void;
}

const QubitAssistant: React.FC<QubitAssistantProps> = ({ onClose }) => {
  return (
    <div className="absolute bottom-16 right-6 w-80 bg-gray-800 border border-cyan-400 rounded-lg shadow-lg flex flex-col">
      <div className="p-3 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-white font-bold">Qubit Assistant</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          &times;
        </button>
      </div>
      <div className="p-4 text-white">
        <p>Welcome to the Qubit Playground! I'm here to help you write your first script.</p>
        <p className="mt-2 text-sm text-gray-400">You can declare variables with `var`, create functions with `fun`, and use `print` to see output.</p>
      </div>
    </div>
  );
};

export default QubitAssistant;
