import React, { useMemo } from "react";
import { useEntitlements } from "../context/EntitlementsContext";

function fmtLimit(n: number) {
  if (n === -1) return "Unlimited";
  return String(n);
}

function tsToDate(ts: any): Date | null {
  if (!ts) return null;
  // Firestore Timestamp has .toDate()
  if (typeof ts?.toDate === "function") return ts.toDate();
  return null;
}

function daysUntil(d: Date | null) {
  if (!d) return null;
  const ms = d.getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export default function WhatYouOwnPanel() {
  const { loading, uid, entitlements } = useEntitlements();

  const computed = useMemo(() => {
    const expiresAt = tsToDate(entitlements?.expiresAt);
    const graceEndsAt = tsToDate(entitlements?.graceEndsAt);
    const renewsAt = tsToDate(entitlements?.renewsAt);

    const expiresIn = daysUntil(expiresAt);
    const graceIn = daysUntil(graceEndsAt);
    const renewsIn = daysUntil(renewsAt);

    const warn =
      (expiresIn !== null && expiresIn <= 7) ||
      (graceIn !== null && graceIn <= 3);

    return { expiresAt, graceEndsAt, renewsAt, expiresIn, graceIn, renewsIn, warn };
  }, [entitlements]);

  if (!uid) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
        <div className="text-lg font-semibold text-white">What You Own</div>
        <div className="mt-2 text-sm text-white/70">Sign in to view your enabled capabilities.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
        <div className="text-lg font-semibold text-white">What You Own</div>
        <div className="mt-2 text-sm text-white/70">Loading…</div>
      </div>
    );
  }

  if (!entitlements) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
        <div className="text-lg font-semibold text-white">What You Own</div>
        <div className="mt-2 text-sm text-white/70">
          No entitlements record found. (If this is a new account, create `users/{uid}` doc once.)
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-white">What You Own</div>
          <div className="mt-1 text-sm text-white/70">
            Plan: <span className="text-white">{entitlements.plan}</span>{" "}
            • Status: <span className="text-white">{entitlements.status}</span>{" "}
            • Auto-Renew: <span className="text-white">{entitlements.autoRenew ? "On" : "Off"}</span>
          </div>
        </div>

        {computed.warn && (
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80">
            {computed.expiresIn !== null && computed.expiresIn <= 7 && (
              <div>⚠ Expires in {computed.expiresIn} day(s)</div>
            )}
            {computed.graceIn !== null && computed.graceIn <= 3 && (
              <div>⚠ Grace ends in {computed.graceIn} day(s)</div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <CapabilityRow label="Alerts" value={fmtLimit(entitlements.alertsMax)} />
        <CapabilityRow label="Layouts" value={fmtLimit(entitlements.layoutsMax)} />
        <CapabilityRow label="Indicators" value={fmtLimit(entitlements.indicatorsMax)} />
        <CapabilityRow
          label="Historical Depth"
          value={entitlements.historicalDepthDays === -1 ? "Unlimited" : `${entitlements.historicalDepthDays} days`}
        />
        <CapabilityRow label="AI Insights" value={entitlements.aiInsights ? "Enabled" : "Off"} />
        <CapabilityRow label="Cloud Backtesting" value={entitlements.backtestingCloud ? "Enabled" : "Off"} />
        <CapabilityRow label="Priority Support" value={entitlements.prioritySupport ? "Enabled" : "Off"} />
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3">
        <div className="text-xs text-white/60">Renew / Expire Transparency</div>
        <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-white/80 md:grid-cols-3">
          <div>
            <div className="text-white/60 text-xs">Renews At</div>
            <div className="text-white">{computed.renewsAt ? computed.renewsAt.toLocaleString() : "None"}</div>
          </div>
          <div>
            <div className="text-white/60 text-xs">Expires At</div>
            <div className="text-white">{computed.expiresAt ? computed.expiresAt.toLocaleString() : "Never"}</div>
          </div>
          <div>
            <div className="text-white/60 text-xs">Grace Ends</div>
            <div className="text-white">{computed.graceEndsAt ? computed.graceEndsAt.toLocaleString() : "None"}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-white/50">
        Last change: {entitlements.changeNote} • Updated by {entitlements.updatedBy}
      </div>
    </div>
  );
}

function CapabilityRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-base font-semibold text-white">{value}</div>
    </div>
  );
}
