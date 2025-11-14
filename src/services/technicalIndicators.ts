// Advanced Technical Indicators Engine
// 100% Independent - No External Dependencies

export interface IndicatorResult {
  name: string;
  values: number[];
  colors?: string[];
  displayType: 'line' | 'histogram' | 'dots' | 'area';
  panel: 'main' | 'bottom';
}

export interface CandleData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export class TechnicalIndicators {
  
  // Moving Averages
  static sma(data: number[], period: number): number[] {
    const result: number[] = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / period);
    }
    return result;
  }

  static ema(data: number[], period: number): number[] {
    const result: number[] = [];
    const multiplier = 2 / (period + 1);
    
    // Start with SMA for first value
    let ema = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
    result.push(ema);
    
    for (let i = period; i < data.length; i++) {
      ema = (data[i] * multiplier) + (ema * (1 - multiplier));
      result.push(ema);
    }
    
    return result;
  }

  static wma(data: number[], period: number): number[] {
    const result: number[] = [];
    const weights = Array.from({length: period}, (_, i) => i + 1);
    const weightSum = weights.reduce((a, b) => a + b, 0);
    
    for (let i = period - 1; i < data.length; i++) {
      const values = data.slice(i - period + 1, i + 1);
      const weightedSum = values.reduce((sum, val, idx) => sum + val * weights[idx], 0);
      result.push(weightedSum / weightSum);
    }
    
    return result;
  }

  // RSI (Relative Strength Index)
  static rsi(data: number[], period: number = 14): IndicatorResult {
    const changes: number[] = [];
    for (let i = 1; i < data.length; i++) {
      changes.push(data[i] - data[i - 1]);
    }

    const gains = changes.map(change => change > 0 ? change : 0);
    const losses = changes.map(change => change < 0 ? Math.abs(change) : 0);

    const avgGains = this.sma(gains, period);
    const avgLosses = this.sma(losses, period);

    const rsiValues = avgGains.map((avgGain, i) => {
      const rs = avgGain / (avgLosses[i] || 0.0001);
      return 100 - (100 / (1 + rs));
    });

    return {
      name: 'RSI',
      values: rsiValues,
      colors: rsiValues.map(val => val > 70 ? '#ef4444' : val < 30 ? '#10b981' : '#06b6d4'),
      displayType: 'line',
      panel: 'bottom'
    };
  }

  // MACD (Moving Average Convergence Divergence)
  static macd(data: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9): IndicatorResult {
    const fastEMA = this.ema(data, fastPeriod);
    const slowEMA = this.ema(data, slowPeriod);
    
    // Align arrays (slowEMA is shorter)
    const macdLine: number[] = [];
    const startIndex = slowPeriod - fastPeriod;
    
    for (let i = 0; i < slowEMA.length; i++) {
      macdLine.push(fastEMA[i + startIndex] - slowEMA[i]);
    }
    
    const signalLine = this.ema(macdLine, signalPeriod);
    const histogram: number[] = [];
    
    for (let i = 0; i < signalLine.length; i++) {
      const histIndex = i + (macdLine.length - signalLine.length);
      histogram.push(macdLine[histIndex] - signalLine[i]);
    }

    return {
      name: 'MACD',
      values: histogram,
      colors: histogram.map(val => val > 0 ? '#10b981' : '#ef4444'),
      displayType: 'histogram',
      panel: 'bottom'
    };
  }

  // Bollinger Bands
  static bollingerBands(data: number[], period: number = 20, stdDev: number = 2): IndicatorResult {
    const sma = this.sma(data, period);
    const bands: number[] = [];
    
    for (let i = period - 1; i < data.length; i++) {
      const slice = data.slice(i - period + 1, i + 1);
      const mean = sma[i - period + 1];
      const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
      const standardDev = Math.sqrt(variance);
      
      // Store upper, middle, lower bands
      bands.push(mean + stdDev * standardDev); // Upper
      bands.push(mean); // Middle (SMA)
      bands.push(mean - stdDev * standardDev); // Lower
    }

    return {
      name: 'Bollinger Bands',
      values: bands,
      colors: ['#8b5cf6', '#06b6d4', '#8b5cf6'],
      displayType: 'line',
      panel: 'main'
    };
  }

  // Stochastic Oscillator
  static stochastic(candles: CandleData[], kPeriod: number = 14, dPeriod: number = 3): IndicatorResult {
    const kValues: number[] = [];
    
    for (let i = kPeriod - 1; i < candles.length; i++) {
      const slice = candles.slice(i - kPeriod + 1, i + 1);
      const lowestLow = Math.min(...slice.map(c => c.low));
      const highestHigh = Math.max(...slice.map(c => c.high));
      const currentClose = candles[i].close;
      
      const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
      kValues.push(k);
    }
    
    const dValues = this.sma(kValues, dPeriod);

    return {
      name: 'Stochastic',
      values: [...kValues, ...dValues],
      colors: kValues.map(val => val > 80 ? '#ef4444' : val < 20 ? '#10b981' : '#06b6d4'),
      displayType: 'line',
      panel: 'bottom'
    };
  }

  // Williams %R
  static williamsR(candles: CandleData[], period: number = 14): IndicatorResult {
    const values: number[] = [];
    
    for (let i = period - 1; i < candles.length; i++) {
      const slice = candles.slice(i - period + 1, i + 1);
      const highestHigh = Math.max(...slice.map(c => c.high));
      const lowestLow = Math.min(...slice.map(c => c.low));
      const currentClose = candles[i].close;
      
      const wr = ((highestHigh - currentClose) / (highestHigh - lowestLow)) * -100;
      values.push(wr);
    }

    return {
      name: 'Williams %R',
      values,
      colors: values.map(val => val > -20 ? '#ef4444' : val < -80 ? '#10b981' : '#06b6d4'),
      displayType: 'line',
      panel: 'bottom'
    };
  }

  // ADX (Average Directional Index)
  static adx(candles: CandleData[], period: number = 14): IndicatorResult {
    const trueRanges: number[] = [];
    const plusDMs: number[] = [];
    const minusDMs: number[] = [];
    
    for (let i = 1; i < candles.length; i++) {
      const current = candles[i];
      const previous = candles[i - 1];
      
      // True Range
      const tr1 = current.high - current.low;
      const tr2 = Math.abs(current.high - previous.close);
      const tr3 = Math.abs(current.low - previous.close);
      trueRanges.push(Math.max(tr1, tr2, tr3));
      
      // Directional Movement
      const plusDM = current.high - previous.high > previous.low - current.low ? 
                    Math.max(current.high - previous.high, 0) : 0;
      const minusDM = previous.low - current.low > current.high - previous.high ? 
                     Math.max(previous.low - current.low, 0) : 0;
      
      plusDMs.push(plusDM);
      minusDMs.push(minusDM);
    }
    
    const atr = this.sma(trueRanges, period);
    const plusDI = this.sma(plusDMs, period);
    const minusDI = this.sma(minusDMs, period);
    
    const adxValues: number[] = [];
    for (let i = 0; i < atr.length; i++) {
      const di1 = (plusDI[i] / atr[i]) * 100;
      const di2 = (minusDI[i] / atr[i]) * 100;
      const dx = Math.abs(di1 - di2) / (di1 + di2) * 100;
      adxValues.push(dx);
    }
    
    const adxSmoothed = this.sma(adxValues, period);

    return {
      name: 'ADX',
      values: adxSmoothed,
      colors: adxSmoothed.map(val => val > 25 ? '#10b981' : '#ef4444'),
      displayType: 'line',
      panel: 'bottom'
    };
  }

  // CCI (Commodity Channel Index)
  static cci(candles: CandleData[], period: number = 20): IndicatorResult {
    const typicalPrices = candles.map(c => (c.high + c.low + c.close) / 3);
    const sma = this.sma(typicalPrices, period);
    const values: number[] = [];
    
    for (let i = period - 1; i < typicalPrices.length; i++) {
      const slice = typicalPrices.slice(i - period + 1, i + 1);
      const meanDev = slice.reduce((sum, price) => sum + Math.abs(price - sma[i - period + 1]), 0) / period;
      const cci = (typicalPrices[i] - sma[i - period + 1]) / (0.015 * meanDev);
      values.push(cci);
    }

    return {
      name: 'CCI',
      values,
      colors: values.map(val => val > 100 ? '#ef4444' : val < -100 ? '#10b981' : '#06b6d4'),
      displayType: 'line',
      panel: 'bottom'
    };
  }

  // Volume Weighted Average Price (VWAP)
  static vwap(candles: CandleData[]): IndicatorResult {
    let cumulativeVolumePrice = 0;
    let cumulativeVolume = 0;
    const values: number[] = [];
    
    candles.forEach(candle => {
      const typicalPrice = (candle.high + candle.low + candle.close) / 3;
      const volume = candle.volume || 1000000; // Default volume if missing
      
      cumulativeVolumePrice += typicalPrice * volume;
      cumulativeVolume += volume;
      
      values.push(cumulativeVolumePrice / cumulativeVolume);
    });

    return {
      name: 'VWAP',
      values,
      colors: ['#f59e0b'],
      displayType: 'line',
      panel: 'main'
    };
  }

  // Ichimoku Cloud
  static ichimoku(candles: CandleData[]): IndicatorResult {
    const tenkanSen: number[] = [];
    const kijunSen: number[] = [];
    const senkouSpanA: number[] = [];
    
    // Tenkan-sen (9-period high-low average)
    for (let i = 8; i < candles.length; i++) {
      const slice = candles.slice(i - 8, i + 1);
      const high = Math.max(...slice.map(c => c.high));
      const low = Math.min(...slice.map(c => c.low));
      tenkanSen.push((high + low) / 2);
    }
    
    // Kijun-sen (26-period high-low average)
    for (let i = 25; i < candles.length; i++) {
      const slice = candles.slice(i - 25, i + 1);
      const high = Math.max(...slice.map(c => c.high));
      const low = Math.min(...slice.map(c => c.low));
      kijunSen.push((high + low) / 2);
    }
    
    // Senkou Span A (average of Tenkan and Kijun, projected forward)
    const startIndex = Math.max(0, tenkanSen.length - kijunSen.length);
    for (let i = 0; i < kijunSen.length; i++) {
      senkouSpanA.push((tenkanSen[i + startIndex] + kijunSen[i]) / 2);
    }
    
    // Combine all values for display
    const allValues = [...tenkanSen, ...kijunSen, ...senkouSpanA];

    return {
      name: 'Ichimoku',
      values: allValues,
      colors: ['#06b6d4', '#ef4444', '#10b981', '#8b5cf6'],
      displayType: 'line',
      panel: 'main'
    };
  }

  // On-Balance Volume (OBV)
  static obv(candles: CandleData[]): IndicatorResult {
    const values: number[] = [];
    let obvValue = 0;
    
    for (let i = 1; i < candles.length; i++) {
      const volume = candles[i].volume || 1000000;
      
      if (candles[i].close > candles[i - 1].close) {
        obvValue += volume;
      } else if (candles[i].close < candles[i - 1].close) {
        obvValue -= volume;
      }
      
      values.push(obvValue);
    }

    return {
      name: 'OBV',
      values,
      colors: ['#8b5cf6'],
      displayType: 'line',
      panel: 'bottom'
    };
  }
}

// Indicator Manager for easy integration
export class IndicatorManager {
  private activeIndicators: Map<string, IndicatorResult> = new Map();

  addIndicator(name: string, indicator: IndicatorResult) {
    this.activeIndicators.set(name, indicator);
  }

  removeIndicator(name: string) {
    this.activeIndicators.delete(name);
  }

  getIndicator(name: string): IndicatorResult | undefined {
    return this.activeIndicators.get(name);
  }

  getAllIndicators(): IndicatorResult[] {
    return Array.from(this.activeIndicators.values());
  }

  getMainPanelIndicators(): IndicatorResult[] {
    return this.getAllIndicators().filter(indicator => indicator.panel === 'main');
  }

  getBottomPanelIndicators(): IndicatorResult[] {
    return this.getAllIndicators().filter(indicator => indicator.panel === 'bottom');
  }

  calculateIndicator(name: string, candles: CandleData[], params?: Record<string, number>): IndicatorResult | null {
    const closes = candles.map(c => c.close);
    
    switch (name.toLowerCase()) {
      case 'rsi':
        return TechnicalIndicators.rsi(closes, (params?.period as number) || 14);
      case 'macd':
        return TechnicalIndicators.macd(closes, (params?.fast as number) || 12, (params?.slow as number) || 26, (params?.signal as number) || 9);
      case 'bollinger':
        return TechnicalIndicators.bollingerBands(closes, (params?.period as number) || 20, (params?.stdDev as number) || 2);
      case 'stochastic':
        return TechnicalIndicators.stochastic(candles, (params?.k as number) || 14, (params?.d as number) || 3);
      case 'williams':
        return TechnicalIndicators.williamsR(candles, (params?.period as number) || 14);
      case 'adx':
        return TechnicalIndicators.adx(candles, (params?.period as number) || 14);
      case 'cci':
        return TechnicalIndicators.cci(candles, (params?.period as number) || 20);
      case 'vwap':
        return TechnicalIndicators.vwap(candles);
      case 'ichimoku':
        return TechnicalIndicators.ichimoku(candles);
      case 'obv':
        return TechnicalIndicators.obv(candles);
      default:
        return null;
    }
  }
}

export const indicatorManager = new IndicatorManager();