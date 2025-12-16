export type Panel = {
  id: string;
  symbol: string;
  timeframe: string;
  syncGroup: string; // "A" | "B" | "" etc
};

export type Layout = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  panels: Panel[];
};