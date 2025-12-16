import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export type Entitlements = {
  plan: "FREE" | "PRO" | "ELITE" | "FOUNDER";
  status: "ACTIVE" | "EXPIRED" | "CANCELED";
  autoRenew: boolean;

  alertsMax: number;
  layoutsMax: number;
  indicatorsMax: number;
  historicalDepthDays: number;

  aiInsights: boolean;
  backtestingCloud: boolean;
  prioritySupport: boolean;

  startedAt: any;
  renewsAt: any;
  expiresAt: any;
  graceEndsAt: any;

  updatedAt: any;
  updatedBy: string;
  changeNote: string;
};

export function subscribeEntitlements(
  uid: string,
  onData: (data: Entitlements | null) => void,
  onError?: (e: unknown) => void
) {
  const ref = doc(db, `users/${uid}/private/entitlements`);
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) return onData(null);
      onData(snap.data() as Entitlements);
    },
    (err) => {
      onError?.(err);
      onData(null);
    }
  );
}
