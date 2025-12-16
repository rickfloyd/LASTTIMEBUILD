import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { uid } from "../lib/uid";

export type TelemetrySample = {
  id: string;
  at: number;
  kind: "FETCH_PING" | "UI_TICK";
  valueMs: number;
  meta?: any;
};

export async function writeTelemetry(uidUser: string, sample: Omit<TelemetrySample, "id" | "at"> & { at?: number }) {
  const s: TelemetrySample = {
    id: uid(),
    at: sample.at ?? Date.now(),
    kind: sample.kind,
    valueMs: sample.valueMs,
    meta: sample.meta ?? null,
  };
  await setDoc(doc(collection(db, `users/${uidUser}/private/telemetry`)), s, { merge: false });
  return s;
}
