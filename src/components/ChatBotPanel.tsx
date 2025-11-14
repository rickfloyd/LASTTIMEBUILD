import React, { useState } from 'react';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  chartSymbol?: string;
  tradeIdea?: {
    entry: number;
    exit: number;
    stopLoss: number;
    takeProfit: number;
    rationale: string;
  };
}

const mockBotResponse = async (userMsg: string, chartSymbol: string): Promise<ChatMessage> => {
  // Simulate AI/ML analysis and trade recommendation
  return {
    sender: 'bot',
    text: `Analyzing ${chartSymbol}...\nEntry: $225.50\nExit: $230.00\nStop Loss: $223.00\nTake Profit: $235.00`,
    chartSymbol,
    tradeIdea: {
      entry: 225.5,
      exit: 230.0,
      stopLoss: 223.0,
      takeProfit: 235.0,
      rationale: 'AI detected bullish pattern with high confidence. Suggested risk/reward ratio: 2.5.'
    }
  };
};

export default function ChatBotPanel({ symbol }: { symbol: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { sender: 'user', text: input, chartSymbol: symbol };
    setMessages((msgs) => [...msgs, userMsg]);
    setLoading(true);
    const botMsg = await mockBotResponse(input, symbol);
    setMessages((msgs) => [...msgs, botMsg]);
    setLoading(false);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg border-2 border-cyan-500 shadow-lg p-4">
      <h2 className="text-lg font-bold text-cyan-300 mb-2">AI Trading Chatbot</h2>
      <div className="flex-1 overflow-y-auto mb-2 space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-2 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-800 text-white self-end' : 'bg-pink-900 text-pink-200 self-start'}`}>
            <div>{msg.text}</div>
            {msg.tradeIdea && (
              <div className="mt-2 text-xs bg-gray-800 p-2 rounded">
                <div><b>Entry:</b> ${msg.tradeIdea.entry}</div>
                <div><b>Exit:</b> ${msg.tradeIdea.exit}</div>
                <div><b>Stop Loss:</b> ${msg.tradeIdea.stopLoss}</div>
                <div><b>Take Profit:</b> ${msg.tradeIdea.takeProfit}</div>
                <div><b>Rationale:</b> {msg.tradeIdea.rationale}</div>
              </div>
            )}
          </div>
        ))}
        {loading && <div className="text-cyan-400">AI is thinking...</div>}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded bg-gray-800 border border-cyan-500 px-2 py-1 text-white"
          placeholder="Ask about {symbol}..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          disabled={loading}
        />
        <button
          className="bg-cyan-600 hover:bg-cyan-400 text-white rounded px-4 py-1"
          onClick={sendMessage}
          disabled={loading}
        >Send</button>
      </div>
    </div>
  );
}
