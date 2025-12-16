import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function ensureUserDoc(uid: string) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return;

  await setDoc(ref, {
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
