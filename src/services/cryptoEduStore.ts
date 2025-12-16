import { collection, doc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { EduProgress } from "../types/cryptoEdu";

export function subscribeCryptoLessons(cb:(rows:any[])=>void) {
  const q = query(collection(db, "edu_crypto_lessons"), where("active","==",true));
  return onSnapshot(q, snap => cb(snap.docs.map(d=>d.data())));
}

export function subscribeCryptoQuizzes(cb:(rows:any[])=>void) {
  const q = query(collection(db, "edu_crypto_quizzes"), where("active","==",true));
  return onSnapshot(q, snap => cb(snap.docs.map(d=>d.data())));
}

export async function saveProgress(uid: string, p: EduProgress) {
  await setDoc(doc(db, `users/${uid}/private/edu_progress/${p.id}`), { ...p, updatedAt: Date.now() }, { merge: true });
}
