import React from 'react';

const OpenAIBridge: React.FC = () => {
  const handleOpenAIBridge = () => {
    // In a real app, you'd trigger the actual OpenAI bridge functionality here.
    // For this example, we'll just log to the console.
    console.log("OpenAI Bridge activated!");
  };

  return (
    <button 
      onClick={handleOpenAIBridge}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      OpenAI Bridge
    </button>
  );
};

export default OpenAIBridge;