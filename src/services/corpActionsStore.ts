import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { CorpActions } from "../types/corpActions";

export async function loadCorpActions(uid: string, symbol: string) {
  const s = await getDoc(doc(db, `users/${uid}/private/corp_actions/${symbol}`));
  return s.exists() ? (s.data() as CorpActions) : null;
}

export async function saveCorpActions(uid: string, actions: CorpActions) {
  await setDoc(doc(db, `users/${uid}/private/corp_actions/${actions.symbol}`), actions, { merge: true });
}
