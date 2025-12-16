import { Candle } from "./marketData";

export type IndicatorDefinition = {
  id: string;              // indicator id (stable)
  version: string;         // immutable version hash/id
  name: string;
  settingsSchema: any;     // json schema-like (light)
  createdAt: number;
};

export type IndicatorRunInput = {
  symbol: string;
  timeframe: string;
  candles: Candle[];
  settings: Record<string, any>;
  proofMode: boolean; // true = only use info available at candle close
};

export type IndicatorSignal = {
  t: number;
  kind: "BUY" | "SELL" | "INFO";
  price?: number;
  label: string;
};

export type IndicatorReceipt = {
  id: string; // receiptId
  symbol: string;
  timeframe: string;

  indicatorId: string;
  indicatorVersion: string;

  datasetHash: string;
  settingsHash: string;

  generatedAt: number;
  proofMode: boolean;

  signals: IndicatorSignal[];
};
