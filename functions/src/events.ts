import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";

const db = admin.firestore();

export const ingestEvent = onRequest(async (req, res) => {
  const { id, title, ts, impact, markets } = req.body;
  if (!id || !ts) return res.status(400).send("Invalid");

  await db.doc(`events/${id}`).set({
    title,
    ts,
    impact,
    markets,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  res.send({ ok: true });
});
