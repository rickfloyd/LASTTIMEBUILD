import { collection, onSnapshot, query, where } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../firebase";

export function subscribeCryptoMerchants(cb:(rows:any[])=>void) {
  const q = query(
    collection(db, "crypto_merchants"),
    where("active", "==", true)
  );
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => d.data()));
  });
}

export async function reportMerchant(merchantId:string, reason:string, details:string){
  const fn = httpsCallable(functions, "reportCryptoMerchant");
  return fn({ merchantId, reason, details });
}
