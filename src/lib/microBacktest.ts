import { Candle } from "../types/marketData";

export type FillModel = {
  spread: number;        // e.g. 0.0002
  slippage: number;      // e.g. 0.00005
  commissionPerTrade: number; // fixed
};

export type BacktestEvent =
  | { at: number; type: "ENTRY"; side: "LONG"|"SHORT"; price: number; note: string }
  | { at: number; type: "EXIT"; side: "LONG"|"SHORT"; price: number; note: string }
  | { at: number; type: "EQUITY"; equity: number };

export type MicroBacktestResult = {
  netPnl: number;
  trades: number;
  winRate: number;
  maxDrawdown: number;
  events: BacktestEvent[];
};

function sma(values: number[], period: number) {
  if (values.length < period) return null;
  let s = 0;
  for (let i = values.length - period; i < values.length; i++) s += values[i];
  return s / period;
}

function applySpreadSlippage(price: number, side: "LONG"|"SHORT", model: FillModel, entryOrExit: "ENTRY"|"EXIT") {
  // deterministic: LONG pays ask on entry, hits bid on exit; SHORT opposite
  const halfSpread = model.spread / 2;
  let p = price;
  if (side === "LONG") {
    p += (entryOrExit === "ENTRY" ? halfSpread : -halfSpread);
  } else {
    p += (entryOrExit === "ENTRY" ? -halfSpread : halfSpread);
  }
  // slippage pushes against trader
  p += (side === "LONG" ? model.slippage : -model.slippage) * (entryOrExit === "ENTRY" ? 1 : -1);
  return p;
}

export function runMicroSmaCross(candles: Candle[], fast=10, slow=30, model: FillModel): MicroBacktestResult {
  const series = candles.slice().sort((a,b)=>a.t-b.t);
  const closes: number[] = [];
  const events: BacktestEvent[] = [];

  let open: { side:"LONG"|"SHORT"; entry:number; entryAt:number } | null = null;
  let equity = 0, peak = 0, maxDD = 0;
  let wins = 0, trades = 0;

  for (const c of series) {
    closes.push(c.c);
    const f = sma(closes, fast);
    const s = sma(closes, slow);
    if (f == null || s == null) continue;

    const prev = closes.slice(0, closes.length-1);
    const pf = sma(prev, fast);
    const ps = sma(prev, slow);
    if (pf == null || ps == null) continue;

    const up = pf <= ps && f > s;
    const down = pf >= ps && f < s;

    if (!open) {
      if (up) {
        const fill = applySpreadSlippage(c.c, "LONG", model, "ENTRY");
        open = { side:"LONG", entry: fill, entryAt: c.t };
        equity -= model.commissionPerTrade;
        events.push({ at: c.t, type:"ENTRY", side:"LONG", price: fill, note:"SMA cross up" });
      } else if (down) {
        const fill = applySpreadSlippage(c.c, "SHORT", model, "ENTRY");
        open = { side:"SHORT", entry: fill, entryAt: c.t };
        equity -= model.commissionPerTrade;
        events.push({ at: c.t, type:"ENTRY", side:"SHORT", price: fill, note:"SMA cross down" });
      }
    } else {
      const exitSignal = (open.side==="LONG" && down) || (open.side==="SHORT" && up);
      if (exitSignal) {
        const fill = applySpreadSlippage(c.c, open.side, model, "EXIT");
        equity -= model.commissionPerTrade;

        const pnl = open.side === "LONG" ? (fill - open.entry) : (open.entry - fill);
        equity += pnl;

        trades++;
        if (pnl > 0) wins++;

        events.push({ at: c.t, type:"EXIT", side: open.side, price: fill, note:"Opposite cross" });

        peak = Math.max(peak, equity);
        maxDD = Math.max(maxDD, peak - equity);
        events.push({ at: c.t, type:"EQUITY", equity });

        open = null;
      }
    }
  }

  const netPnl = equity;
  const winRate = trades ? wins / trades : 0;

  return { netPnl, trades, winRate, maxDrawdown: maxDD, events };
}
