import { Candle } from "../types/marketData";
import { IndicatorSignal } from "../types/indicators";

function sma(values: number[], period: number): number | null {
  if (values.length < period) return null;
  let sum = 0;
  for (let i = values.length - period; i < values.length; i++) sum += values[i];
  return sum / period;
}

/**
 * Deterministic, non-repaint SMA cross signals.
 * proofMode = only confirm on candle close using historical data only.
 */
export function smaCrossSignals(params: {
  candles: Candle[];
  fast: number;
  slow: number;
  proofMode: boolean;
}): IndicatorSignal[] {
  const candles = params.candles.slice().sort((a, b) => a.t - b.t);
  const closes: number[] = [];
  const signals: IndicatorSignal[] = [];

  for (let i = 0; i < candles.length; i++) {
    const c = candles[i];
    closes.push(c.c);

    const f = sma(closes, params.fast);
    const s = sma(closes, params.slow);
    if (f == null || s == null) continue;

    const prevCloses = closes.slice(0, closes.length - 1);
    const pf = sma(prevCloses, params.fast);
    const ps = sma(prevCloses, params.slow);
    if (pf == null || ps == null) continue;

    // Crosses are only confirmed at the close of candle i (no future peek)
    const crossedUp = pf <= ps && f > s;
    const crossedDown = pf >= ps && f < s;

    if (crossedUp) signals.push({ t: c.t, kind: "BUY", price: c.c, label: "SMA Cross Up" });
    if (crossedDown) signals.push({ t: c.t, kind: "SELL", price: c.c, label: "SMA Cross Down" });

    // proofMode does not change this logic because it never uses future data.
    // (For other indicators you would explicitly avoid forward-looking references here.)
  }

  return signals;
}
