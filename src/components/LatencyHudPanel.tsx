import React from "react";
import { useEntitlements } from "../context/EntitlementsContext";
import { useLatencyHud } from "../hooks/useLatencyHud";

export default function LatencyHudPanel() {
  const { uid } = useEntitlements();
  const { fetchPing, uiLag } = useLatencyHud(uid, "/");

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <div className="text-lg font-semibold text-white">16) Health HUD (Latency + UI Thread)</div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <Stat title="Fetch Ping (ms)" value={fetchPing == null ? "—" : String(fetchPing)} />
        <Stat title="UI Thread Lag (ms)" value={uiLag == null ? "—" : String(uiLag)} />
      </div>

      <div className="mt-3 text-xs text-white/60">
        Samples are written to Firestore telemetry so “was it me or the platform?” becomes provable.
      </div>
    </div>
  );
}

function Stat(props:{title:string; value:string}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/60 p-4">
      <div className="text-xs text-white/60">{props.title}</div>
      <div className="mt-1 text-2xl font-semibold text-white">{props.value}</div>
    </div>
  );
}
