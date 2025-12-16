import * as admin from "firebase-admin";
import { onCall } from "firebase-functions/v2/https";

const db = admin.firestore();

export const adminUpsertCryptoSource = onCall(async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new Error("auth");

  const me = await admin.auth().getUser(uid);
  if (!me.customClaims?.admin) throw new Error("admin_only");

  const { sourceId, kind, url, enabled } = req.data;
  if (!kind || !url) throw new Error("kind_url_required");

  const id = sourceId || db.collection("admin").doc("crypto_sources").collection("items").doc().id;
  await db.collection("admin").doc("crypto_sources").collection("items").doc(id).set({
    id,
    kind: String(kind),
    url: String(url),
    enabled: Boolean(enabled),
    updatedAt: Date.now(),
  }, { merge: true });

  return { ok: true, sourceId: id };
});
