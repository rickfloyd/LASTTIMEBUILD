// FRONTEND_SRC/utils/patternDetection.ts

// === Types ===

export interface CandleData {
  time: number;   // UNIX timestamp (seconds or ms)
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export type PatternDirection = "bullish" | "bearish" | "neutral";

export interface PatternPoint {
  label: string;  // e.g. "First Top", "Neckline"
  index: number;  // candle index in the array
  price: number;
}

export interface PatternResult {
  name: string;                // e.g. "Double Top"
  type: string;                // e.g. "double-top"
  direction: PatternDirection; // bullish / bearish
  confidence: number;          // 0–100
  target: number;              // price target
  stopLoss: number;            // suggested stop
  startIndex: number;          // pattern start candle index
  endIndex: number;            // pattern end candle index
  points: PatternPoint[];      // key points in the pattern
  description?: string;        // human-readable explanation
}

// Internal pivot type
interface Pivot {
  index: number;
  price: number;
  type: "high" | "low";
}

// === Public Entry Point ===

/**
 * Main detection function.
 * Call this with your OHLC candles and it will return all detected patterns.
 *
 * Example:
 *   const patterns = detectAllPatterns(candles);
 */
export function detectAllPatterns(candles: CandleData[]): PatternResult[] {
  if (!candles || candles.length < 20) return [];

  const pivots = findPivots(candles, 2);

  const results: PatternResult[] = [
    ...detectDoubleTop(pivots, candles),
    ...detectDoubleBottom(pivots, candles),
    // Stubs for future algorithms – safe no-op for now:
    ...detectHeadAndShoulders(pivots, candles),
    ...detectAscendingTriangle(pivots, candles),
    ...detectDescendingTriangle(pivots, candles),
    ...detectBullFlag(candles),
    ...detectBearFlag(candles),
    ...detectCupAndHandle(pivots, candles),
  ];

  // Sort by confidence (highest first)
  return results.sort((a, b) => b.confidence - a.confidence);
}

// === Pivot Detection ===

/**
 * Basic pivot finder: looks for local highs and lows.
 *
 * lookback = how many candles on each side must be lower/higher.
 */
export function findPivots(
  candles: CandleData[],
  lookback: number = 2
): Pivot[] {
  const pivots: Pivot[] = [];

  for (let i = lookback; i < candles.length - lookback; i++) {
    const c = candles[i];

    let isHigh = true;
    let isLow = true;

    for (let j = i - lookback; j <= i + lookback; j++) {
      if (j === i) continue;
      if (candles[j].high >= c.high) {
        isHigh = false;
      }
      if (candles[j].low <= c.low) {
        isLow = false;
      }
    }

    if (isHigh) {
      pivots.push({ index: i, price: c.high, type: "high" });
    } else if (isLow) {
      pivots.push({ index: i, price: c.low, type: "low" });
    }
  }

  return pivots;
}

// === Helper Functions ===

function priceDiffPct(a: number, b: number): number {
  if (b === 0) return 0;
  return (Math.abs(a - b) / Math.abs(b)) * 100;
}

function necklineBetween(
  candles: CandleData[],
  leftIndex: number,
  rightIndex: number
): { price: number; index: number } {
  let minPrice = Infinity;
  let minIndex = leftIndex;

  for (let i = leftIndex; i <= rightIndex; i++) {
    if (candles[i].low < minPrice) {
      minPrice = candles[i].low;
      minIndex = i;
    }
  }

  return { price: minPrice, index: minIndex };
}

function valleyBetween(
  candles: CandleData[],
  leftIndex: number,
  rightIndex: number
): { price: number; index: number } {
  // Same as necklineBetween for now (can be extended later)
  return necklineBetween(candles, leftIndex, rightIndex);
}

// === Double Top / Double Bottom ===

function detectDoubleTop(pivots: Pivot[], candles: CandleData[]): PatternResult[] {
  const results: PatternResult[] = [];
  const tolerancePct = 2.0; // max % difference between peaks

  const highs = pivots.filter((p) => p.type === "high");

  for (let i = 0; i < highs.length - 1; i++) {
    const first = highs[i];

    for (let j = i + 1; j < highs.length; j++) {
      const second = highs[j];

      // Require some distance between tops
      if (second.index - first.index < 3) continue;

      const diff = priceDiffPct(first.price, second.price);
      if (diff > tolerancePct) continue;

      // Neckline / valley between peaks
      const neck = valleyBetween(candles, first.index, second.index);

      // Require neckline clearly lower than peaks
      const dropPct = priceDiffPct(neck.price, (first.price + second.price) / 2);
      if (dropPct < 1.0) continue;

      const symmetryPenalty = Math.abs(second.index - first.index) <= 10 ? 0 : 10;
      const depthBonus = Math.min(dropPct, 5); // up to +5

      let confidence = 70 + depthBonus - symmetryPenalty;
      confidence = Math.max(50, Math.min(confidence, 95));

      const peakPrice = Math.max(first.price, second.price);
      const height = peakPrice - neck.price;
      const target = neck.price - height; // measured move
      const stopLoss = peakPrice * 1.01;  // 1% above peaks

      results.push({
        name: "Double Top",
        type: "double-top",
        direction: "bearish",
        confidence,
        target,
        stopLoss,
        startIndex: first.index,
        endIndex: second.index,
        points: [
          { label: "First Top", index: first.index, price: first.price },
          { label: "Second Top", index: second.index, price: second.price },
          { label: "Neckline", index: neck.index, price: neck.price },
        ],
        description:
          "Two similar highs with a clear valley between them. Potential bearish reversal pattern.",
      });
    }
  }

  return results;
}

function detectDoubleBottom(
  pivots: Pivot[],
  candles: CandleData[]
): PatternResult[] {
  const results: PatternResult[] = [];
  const tolerancePct = 2.0;

  const lows = pivots.filter((p) => p.type === "low");

  for (let i = 0; i < lows.length - 1; i++) {
    const first = lows[i];

    for (let j = i + 1; j < lows.length; j++) {
      const second = lows[j];

      if (second.index - first.index < 3) continue;

      const diff = priceDiffPct(first.price, second.price);
      if (diff > tolerancePct) continue;

      const peakBetween = (() => {
        let maxPrice = -Infinity;
        let maxIndex = first.index;
        for (let k = first.index; k <= second.index; k++) {
          if (candles[k].high > maxPrice) {
            maxPrice = candles[k].high;
            maxIndex = k;
          }
        }
        return { price: maxPrice, index: maxIndex };
      })();

      const risePct = priceDiffPct(peakBetween.price, (first.price + second.price) / 2);
      if (risePct < 1.0) continue;

      const symmetryPenalty = Math.abs(second.index - first.index) <= 10 ? 0 : 10;
      const depthBonus = Math.min(risePct, 5);

      let confidence = 70 + depthBonus - symmetryPenalty;
      confidence = Math.max(50, Math.min(confidence, 95));

      const bottomPrice = Math.min(first.price, second.price);
      const height = peakBetween.price - bottomPrice;
      const target = peakBetween.price + height;
      const stopLoss = bottomPrice * 0.99; // 1% below bottoms

      results.push({
        name: "Double Bottom",
        type: "double-bottom",
        direction: "bullish",
        confidence,
        target,
        stopLoss,
        startIndex: first.index,
        endIndex: second.index,
        points: [
          { label: "First Bottom", index: first.index, price: first.price },
          { label: "Second Bottom", index: second.index, price: second.price },
          { label: "Peak", index: peakBetween.index, price: peakBetween.price },
        ],
        description:
          "Two similar lows with a clear rally between them. Potential bullish reversal pattern.",
      });
    }
  }

  return results;
}

// === Stubs for other patterns (safe no-op for now) ===

function detectHeadAndShoulders(
  _pivots: Pivot[],
  _candles: CandleData[]
): PatternResult[] {
  // TODO: implement real logic later
  return [];
}

function detectAscendingTriangle(
  _pivots: Pivot[],
  _candles: CandleData[]
): PatternResult[] {
  // TODO: implement real logic later
  return [];
}

function detectDescendingTriangle(
  _pivots: Pivot[],
  _candles: CandleData[]
): PatternResult[] {
  // TODO: implement real logic later
  return [];
}

function detectBullFlag(_candles: CandleData[]): PatternResult[] {
  // TODO: implement real logic later
  return [];
}

function detectBearFlag(_candles: CandleData[]): PatternResult[] {
  // TODO: implement real logic later
  return [];
}

function detectCupAndHandle(
  _pivots: Pivot[],
  _candles: CandleData[]
): PatternResult[] {
  // TODO: implement real logic later
  return [];
}