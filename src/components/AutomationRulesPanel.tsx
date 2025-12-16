import React, { useEffect, useMemo, useState } from "react";
import { useEntitlements } from "../context/EntitlementsContext";
import { AutomationRule } from "../types/automation";
import { listRules, saveRule } from "../services/automationStore";
import { evaluateAndExecute } from "../lib/automationEngine";

export default function AutomationRulesPanel() {
  const { uid } = useEntitlements();

  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [ruleJson, setRuleJson] = useState<string>("");
  const [lastPrice, setLastPrice] = useState<string>("1.0000");
  const [msg, setMsg] = useState<string | null>(null);

  const selected = useMemo(() => rules.find(r => r.id === selectedId) ?? null, [rules, selectedId]);

  async function refresh() {
    if (!uid) return;
    const r = await listRules(uid);
    setRules(r);
    if (!selectedId && r[0]) setSelectedId(r[0].id);
  }

  useEffect(() => { refresh(); }, [uid]);

  useEffect(() => {
    if (selected) setRuleJson(JSON.stringify(selected, null, 2));
  }, [selectedId]);

  async function createDefault() {
    setMsg(null);
    if (!uid) return setMsg("Sign in first.");
    const def: Omit<AutomationRule, "id"|"createdAt"|"updatedAt"> = {
      name: "Automation Rule",
      enabled: true,
      symbol: "EURUSD",
      timeframe: "1m",
      conditions: [{ kind: "PRICE_GT", value: 1.0 }],
      actions: [{ kind: "ALERT_ONLY", message: "Triggered" }],
      risk: { maxOrdersPerHour: 10, maxQtyPerOrder: 5, killSwitch: false },
    };
    const saved = await saveRule(uid, def);
    await refresh();
    setSelectedId(saved.id);
    setMsg("✅ Created rule.");
  }

  async function save() {
    setMsg(null);
    if (!uid) return setMsg("Sign in first.");
    const r = JSON.parse(ruleJson) as AutomationRule;
    const saved = await saveRule(uid, r);
    await refresh();
    setSelectedId(saved.id);
    setMsg("✅ Saved rule.");
  }

  async function runOnce() {
    setMsg(null);
    if (!uid) return setMsg("Sign in first.");
    if (!selected) return setMsg("Select a rule.");
    await evaluateAndExecute({
      uidUser: uid,
      rule: selected,
      lastPrice: Number(lastPrice),
      receipt: null, // you can wire proof receipts here later
    });
    setMsg("✅ Evaluated once. Check automation_events + automation_runs + broker traces.");
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <div className="text-lg font-semibold text-white">24) Automation Rules Engine + Audit Log + Safety Gates</div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black/60 p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white">Rules</div>
            <button onClick={createDefault}
              className="rounded-xl border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white hover:bg-white/15"
            >
              New
            </button>
          </div>

          <div className="mt-2 space-y-2">
            {rules.map(r => (
              <button key={r.id} onClick={() => setSelectedId(r.id)}
                className={`w-full rounded-xl border border-white/10 px-3 py-2 text-left text-sm ${
                  selectedId === r.id ? "bg-white/10 text-white" : "bg-black/70 text-white/70"
                }`}
              >
                {r.name}
                <div className="text-xs text-white/50">{r.symbol} · {r.timeframe} · {r.enabled ? "ON":"OFF"}</div>
              </button>
            ))}
            {!rules.length && <div className="text-sm text-white/60">No rules yet.</div>}
          </div>
        </div>

        <div className="md:col-span-2 rounded-xl border border-white/10 bg-black/60 p-3">
          <div className="text-sm font-semibold text-white">Rule JSON</div>
          <textarea value={ruleJson} onChange={(e)=>setRuleJson(e.target.value)}
            className="mt-2 h-64 w-full rounded-xl border border-white/10 bg-black/70 p-3 text-xs text-white/90 outline-none"
          />

          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-4">
            <div>
              <div className="text-xs text-white/60">Last Price</div>
              <input value={lastPrice} onChange={(e)=>setLastPrice(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none"
              />
            </div>

            <button onClick={save}
              className="mt-5 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15"
            >
              Save
            </button>

            <button onClick={runOnce}
              className="mt-5 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15"
            >
              Run Once
            </button>
          </div>

          {msg && <div className="mt-3 text-sm text-white/80">{msg}</div>}
        </div>
      </div>
    </div>
  );
}
