// src/components/TradingAssistant.tsx
import React, { useState } from 'react';
import { forexData, QA } from '../data/forexQA';

const TradingAssistant: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' as const };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    // Use the new data source for responses
    setTimeout(() => {
      const botResponseText = getBotResponse(input);
      const botMessage = { text: botResponseText, sender: 'bot' as const };
      setMessages([...newMessages, botMessage]);
    }, 500);
  };

  const getBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    // Find the best match based on keywords
    let bestMatch: QA | null = null;
    let maxMatchCount = 0;

    for (const qa of forexData) {
      const matchCount = qa.keywords.filter(keyword => lowerInput.includes(keyword)).length;
      if (matchCount > maxMatchCount) {
        maxMatchCount = matchCount;
        bestMatch = qa;
      }
    }

    if (bestMatch) {
      return bestMatch.answer;
    }

    return "I'm sorry, I couldn't find an answer to that question. Please try rephrasing it or asking about a specific trading concept.";
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen flex flex-col">
      <h1 className="text-4xl font-bold mb-4 text-cyan-400">Trading Assistant</h1>
      <p className="mb-6 text-gray-400">
        Ask me anything about forex trading!
      </p>
      
      <div className="flex-grow bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col">
        <div className="flex-grow overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
              <div className={`p-3 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-600' : 'bg-gray-700'}`}>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-grow bg-gray-700 text-white rounded-l-lg p-2 focus:outline-none"
            placeholder="Type your question..."
          />
          <button
            onClick={handleSend}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-r-lg transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradingAssistant;
