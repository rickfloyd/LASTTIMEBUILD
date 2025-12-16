import React, { useEffect, useState } from "react";
import { useEntitlements } from "../context/EntitlementsContext";
import { loadRiskProfile, saveRiskCalc, saveRiskProfile } from "../services/riskStore";
import { RiskProfile } from "../types/risk";
import { computePositionSize } from "../lib/riskSizing";

export default function RiskSizingPanel() {
  const { uid } = useEntitlements();

  const [profile, setProfile] = useState<RiskProfile | null>(null);
  const [profileJson, setProfileJson] = useState<string>("");

  const [symbol, setSymbol] = useState("EURUSD");
  const [entry, setEntry] = useState("1.0000");
  const [stop, setStop] = useState("0.9950");
  const [pipValuePerUnit, setPipValuePerUnit] = useState("1");

  const [msg, setMsg] = useState<string|null>(null);
  const [out, setOut] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (!uid) return;
      const p = await loadRiskProfile(uid);
      setProfile(p);
      setProfileJson(JSON.stringify(p, null, 2));
    })();
  }, [uid]);

  async function saveProfile() {
    setMsg(null);
    if (!uid) return setMsg("Sign in first.");
    const p = JSON.parse(profileJson) as RiskProfile;
    await saveRiskProfile(uid, p);
    setProfile(p);
    setMsg("✅ Saved risk profile.");
  }

  async function calc() {
    setMsg(null); setOut(null);
    if (!uid) return setMsg("Sign in first.");
    if (!profile) return setMsg("No profile loaded.");
    try {
      const p = JSON.parse(profileJson) as RiskProfile;
      const r = computePositionSize(p, {
        symbol,
        entry: Number(entry),
        stop: Number(stop),
        pipValuePerUnit: Number(pipValuePerUnit),
      });
      await saveRiskCalc(uid, r);
      setOut(r);
      setMsg("✅ Saved risk calc (position size).");
    } catch (e: any) {
      setMsg(e?.message || "Calc failed");
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <div className="text-lg font-semibold text-white">25) Risk & Position Sizing Console</div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <div className="text-xs text-white/60">Risk Profile JSON</div>
          <textarea value={profileJson} onChange={(e)=>setProfileJson(e.target.value)}
            className="mt-1 h-44 w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white/90 outline-none"
          />
          <button onClick={saveProfile}
            className="mt-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15"
          >
            Save Profile
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/60 p-3">
          <div className="text-sm font-semibold text-white">Sizer</div>

          <Field label="Symbol" value={symbol} onChange={setSymbol}/>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
            <Field label="Entry" value={entry} onChange={setEntry}/>
            <Field label="Stop" value={stop} onChange={setStop}/>
            <Field label="PipValue/Unit" value={pipValuePerUnit} onChange={setPipValuePerUnit}/>
          </div>

          <button onClick={calc}
            className="mt-3 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15"
          >
            Calculate + Save
          </button>

          {msg && <div className="mt-3 text-sm text-white/80">{msg}</div>}
          {out && (
            <pre className="mt-3 max-h-56 overflow-auto rounded-xl border border-white/10 bg-black/70 p-3 text-xs text-white/80">
{JSON.stringify(out, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

function Field(props:{label:string; value:string; onChange:(v:string)=>void}) {
  return (
    <div className="mt-2">
      <div className="text-xs text-white/60">{props.label}</div>
      <input value={props.value} onChange={(e)=>props.onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none"
      />
    </div>
  );
}
