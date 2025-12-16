export type RiskProfile = {
  accountEquity: number;         // e.g. 10000
  riskPercentPerTrade: number;   // e.g. 1
  maxPortfolioRiskPercent: number;
  updatedAt: number;
};

export type RiskCalcInput = {
  symbol: string;
  entry: number;
  stop: number;
  pipValuePerUnit: number; // generic instrument multiplier
};

export type RiskCalcResult = {
  id: string;
  at: number;
  symbol: string;
  entry: number;
  stop: number;

  stopDistance: number;
  riskDollars: number;
  qty: number;
  rrAtTarget?: number;
};
