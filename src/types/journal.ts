export type JournalEntry = {
  id: string;
  at: number;
  symbol: string;
  timeframe?: string;
  setupTags: string[];
  notes: string;

  // Optional emotions/discipline tags
  emotion?: string;
  disciplineScore?: number; // 0..10

  // Optional screenshot URL (firebase storage later)
  screenshotUrl?: string;
};

export type JournalTrade = {
  id: string;
  at: number;
  symbol: string;
  side: "LONG"|"SHORT";
  entry: number;
  exit: number;
  qty: number;

  // Derived
  pnl: number;
  rMultiple?: number;
  setupTags: string[];
};

export type JournalStatsSummary = {
  updatedAt: number;
  trades: number;
  wins: number;
  losses: number;
  winRate: number;
  netPnl: number;
  avgPnl: number;
};
