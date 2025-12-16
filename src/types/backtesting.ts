✅ Create: src/types/backtesting.ts
export type BacktestTrade = {
  side: "BUY" | "SELL";
  qty: number;
  price: number;
  ts: number;
  balance: number;
};

export type BacktestResult = {
  ruleId: string;
  startTs: number;
  endTs: number;

  // Stats
  netProfit: number;
  totalTrades: number;
  winRate: number;
  maxDrawdown: number;

  // Chart data
  equityCurve: { ts: number; balance: number }[];
  trades: BacktestTrade[];
};
