import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { uid } from "../lib/uid";
import { ScanRule, ScanInputRow } from "../lib/scanner";

export type ScanDef = {
  id: string;
  name: string;
  rules: ScanRule[];
  createdAt: number;
  updatedAt: number;
};

export type ScanRun = {
  scanId: string;
  at: number;
  matched: any[];
  total: number;
};

export async function saveScan(uidUser: string, def: Omit<ScanDef, "id"|"createdAt"|"updatedAt"> & { id?: string }) {
  const id = def.id ?? uid();
  const now = Date.now();
  const out: ScanDef = {
    id,
    name: def.name,
    rules: def.rules,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(doc(db, `users/${uidUser}/private/scans/${id}`), out, { merge: true });
  return out;
}

export async function saveScanRun(uidUser: string, run: ScanRun) {
  await setDoc(doc(db, `users/${uidUser}/private/scan_results/${run.scanId}`), run, { merge: true });
}

export async function loadScanRun(uidUser: string, scanId: string) {
  const s = await getDoc(doc(db, `users/${uidUser}/private/scan_results/${scanId}`));
  return s.exists() ? s.data() : null;
}

export function parseRows(json: string): ScanInputRow[] {
  const arr = JSON.parse(json);
  if (!Array.isArray(arr)) throw new Error("Rows must be array of {symbol,price,changePct}");
  return arr.map((x:any)=>({ symbol: String(x.symbol), price: Number(x.price), changePct: Number(x.changePct) }));
}
