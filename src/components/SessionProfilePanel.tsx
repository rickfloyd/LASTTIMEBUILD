import React, { useMemo, useState } from "react";
import { SESSION_PROFILES, getProfile } from "../lib/sessions";

export default function SessionProfilePanel() {
  const [profileId, setProfileId] = useState("FX_24x5");

  const p = useMemo(() => getProfile(profileId), [profileId]);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <div className="text-lg font-semibold text-white">12) Session Normalization Layer</div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div>
          <div className="text-xs text-white/60">Session Profile</div>
          <select value={profileId} onChange={(e)=>setProfileId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none"
          >
            {SESSION_PROFILES.map(s => <option key={s.id} value={s.id}>{s.displayName}</option>)}
          </select>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/60 p-3">
          <div className="text-xs text-white/60">Timezone</div>
          <div className="text-sm text-white">{p.timezone}</div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/60 p-3">
          <div className="text-xs text-white/60">UTC Hours</div>
          <div className="text-sm text-white">{p.openHourUTC}:00 → {p.closeHourUTC}:00</div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/80">
        {p.notes}
        <div className="mt-2 text-xs text-white/60">
          This module standardizes your app’s “market hours view” so candle differences become explainable (profile mismatch is visible).
        </div>
      </div>
    </div>
  );
}
