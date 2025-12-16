export type OrderSide = "BUY" | "SELL";
export type OrderType = "MARKET" | "LIMIT" | "STOP";

export type OrderRequest = {
  id: string;
  symbol: string;
  qty: number;
  side: OrderSide;
  type: OrderType;
  limitPrice?: number;
  stopPrice?: number;
  createdAt: number;
};

export type OrderState =
  | "CREATED"
  | "SENT"
  | "ACKED"
  | "REJECTED"
  | "FILLED"
  | "CANCELED";

export type OrderRecord = {
  id: string;
  broker: string; // adapter name
  request: OrderRequest;
  state: OrderState;
  lastMessage: string;
  updatedAt: number;
};

export type OrderEvent = {
  id: string;
  orderId: string;
  at: number;
  state: OrderState;
  message: string;
  raw?: any;
};
