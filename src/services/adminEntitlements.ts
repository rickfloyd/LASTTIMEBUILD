import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

export type EntitlementsPlan = "FREE" | "PRO" | "ELITE" | "FOUNDER";
export type EntitlementsStatus = "ACTIVE" | "EXPIRED" | "CANCELED";

export type EntitlementsPatch = {
  plan?: EntitlementsPlan;
  status?: EntitlementsStatus;
  autoRenew?: boolean;

  alertsMax?: number;           // -1 unlimited
  layoutsMax?: number;          // -1 unlimited
  indicatorsMax?: number;       // -1 unlimited
  historicalDepthDays?: number; // -1 unlimited

  aiInsights?: boolean;
  backtestingCloud?: boolean;
  prioritySupport?: boolean;

  // Optional billing timing fields (ISO strings accepted by UI; function stores raw patch as-is)
  // We keep UI simple: leave these blank unless you plan to set with server-side timestamps later.
};

export async function adminSetUserEntitlements(params: {
  uid: string;
  patch: EntitlementsPatch;
  changeNote: string;
}) {
  const fn = httpsCallable(functions, "setUserEntitlements");
  const res = await fn({
    uid: params.uid,
    patch: params.patch,
    changeNote: params.changeNote,
  });
  return res.data as { ok: boolean };
}
