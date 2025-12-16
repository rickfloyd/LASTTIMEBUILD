THANKimport React, { useState } from "react";
import { useEntitlements } from "../context/EntitlementsContext";
import { exportCapsule, importCapsule } from "../services/capsuleExportImport";

export default function CapsuleExportImportPanel() {
  const { uid } = useEntitlements();
  const [capsuleJson, setCapsuleJson] = useState("");
  const [msg, setMsg] = useState<string|null>(null);

  async function doExport() {
    setMsg(null);
    if (!uid) return setMsg("Sign in first.");
    const cap = await exportCapsule(uid);
    setCapsuleJson(JSON.stringify(cap, null, 2));
    setMsg("✅ Exported all user state to JSON capsule (can be re-imported).");
  }

  async function doImport() {
    setMsg(null);
    if (!uid) return setMsg("Sign in first.");
    try {
      const cap = JSON.parse(capsuleJson);
      await importCapsule(uid, cap);
      setMsg("✅ Imported capsule. Refresh to see changes.");
    } catch (e:any) {
      setMsg(`Import failed: ${e?.message || "Unknown error"}`);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <div className="text-lg font-semibold text-white">20) State Capsule (Export/Import)</div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <button onClick={doExport} className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15">
          Export My State
        </button>
        <button onClick={doImport} className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15">
          Import to My State
        </button>
      </div>

      <textarea value={capsuleJson} onChange={(e)=>setCapsuleJson(e.target.value)}
        className="mt-3 h-48 w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white/90 outline-none"
      />

      {msg && <div className="mt-3 text-sm text-white/80">{msg}</div>}
    </div>
  );
}
