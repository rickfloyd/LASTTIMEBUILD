import React, { useEffect, useState } from "react";
import { useEntitlements } from "../context/EntitlementsContext";
import { createIndicatorDef, listDefs, listVersions, pinVersion, publishVersion } from "../services/indicatorRegistry";

export default function IndicatorRegistryPanel() {
  const { uid } = useEntitlements();
  const [defs, setDefs] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [versions, setVersions] = useState<any[]>([]);
  const [newName, setNewName] = useState("My Indicator");
  const [notes, setNotes] = useState("Initial version");
  const [payload, setPayload] = useState(`{"algo":"SMA_CROSS","fast":10,"slow":30}`);
  const [msg, setMsg] = useState<string|null>(null);

  async function refreshDefs() {
    const d = await listDefs();
    setDefs(d);
    if (!selected && d[0]) setSelected(d[0].id);
  }

  async function refreshVersions(id: string) {
    const v = await listVersions(id);
    setVersions(v);
  }

  useEffect(() => { refreshDefs(); }, []);
  useEffect(() => { if (selected) refreshVersions(selected); }, [selected]);

  async function createDef() {
    setMsg(null);
    const d = await createIndicatorDef(newName.trim() || "Indicator");
    await refreshDefs();
    setSelected(d.id);
    setMsg("✅ Indicator definition created.");
  }

  async function publish() {
    setMsg(null);
    if (!selected) return setMsg("Select an indicator.");
    const pl = JSON.parse(payload);
    const v = await publishVersion(selected, pl, notes);
    await refreshVersions(selected);
    setMsg(`✅ Published version ${v.id}.`);
  }

  async function pin(vId: string) {
    setMsg(null);
    if (!uid) return setMsg("Sign in first to pin.");
    await pinVersion(uid, selected, vId);
    setMsg("✅ Pinned version for your account.");
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <div className="text-lg font-semibold text-white">17) Indicator Registry + Versioning + Pin</div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black/60 p-3">
          <div className="text-sm font-semibold text-white">Definitions</div>
          <div className="mt-2 flex gap-2">
            <input value={newName} onChange={(e)=>setNewName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none"
            />
            <button onClick={createDef} className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15">
              Create
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {defs.map(d => (
              <button key={d.id} onClick={()=>setSelected(d.id)}
                className={`w-full rounded-xl border border-white/10 px-3 py-2 text-left text-sm ${selected===d.id?"bg-white/10 text-white":"bg-black/60 text-white/70"}`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 rounded-xl border border-white/10 bg-black/60 p-3">
          <div className="text-sm font-semibold text-white">Publish Version</div>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            <input value={notes} onChange={(e)=>setNotes(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none"
            />
            <button onClick={publish} className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15">
              Publish
            </button>
          </div>

          <div className="mt-2 text-xs text-white/60">Payload JSON</div>
          <textarea value={payload} onChange={(e)=>setPayload(e.target.value)}
            className="mt-1 h-28 w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white/90 outline-none"
          />

          <div className="mt-3 text-sm font-semibold text-white">Versions</div>
          <div className="mt-2 space-y-2">
            {versions.map(v => (
              <div key={v.id} className="rounded-xl border border-white/10 bg-black/70 p-3">
                <div className="text-sm text-white">vID: {v.id}</div>
                <div className="text-xs text-white/60">Hash: {v.codeHash}</div>
                <div className="text-xs text-white/70">Notes: {v.notes}</div>
                <button onClick={()=>pin(v.id)}
                  className="mt-2 rounded-xl border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white hover:bg-white/15"
                >
                  Pin this version
                </button>
              </div>
            ))}
            {!versions.length && <div className="text-sm text-white/60">No versions yet.</div>}
          </div>
        </div>
      </div>

      {msg && <div className="mt-3 text-sm text-white/80">{msg}</div>}
    </div>
  );
}
