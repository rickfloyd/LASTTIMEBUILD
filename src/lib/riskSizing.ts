import { RiskProfile, RiskCalcInput, RiskCalcResult } from "../types/risk";
import { uid } from "./uid";

export function computePositionSize(profile: RiskProfile, input: RiskCalcInput): RiskCalcResult {
  const stopDistance = Math.abs(input.entry - input.stop);
  if (stopDistance <= 0) throw new Error("Stop distance must be > 0");

  const riskDollars = (profile.accountEquity * (profile.riskPercentPerTrade / 100));

  // cost per unit = stopDistance * pipValuePerUnit
  const dollarsPerUnit = stopDistance * input.pipValuePerUnit;
  if (dollarsPerUnit <= 0) throw new Error("Invalid pipValuePerUnit");

  const qty = Math.floor(riskDollars / dollarsPerUnit);

  return {
    id: uid(),
    at: Date.now(),
    symbol: input.symbol,
    entry: input.entry,
    stop: input.stop,
    stopDistance,
    riskDollars,
    qty,
  };
}
