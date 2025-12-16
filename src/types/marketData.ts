export type Candle = {
  t: number; // unix ms
  o: number;
  h: number;
  l: number;
  c: number;
  v?: number;
};

export type DataSourceId = "BROKER" | "EXCHANGE" | "AGGREGATOR";

export type Snapshot = {
  symbol: string;
  timeframe: string; // "1m" | "5m" | "1h" etc
  source: DataSourceId;
  capturedAt: number; // unix ms
  candles: Candle[];
};

export type MismatchPoint = {
  t: number;
  field: "o" | "h" | "l" | "c" | "v";
  a: number;
  b: number;
  diff: number;
  pct: number;
};

export type MismatchReport = {
  symbol: string;
  timeframe: string;
  sourceA: DataSourceId;
  sourceB: DataSourceId;
  comparedAt: number;
  candleCountA: number;
  candleCountB: number;
  alignedCount: number;
  missingInA: number;
  missingInB: number;
  maxPctDiffClose: number;
  points: MismatchPoint[];
};