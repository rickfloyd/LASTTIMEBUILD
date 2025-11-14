// Custom Scripting Platform
// Pine Script Alternative - Better than TradingView

export interface Script {
  id: string;
  name: string;
  code: string;
  type: 'indicator' | 'strategy' | 'study';
  version: number;
  author: string;
  description: string;
  parameters: ScriptParameter[];
  inputs: ScriptInput[];
  outputs: ScriptOutput[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface ScriptParameter {
  name: string;
  type: 'number' | 'string' | 'boolean' | 'color';
  defaultValue: unknown;
  description: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface ScriptInput {
  name: string;
  type: 'price' | 'volume' | 'indicator';
  source: string;
  description: string;
}

export interface ScriptOutput {
  name: string;
  type: 'line' | 'histogram' | 'arrow' | 'background' | 'text';
  color: string;
  style: string;
  description: string;
}

export interface ScriptResult {
  scriptId: string;
  timestamp: Date;
  values: { [outputName: string]: number | string };
  signals?: ScriptSignal[];
}

export interface ScriptSignal {
  type: 'buy' | 'sell' | 'alert';
  price: number;
  message: string;
  strength: number; // 0-100
}

export interface BacktestResult {
  scriptId: string;
  startDate: Date;
  endDate: Date;
  symbol: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  trades: BacktestTrade[];
}

export interface BacktestTrade {
  entryDate: Date;
  exitDate: Date;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  side: 'long' | 'short';
  pnl: number;
  pnlPercent: number;
}

export class CustomScriptingEngine {
  private scripts: Script[] = [];
  private results: Map<string, ScriptResult[]> = new Map();
  private marketData: unknown = null;
  private indicators: unknown = null;

  constructor(marketDataManager: unknown, indicatorManager: unknown) {
    this.marketData = marketDataManager;
    this.indicators = indicatorManager;
    this.loadBuiltInScripts();
  }

  // Script Management
  createScript(scriptData: Omit<Script, 'id' | 'createdAt' | 'updatedAt'>): string {
    const script: Script = {
      ...scriptData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.scripts.push(script);
    this.saveScripts();
    return script.id;
  }

  updateScript(id: string, updates: Partial<Script>): boolean {
    const index = this.scripts.findIndex(s => s.id === id);
    if (index === -1) return false;

    this.scripts[index] = {
      ...this.scripts[index],
      ...updates,
      updatedAt: new Date()
    };

    this.saveScripts();
    return true;
  }

  deleteScript(id: string): boolean {
    const initialLength = this.scripts.length;
    this.scripts = this.scripts.filter(s => s.id !== id);
    this.results.delete(id);
    this.saveScripts();
    return this.scripts.length < initialLength;
  }

  getScript(id: string): Script | undefined {
    return this.scripts.find(s => s.id === id);
  }

  getAllScripts(): Script[] {
    return [...this.scripts];
  }

  getScriptsByType(type: Script['type']): Script[] {
    return this.scripts.filter(s => s.type === type);
  }

  // Script Execution Engine
  async executeScript(scriptId: string, symbol: string, timeframe: string = '1D'): Promise<ScriptResult[]> {
    const script = this.getScript(scriptId);
    if (!script || !script.isActive) {
      throw new Error(`Script ${scriptId} not found or inactive`);
    }

    try {
      const context = await this.createExecutionContext(symbol, timeframe);
      const results = await this.runScript(script, context);
      
      this.results.set(scriptId, results);
      return results;
    } catch (error) {
      console.error(`Script execution failed for ${scriptId}:`, error);
      throw error;
    }
  }

  private async createExecutionContext(symbol: string, timeframe: string) {
    // Get market data
    const marketData = await (this.marketData as unknown as { getHistoricalData?: (symbol: string, timeframe: string) => Promise<unknown> })?.getHistoricalData?.(symbol, timeframe);
    
    // Create context with built-in functions
    return {
      symbol,
      timeframe,
      data: marketData || this.generateMockData(),
      functions: this.getBuiltInFunctions(),
      indicators: this.indicators,
      console: console
    };
  }

  private async runScript(script: Script, context: unknown): Promise<ScriptResult[]> {
    // This is a simplified implementation
    // In a real implementation, you'd use a secure JavaScript engine
    
    const results: ScriptResult[] = [];
    const scriptFunction = this.compileScript(script.code);
    
    try {
      const output = await scriptFunction(context);
      
      if (Array.isArray(output)) {
        output.forEach((value, index) => {
          results.push({
            scriptId: script.id,
            timestamp: new Date(Date.now() - (output.length - index) * 86400000),
            values: { main: value }
          });
        });
      } else if (typeof output === 'object') {
        results.push({
          scriptId: script.id,
          timestamp: new Date(),
          values: output as { [outputName: string]: number | string }
        });
      }
    } catch (error) {
      console.error('Script runtime error:', error);
      throw new Error(`Script runtime error: ${error}`);
    }

    return results;
  }

  private compileScript(code: string): (context: unknown) => unknown {
    // This is a very simplified compilation
    // In production, you'd want a proper sandboxed environment
    
    const wrappedCode = `
      return (function(context) {
        const { data, functions, indicators, console } = context;
        const { sma, ema, rsi, macd, bollinger } = functions;
        
        ${code}
      });
    `;

    try {
      const compiled = new Function(wrappedCode);
      return compiled();
    } catch (error) {
      throw new Error(`Script compilation error: ${error}`);
    }
  }

  private getBuiltInFunctions() {
    return {
      // Moving Averages
      sma: (data: number[], period: number) => {
        return this.calculateSMA(data, period);
      },
      
      ema: (data: number[], period: number) => {
        return this.calculateEMA(data, period);
      },
      
      // Technical Indicators
      rsi: (data: number[], period: number = 14) => {
        return this.calculateRSI(data, period);
      },
      
      macd: (data: number[], fast: number = 12, slow: number = 26, signal: number = 9) => {
        return this.calculateMACD(data, fast, slow, signal);
      },
      
      bollinger: (data: number[], period: number = 20, stdDev: number = 2) => {
        return this.calculateBollingerBands(data, period, stdDev);
      },

      // Utility Functions
      highest: (data: number[], period: number) => {
        return Math.max(...data.slice(-period));
      },
      
      lowest: (data: number[], period: number) => {
        return Math.min(...data.slice(-period));
      },
      
      crossover: (series1: number[], series2: number[]) => {
        const len = Math.min(series1.length, series2.length);
        if (len < 2) return false;
        
        const current1 = series1[len - 1];
        const current2 = series2[len - 1];
        const prev1 = series1[len - 2];
        const prev2 = series2[len - 2];
        
        return prev1 <= prev2 && current1 > current2;
      },
      
      crossunder: (series1: number[], series2: number[]) => {
        const len = Math.min(series1.length, series2.length);
        if (len < 2) return false;
        
        const current1 = series1[len - 1];
        const current2 = series2[len - 1];
        const prev1 = series1[len - 2];
        const prev2 = series2[len - 2];
        
        return prev1 >= prev2 && current1 < current2;
      }
    };
  }

  // Technical Indicator Calculations
  private calculateSMA(data: number[], period: number): number[] {
    const result: number[] = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / period);
    }
    return result;
  }

  private calculateEMA(data: number[], period: number): number[] {
    const result: number[] = [];
    const multiplier = 2 / (period + 1);
    
    // Start with SMA for first value
    result[0] = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
    
    for (let i = 1; i < data.length - period + 1; i++) {
      result[i] = (data[i + period - 1] - result[i - 1]) * multiplier + result[i - 1];
    }
    
    return result;
  }

  private calculateRSI(data: number[], period: number): number[] {
    const gains: number[] = [];
    const losses: number[] = [];
    
    for (let i = 1; i < data.length; i++) {
      const change = data[i] - data[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? -change : 0);
    }
    
    const result: number[] = [];
    for (let i = period - 1; i < gains.length; i++) {
      const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      
      if (avgLoss === 0) {
        result.push(100);
      } else {
        const rs = avgGain / avgLoss;
        result.push(100 - (100 / (1 + rs)));
      }
    }
    
    return result;
  }

  private calculateMACD(data: number[], fast: number, slow: number, signal: number) {
    const emaFast = this.calculateEMA(data, fast);
    const emaSlow = this.calculateEMA(data, slow);
    
    const macdLine: number[] = [];
    const minLength = Math.min(emaFast.length, emaSlow.length);
    
    for (let i = 0; i < minLength; i++) {
      macdLine.push(emaFast[i] - emaSlow[i]);
    }
    
    const signalLine = this.calculateEMA(macdLine, signal);
    const histogram = macdLine.slice(-signalLine.length).map((val, i) => val - signalLine[i]);
    
    return { macd: macdLine, signal: signalLine, histogram };
  }

  private calculateBollingerBands(data: number[], period: number, stdDev: number) {
    const sma = this.calculateSMA(data, period);
    const upper: number[] = [];
    const lower: number[] = [];
    
    for (let i = 0; i < sma.length; i++) {
      const slice = data.slice(i, i + period);
      const mean = sma[i];
      const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
      const standardDeviation = Math.sqrt(variance);
      
      upper.push(mean + standardDeviation * stdDev);
      lower.push(mean - standardDeviation * stdDev);
    }
    
    return { upper, middle: sma, lower };
  }

  // Backtesting Engine
  async backtest(scriptId: string, symbol: string, startDate: Date, endDate: Date): Promise<BacktestResult> {
    const script = this.getScript(scriptId);
    if (!script) {
      throw new Error(`Script ${scriptId} not found`);
    }

    if (script.type !== 'strategy') {
      throw new Error('Only strategy scripts can be backtested');
    }

    // Generate mock backtest results
    const trades = this.generateMockTrades(startDate, endDate);
    const winningTrades = trades.filter(t => t.pnl > 0).length;
    const totalReturn = trades.reduce((sum, t) => sum + t.pnlPercent, 0);
    
    return {
      scriptId,
      startDate,
      endDate,
      symbol,
      totalTrades: trades.length,
      winningTrades,
      losingTrades: trades.length - winningTrades,
      winRate: trades.length > 0 ? (winningTrades / trades.length) * 100 : 0,
      totalReturn,
      sharpeRatio: 1.2,
      maxDrawdown: -8.5,
      trades
    };
  }

  private generateMockTrades(startDate: Date, endDate: Date): BacktestTrade[] {
    const trades: BacktestTrade[] = [];
    const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const numTrades = Math.floor(daysDiff / 7); // One trade per week on average
    
    for (let i = 0; i < numTrades; i++) {
      const entryDate = new Date(startDate.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
      const exitDate = new Date(entryDate.getTime() + (3 * 24 * 60 * 60 * 1000));
      const entryPrice = 100 + Math.random() * 50;
      const priceChange = (Math.random() - 0.5) * 10;
      const exitPrice = entryPrice + priceChange;
      const quantity = 100;
      
      trades.push({
        entryDate,
        exitDate,
        entryPrice,
        exitPrice,
        quantity,
        side: 'long',
        pnl: priceChange * quantity,
        pnlPercent: (priceChange / entryPrice) * 100
      });
    }
    
    return trades;
  }

  // Built-in Scripts
  private loadBuiltInScripts() {
    const builtInScripts = [
      {
        name: 'Simple Moving Average Crossover',
        code: `
// Simple MA Crossover Strategy
const fastMA = sma(data.close, 10);
const slowMA = sma(data.close, 20);

const signals = [];
for (let i = 1; i < fastMA.length; i++) {
  if (fastMA[i] > slowMA[i] && fastMA[i-1] <= slowMA[i-1]) {
    signals.push({ type: 'buy', price: data.close[i], message: 'MA Crossover Buy' });
  } else if (fastMA[i] < slowMA[i] && fastMA[i-1] >= slowMA[i-1]) {
    signals.push({ type: 'sell', price: data.close[i], message: 'MA Crossover Sell' });
  }
}

return { fastMA, slowMA, signals };
        `,
        type: 'strategy' as const,
        version: 1,
        author: 'Quantum Charts',
        description: 'Simple moving average crossover strategy',
        parameters: [
          { name: 'Fast Period', type: 'number' as const, defaultValue: 10, description: 'Fast MA period' },
          { name: 'Slow Period', type: 'number' as const, defaultValue: 20, description: 'Slow MA period' }
        ],
        inputs: [
          { name: 'Close', type: 'price' as const, source: 'close', description: 'Closing price' }
        ],
        outputs: [
          { name: 'Fast MA', type: 'line' as const, color: '#06B6D4', style: 'solid', description: 'Fast moving average' },
          { name: 'Slow MA', type: 'line' as const, color: '#EF4444', style: 'solid', description: 'Slow moving average' }
        ],
        isActive: true
      },
      {
        name: 'RSI Overbought/Oversold',
        code: `
// RSI Strategy
const rsiValues = rsi(data.close, 14);
const signals = [];

rsiValues.forEach((value, i) => {
  if (value > 70) {
    signals.push({ type: 'sell', price: data.close[i], message: 'RSI Overbought' });
  } else if (value < 30) {
    signals.push({ type: 'buy', price: data.close[i], message: 'RSI Oversold' });
  }
});

return { rsi: rsiValues, signals };
        `,
        type: 'indicator' as const,
        version: 1,
        author: 'Quantum Charts',
        description: 'RSI overbought/oversold indicator',
        parameters: [
          { name: 'RSI Period', type: 'number' as const, defaultValue: 14, description: 'RSI calculation period' },
          { name: 'Overbought Level', type: 'number' as const, defaultValue: 70, description: 'Overbought threshold' },
          { name: 'Oversold Level', type: 'number' as const, defaultValue: 30, description: 'Oversold threshold' }
        ],
        inputs: [
          { name: 'Close', type: 'price' as const, source: 'close', description: 'Closing price' }
        ],
        outputs: [
          { name: 'RSI', type: 'line' as const, color: '#8B5CF6', style: 'solid', description: 'RSI line' }
        ],
        isActive: true
      }
    ];

    builtInScripts.forEach(script => {
      this.createScript(script);
    });
  }

  // Mock Data Generation
  private generateMockData() {
    const data: { 
      close: number[];
      open: number[];
      high: number[];
      low: number[];
      volume: number[];
    } = { 
      close: [], 
      open: [], 
      high: [], 
      low: [], 
      volume: [] 
    };
    
    let price = 100;
    
    for (let i = 0; i < 100; i++) {
      const change = (Math.random() - 0.5) * 4;
      price += change;
      
      data.close.push(price);
      data.open.push(price - change);
      data.high.push(price + Math.random() * 2);
      data.low.push(price - Math.random() * 2);
      data.volume.push(Math.floor(Math.random() * 1000000));
    }
    
    return data;
  }

  // Persistence
  private saveScripts() {
    try {
      localStorage.setItem('quantum-scripts', JSON.stringify(this.scripts));
    } catch (error) {
      console.error('Failed to save scripts:', error);
    }
  }

  loadScripts() {
    try {
      const saved = localStorage.getItem('quantum-scripts');
      if (saved) {
        const parsedScripts = JSON.parse(saved) as Array<Script & { createdAt: string; updatedAt: string }>;
        this.scripts = parsedScripts.map(script => ({
          ...script,
          createdAt: new Date(script.createdAt),
          updatedAt: new Date(script.updatedAt)
        }));
      }
    } catch (error) {
      console.error('Failed to load scripts:', error);
    }
  }

  private generateId(): string {
    return `script-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default CustomScriptingEngine;