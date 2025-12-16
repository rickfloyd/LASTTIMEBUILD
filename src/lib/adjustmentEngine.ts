import { Candle } from "../types/marketData";
import { CorpActions } from "../types/corpActions";

/**
 * Split-adjust closes historically. Simple model:
 * For a split at time T, candles BEFORE T get divided by ratio.
 */
export function applySplitAdjustments(raw: Candle[], actions: CorpActions | null): Candle[] {
  if (!actions || !actions.splits?.length) return raw.slice();
  const splits = actions.splits.slice().sort((a,b)=>a.at-b.at);

  return raw.map(c => {
    let factor = 1;
    for (const s of splits) {
      if (c.t < s.at) factor *= s.ratio;
    }
    // divide prices by factor to adjust historical prices downward for later split
    const adj = (x:number)=> x / factor;
    return { ...c, o: adj(c.o), h: adj(c.h), l: adj(c.l), c: adj(c.c) };
  });
}
