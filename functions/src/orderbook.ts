import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";

const db = admin.firestore();

/**
 * Receives normalized L2 snapshots or deltas from ingest workers
 */
export const ingestOrderBook = onRequest(async (req, res) => {
  const { symbol, type, data, ts } = req.body;
  if (!symbol || !type || !data) {
    res.status(400).send("Invalid payload");
    return;
  }

  const ref =
    type === "snapshot"
      ? db.collection(`orderbooks/${symbol}/snapshots`)
      : db.collection(`orderbooks/${symbol}/deltas`);

  await ref.doc(String(ts)).set({
    symbol,
    ts,
    data,
    receivedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  res.send({ ok: true });
});
