import { Candle, MismatchPoint, MismatchReport, DataSourceId } from "../types/marketData";

function mapByTime(candles: Candle[]) {
  const m = new Map<number, Candle>();
  for (const c of candles) m.set(c.t, c);
  return m;
}

function pct(diff: number, base: number) {
  if (base === 0) return 0;
  return (diff / base) * 100;
}

export function buildMismatchReport(params: {
  symbol: string;
  timeframe: string;
  sourceA: DataSourceId;
  sourceB: DataSourceId;
  candlesA: Candle[];
  candlesB: Candle[];
  tolerancePct?: number; // default 0.02% (tight)
}) : MismatchReport {
  const tolerancePct = params.tolerancePct ?? 0.02;

  const aMap = mapByTime(params.candlesA);
  const bMap = mapByTime(params.candlesB);

  const times = Array.from(new Set([...aMap.keys(), ...bMap.keys()])).sort((x, y) => x - y);

  let missingInA = 0;
  let missingInB = 0;
  let alignedCount = 0;

  const points: MismatchPoint[] = [];
  let maxPctDiffClose = 0;

  const fields: Array<"o" | "h" | "l" | "c" | "v"> = ["o", "h", "l", "c", "v"];

  for (const t of times) {
    const a = aMap.get(t);
    const b = bMap.get(t);

    if (!a) { missingInA++; continue; }
    if (!b) { missingInB++; continue; }

    alignedCount++;

    for (const f of fields) {
      const av = (a as any)[f];
      const bv = (b as any)[f];
      if (av == null || bv == null) continue;

      const diff = bv - av;
      const p = Math.abs(pct(diff, av));

      if (f === "c") maxPctDiffClose = Math.max(maxPctDiffClose, p);

      if (p >= tolerancePct) {
        points.push({ t, field: f, a: av, b: bv, diff, pct: p });
      }
    }
  }

  return {
    symbol: params.symbol,
    timeframe: params.timeframe,
    sourceA: params.sourceA,
    sourceB: params.sourceB,
    comparedAt: Date.now(),
    candleCountA: params.candlesA.length,
    candleCountB: params.candlesB.length,
    alignedCount,
    missingInA,
    missingInB,
    maxPctDiffClose,
    points: points.sort((p1, p2) => p2.pct - p1.pct).slice(0, 500),
  };
}
