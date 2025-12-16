import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";

export function subscribeOrderBook(symbol: string, cb: (rows: any[]) => void) {
  const q = query(
    collection(db, `orderbooks/${symbol}/snapshots`),
    orderBy("ts", "desc"),
    limit(1)
  );

  return onSnapshot(q, (snap) => {
    const rows = snap.docs.map(d => d.data());
    cb(rows);
  });
}
