import * as admin from "firebase-admin";
import { onCall } from "firebase-functions/v2/https";

const db = admin.firestore();

export const resolveSymbol = onCall(async (req) => {
  const { input } = req.data;
  if (!input) throw new Error("No symbol input");

  const snap = await db
    .collection("symbols")
    .where("aliases", "array-contains", input)
    .limit(1)
    .get();

  if (snap.empty) return { found: false };

  return { found: true, symbol: snap.docs[0].data() };
});
