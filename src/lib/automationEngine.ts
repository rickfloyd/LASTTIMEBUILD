import { AutomationRule } from "../types/automation";
import { IndicatorReceipt } from "../types/indicators";
import { countRecentRuns, writeAutomationEvent, writeAutomationRun } from "../services/automationStore";
import { placeOrder } from "../services/brokerBus";

/**
 * Input snapshot into automation: keep it simple & deterministic.
 */
export type AutomationContext = {
  uidUser: string;
  rule: AutomationRule;

  // Market snapshot
  lastPrice?: number;

  // Latest receipt (optional) to trigger SIGNAL_MATCH rules
  receipt?: IndicatorReceipt | null;
};

export async function evaluateAndExecute(ctx: AutomationContext) {
  const { uidUser, rule } = ctx;

  await writeAutomationEvent(uidUser, {
    ruleId: rule.id,
    kind: "EVALUATED",
    message: "Rule evaluated",
    meta: { enabled: rule.enabled, symbol: rule.symbol, timeframe: rule.timeframe },
  });

  if (!rule.enabled) {
    await writeAutomationEvent(uidUser, { ruleId: rule.id, kind: "SKIPPED", message: "Rule disabled" });
    await writeAutomationRun(uidUser, {
      ruleId: rule.id, triggered: false, reason: "DISABLED",
      actionsAttempted: 0, actionsSucceeded: 0, actionsFailed: 0,
    });
    return;
  }

  if (rule.risk.killSwitch) {
    await writeAutomationEvent(uidUser, { ruleId: rule.id, kind: "BLOCKED", message: "Kill switch active" });
    await writeAutomationRun(uidUser, {
      ruleId: rule.id, triggered: false, reason: "KILL_SWITCH",
      actionsAttempted: 0, actionsSucceeded: 0, actionsFailed: 0,
    });
    return;
  }

  // Rate limit: maxOrdersPerHour
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  const recent = await countRecentRuns(uidUser, rule.id, oneHourAgo);
  if (recent >= rule.risk.maxOrdersPerHour) {
    await writeAutomationEvent(uidUser, { ruleId: rule.id, kind: "BLOCKED", message: "Rate limit exceeded", meta: { recent } });
    await writeAutomationRun(uidUser, {
      ruleId: rule.id, triggered: false, reason: "RATE_LIMIT",
      actionsAttempted: 0, actionsSucceeded: 0, actionsFailed: 0,
    });
    return;
  }

  // Evaluate conditions
  const ok = rule.conditions.every(cond => {
    if (cond.kind === "PRICE_GT") return (ctx.lastPrice ?? -Infinity) > cond.value;
    if (cond.kind === "PRICE_LT") return (ctx.lastPrice ?? Infinity) < cond.value;

    if (cond.kind === "SIGNAL_MATCH") {
      const r = ctx.receipt;
      if (!r) return false;
      if (r.indicatorId !== cond.indicatorId) return false;
      if (cond.indicatorVersion && r.indicatorVersion !== cond.indicatorVersion) return false;
      return r.signals.some(s => s.kind === cond.signalKind);
    }

    return false;
  });

  if (!ok) {
    await writeAutomationEvent(uidUser, { ruleId: rule.id, kind: "SKIPPED", message: "Conditions not met" });
    await writeAutomationRun(uidUser, {
      ruleId: rule.id, triggered: false, reason: "CONDITIONS_FALSE",
      actionsAttempted: 0, actionsSucceeded: 0, actionsFailed: 0,
    });
    return;
  }

  await writeAutomationEvent(uidUser, { ruleId: rule.id, kind: "TRIGGERED", message: "Triggered" });

  // Execute actions with safety gates
  let attempted = 0, okCount = 0, failCount = 0;

  for (const action of rule.actions) {
    attempted++;
    try {
      if (action.kind === "ALERT_ONLY") {
        await writeAutomationEvent(uidUser, {
          ruleId: rule.id,
          kind: "ACTION_OK",
          message: "Alert emitted",
          meta: { message: action.message },
        });
        okCount++;
      }

      if (action.kind === "PAPER_ORDER") {
        if (action.qty > rule.risk.maxQtyPerOrder) {
          await writeAutomationEvent(uidUser, {
            ruleId: rule.id,
            kind: "BLOCKED",
            message: "Order blocked: qty > maxQtyPerOrder",
            meta: { qty: action.qty, max: rule.risk.maxQtyPerOrder },
          });
          failCount++;
          continue;
        }

        // placeOrder writes trace to Firestore (orders + order_events)
        await placeOrder(uidUser, action.broker, {
          symbol: action.symbol,
          qty: action.qty,
          side: action.side,
          type: action.type,
          limitPrice: action.limitPrice,
          stopPrice: action.stopPrice,
        });

        await writeAutomationEvent(uidUser, {
          ruleId: rule.id,
          kind: "ACTION_OK",
          message: "Paper order placed (sandbox broker bus)",
          meta: action,
        });
        okCount++;
      }
    } catch (e: any) {
      await writeAutomationEvent(uidUser, {
        ruleId: rule.id,
        kind: "ACTION_FAIL",
        message: e?.message || "Action failed",
        meta: { action },
      });
      failCount++;
    }
  }

  await writeAutomationRun(uidUser, {
    ruleId: rule.id,
    triggered: true,
    reason: "TRIGGERED",
    actionsAttempted: attempted,
    actionsSucceeded: okCount,
    actionsFailed: failCount,
  });
}
