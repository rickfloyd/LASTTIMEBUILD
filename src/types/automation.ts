export type AutomationAction =
  | { kind: "PAPER_ORDER"; broker: string; symbol: string; side: "BUY"|"SELL"; qty: number; type: "MARKET"|"LIMIT"|"STOP"; limitPrice?: number; stopPrice?: number }
  | { kind: "ALERT_ONLY"; message: string };

export type AutomationCondition =
  | { kind: "SIGNAL_MATCH"; indicatorId: string; indicatorVersion?: string; signalKind: "BUY"|"SELL" }
  | { kind: "PRICE_GT"; value: number }
  | { kind: "PRICE_LT"; value: number };

export type RiskGate = {
  maxOrdersPerHour: number;     // hard rate limit
  maxQtyPerOrder: number;
  killSwitch: boolean;
};

export type AutomationRule = {
  id: string;
  name: string;
  enabled: boolean;
  createdAt: number;
  updatedAt: number;

  // Scope
  symbol: string;
  timeframe: string;

  // Logic
  conditions: AutomationCondition[];
  actions: AutomationAction[];

  // Safety
  risk: RiskGate;
};

export type AutomationEvent = {
  id: string;
  at: number;
  ruleId: string;
  kind: "EVALUATED" | "SKIPPED" | "TRIGGERED" | "BLOCKED" | "ACTION_OK" | "ACTION_FAIL";
  message: string;
  meta?: any;
};

export type AutomationRun = {
  id: string;
  at: number;
  ruleId: string;
  triggered: boolean;
  reason: string;
  actionsAttempted: number;
  actionsSucceeded: number;
  actionsFailed: number;
};
