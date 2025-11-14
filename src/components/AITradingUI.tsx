import React, { useState, useEffect, useCallback } from 'react';
import AITradingEngine, { 
  PredictionResult
} from '../services/aiTradingEngine';

interface AITradingUIProps {
  symbol: string;
}

type TabType = 'prediction' | 'patterns' | 'sentiment' | 'risk' | 'signals' | 'models';

const AITradingUI: React.FC<AITradingUIProps> = ({ symbol }) => {
  const [aiEngine] = useState(() => new AITradingEngine());
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('prediction');
  const [loading, setLoading] = useState(false);

  const runAIAnalysis = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🤖 Running comprehensive AI analysis...');
      
      // Run all AI analyses
      const pred = await aiEngine.predictPrice(symbol);
      setPrediction(pred);
      
      console.log('✅ AI analysis complete');
    } catch (error) {
      console.error('❌ AI analysis failed:', error);
    } finally {
      setLoading(false);
    }
  }, [symbol, aiEngine]);

  useEffect(() => {
    if (symbol) {
      runAIAnalysis();
    }
  }, [symbol, runAIAnalysis]);

  const getConfidenceClass = (confidence: number): string => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendClass = (trend: string): string => {
    switch (trend) {
      case 'bullish': return 'text-green-600';
      case 'bearish': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🤖 AI Trading Assistant</h2>
        <button
          onClick={runAIAnalysis}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '🔄 Analyzing...' : '🚀 Run AI Analysis'}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6 border-b border-gray-200">
        {[
          { key: 'prediction' as const, label: '🎯 Prediction' },
          { key: 'patterns' as const, label: '📊 Patterns' },
          { key: 'sentiment' as const, label: '📈 Sentiment' },
          { key: 'risk' as const, label: '⚠️ Risk' },
          { key: 'signals' as const, label: '🎯 Signals' },
          { key: 'models' as const, label: '🤖 Models' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-gray-600">AI is analyzing market data...</div>
            </div>
          </div>
        ) : (
          <>
            {/* Prediction Tab */}
            {activeTab === 'prediction' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">🎯 Price Prediction</h3>
                  {prediction ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Current Price</div>
                        <div className="text-xl font-bold">${prediction.currentPrice.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Predicted Price</div>
                        <div className={`text-xl font-bold ${getTrendClass(prediction.trend)}`}>
                          ${prediction.predictedPrice.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Confidence</div>
                        <div className={`text-lg font-semibold ${getConfidenceClass(prediction.confidence)}`}>
                          {prediction.confidence.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Trend</div>
                        <div className={`text-lg font-semibold ${getTrendClass(prediction.trend)}`}>
                          {prediction.trend.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">No prediction data</div>
                  )}
                </div>

                {prediction && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🧠 AI Reasoning</h4>
                    <ul className="space-y-1">
                      {prediction.reasoning.map((reason, index) => (
                        <li key={index} className="text-sm text-blue-800">• {reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Other tabs content... */}
            {activeTab === 'patterns' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">📊 Pattern Recognition</h3>
                <div className="text-center text-gray-500 py-8">
                  AI pattern recognition results will appear here
                </div>
              </div>
            )}

            {activeTab === 'sentiment' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">📈 Sentiment Analysis</h3>
                <div className="text-center text-gray-500 py-8">
                  AI sentiment analysis results will appear here
                </div>
              </div>
            )}

            {activeTab === 'risk' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">⚠️ Risk Analysis</h3>
                <div className="text-center text-gray-500 py-8">
                  AI risk analysis results will appear here
                </div>
              </div>
            )}

            {activeTab === 'signals' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">🎯 Trading Signals</h3>
                <div className="text-center text-gray-500 py-8">
                  AI trading signals will appear here
                </div>
              </div>
            )}

            {activeTab === 'models' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">🤖 ML Model Performance</h3>
                <div className="text-center text-gray-500 py-8">
                  ML model performance metrics will appear here
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AITradingUI;