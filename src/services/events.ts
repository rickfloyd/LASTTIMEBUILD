import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export function subscribeEvents(symbol: string, cb: (e: any[]) => void) {
  const q = query(
    collection(db, "events"),
    where("markets", "array-contains", symbol)
  );

  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => d.data()));
  });
}
