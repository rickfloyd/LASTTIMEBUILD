import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { uid } from "../lib/uid";
import { sha256Hex, stableStringify } from "../lib/cryptoHash";

export type RegistryDef = {
  id: string;
  name: string;
  createdAt: number;
};

export type RegistryVersion = {
  id: string;          // version id
  indicatorId: string;
  createdAt: number;
  codeHash: string;    // hash of source or config
  notes: string;
  payload: any;        // store algo metadata or compiled descriptor
};

export async function createIndicatorDef(name: string) {
  const id = uid();
  const def: RegistryDef = { id, name, createdAt: Date.now() };
  await setDoc(doc(db, `public/indicator_registry/defs/${id}`), def, { merge: false });
  return def;
}

export async function publishVersion(indicatorId: string, payload: any, notes: string) {
  const codeHash = await sha256Hex(stableStringify(payload));
  const v: RegistryVersion = {
    id: uid(),
    indicatorId,
    createdAt: Date.now(),
    codeHash,
    notes,
    payload,
  };
  await setDoc(doc(db, `public/indicator_registry/versions/${v.id}`), v, { merge: false });
  return v;
}

export async function listDefs(): Promise<RegistryDef[]> {
  const snap = await getDocs(collection(db, `public/indicator_registry/defs`));
  return snap.docs.map(d => d.data() as RegistryDef).sort((a,b)=>b.createdAt-a.createdAt);
}

export async function listVersions(indicatorId: string): Promise<RegistryVersion[]> {
  const snap = await getDocs(collection(db, `public/indicator_registry/versions`));
  return snap.docs.map(d => d.data() as RegistryVersion).filter(v => v.indicatorId === indicatorId).sort((a,b)=>b.createdAt-a.createdAt);
}

export async function pinVersion(uidUser: string, indicatorId: string, versionId: string) {
  await setDoc(doc(db, `users/${uidUser}/private/indicator_pins/${indicatorId}`), {
    indicatorId, versionId, pinnedAt: Date.now()
  }, { merge: true });
}

export async function getPin(uidUser: string, indicatorId: string) {
  const s = await getDoc(doc(db, `users/${uidUser}/private/indicator_pins/${indicatorId}`));
  return s.exists() ? s.data() : null;
}
