import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

admin.initializeApp();

type Entitlements = {
  plan: "FREE" | "PRO" | "ELITE" | "FOUNDER";
  status: "ACTIVE" | "EXPIRED" | "CANCELED";
  autoRenew: boolean;

  // Core capabilities
  alertsMax: number;         // -1 = unlimited
  layoutsMax: number;        // -1 = unlimited
  indicatorsMax: number;     // -1 = unlimited
  historicalDepthDays: number; // -1 = unlimited

  // optional add-ons
  aiInsights: boolean;
  backtestingCloud: boolean;
  prioritySupport: boolean;

  // Billing-style timing (transparent, never hidden)
  startedAt: admin.firestore.Timestamp;
  renewsAt: admin.firestore.Timestamp | null; // null = never renews
  expiresAt: admin.firestore.Timestamp | null; // null = never expires
  graceEndsAt: admin.firestore.Timestamp | null;

  // Audit
  updatedAt: admin.firestore.Timestamp;
  updatedBy: string; // uid or "system"
  changeNote: string;
};

function nowTs() {
  return admin.firestore.Timestamp.now();
}

function defaultEntitlements(): Entitlements {
  const now = nowTs();
  return {
    plan: "FREE",
    status: "ACTIVE",
    autoRenew: false,

    alertsMax: 10,
    layoutsMax: 2,
    indicatorsMax: 10,
    historicalDepthDays: 365,

    aiInsights: false,
    backtestingCloud: false,
    prioritySupport: false,

    startedAt: now,
    renewsAt: null,
    expiresAt: null,
    graceEndsAt: null,

    updatedAt: now,
    updatedBy: "system",
    changeNote: "Default FREE entitlements created on signup.",
  };
}

/**
 * Auto-create entitlements on first user doc creation.
 * Create user docs at: users/{uid}
 */
export const onUserCreatedCreateEntitlements = onDocumentCreated(
  "users/{uid}",
  async (event) => {
    const uid = event.params.uid as string;

    const entRef = admin.firestore().doc(`users/${uid}/private/entitlements`);
    const snap = await entRef.get();

    if (!snap.exists) {
      await entRef.set(defaultEntitlements(), { merge: false });
    }
  }
);

/**
 * Admin-only: set entitlements for a user.
 * Security: requires custom claim { admin: true }.
 */
export const setUserEntitlements = onCall(async (request) => {
  const caller = request.auth;
  if (!caller) {
    throw new HttpsError("unauthenticated", "Must be signed in.");
  }

  const isAdmin = (caller.token as any)?.admin === true;
  if (!isAdmin) {
    throw new HttpsError("permission-denied", "Admin only.");
  }

  const { uid, patch, changeNote } = request.data as {
    uid: string;
    patch: Partial<Entitlements>;
    changeNote?: string;
  };

  if (!uid || typeof uid !== "string") {
    throw new HttpsError("invalid-argument", "uid is required.");
  }
  if (!patch || typeof patch !== "object") {
    throw new HttpsError("invalid-argument", "patch object is required.");
  }

  const entRef = admin.firestore().doc(`users/${uid}/private/entitlements`);
  const existing = await entRef.get();

  const base = (existing.exists ? (existing.data() as Entitlements) : defaultEntitlements());

  const updated: Entitlements = {
    ...base,
    ...patch,
    updatedAt: nowTs(),
    updatedBy: caller.uid,
    changeNote: changeNote?.toString().slice(0, 500) || "Admin updated entitlements.",
  };

  await entRef.set(updated, { merge: false });

  // write an immutable audit log entry too
  const auditRef = admin.firestore().collection(`users/${uid}/private/entitlements_audit`).doc();
  await auditRef.set({
    at: updated.updatedAt,
    by: updated.updatedBy,
    note: updated.changeNote,
    before: base,
    after: updated,
  });

  return { ok: true };
});

export { upsertCreatorProfile, upsertCourse, createPurchase, submitReport, adminBanUser } from "./marketplace";
export { upsertCryptoMerchant, reportCryptoMerchant } from "./cryptoDirectory";
