import * as admin from "firebase-admin";
import { onCall } from "firebase-functions/v2/https";

const db = admin.firestore();

/**
 * Admin-only: add or update a merchant
 */
export const upsertCryptoMerchant = onCall(async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new Error("auth");

  const user = await admin.auth().getUser(uid);
  if (!user.customClaims?.admin) throw new Error("admin_only");

  const {
    merchantId,
    name,
    website,
    category,
    countries,
    coins,
    acceptanceType, // direct | giftcard | processor
    processor,      // BitPay | CoinbaseCommerce | NOWPayments | etc
    verifiedSource, // URL where verified
    notes
  } = req.data;

  const id = merchantId || db.collection("crypto_merchants").doc().id;

  await db.doc(`crypto_merchants/${id}`).set({
    id,
    name,
    website,
    category,
    countries,
    coins,
    acceptanceType,
    processor,
    verifiedSource,
    notes: notes || "",
    active: true,
    updatedAt: Date.now(),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  return { ok: true, merchantId: id };
});

/**
 * Public: report a merchant as scam / outdated
 */
export const reportCryptoMerchant = onCall(async (req) => {
  const uid = req.auth?.uid || "anonymous";
  const { merchantId, reason, details } = req.data;
  if (!merchantId) throw new Error("merchantId_required");

  await db.collection(`crypto_merchants/${merchantId}/reports`).add({
    by: uid,
    reason,
    details: details || "",
    at: Date.now(),
    status: "OPEN",
  });

  return { ok: true };
});
