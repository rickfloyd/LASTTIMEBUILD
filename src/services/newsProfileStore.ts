import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { NewsProfile, NewsItem } from "../lib/newsFilter";

export async function loadNewsProfile(uid: string): Promise<NewsProfile> {
  const ref = doc(db, `users/${uid}/private/news_profile/profile`);
  const s = await getDoc(ref);
  if (!s.exists()) {
    const def: NewsProfile = { keywords: [], watchlist: [], sourceTrust: {} };
    await setDoc(ref, def, { merge: true });
    return def;
  }
  return s.data() as NewsProfile;
}

export async function saveNewsProfile(uid: string, p: NewsProfile) {
  await setDoc(doc(db, `users/${uid}/private/news_profile/profile`), p, { merge: true });
}

export async function saveNewsItems(uid: string, items: NewsItem[]) {
  for (const it of items) {
    await setDoc(doc(db, `users/${uid}/private/news_feed/${it.id}`), it, { merge: true });
  }
}
