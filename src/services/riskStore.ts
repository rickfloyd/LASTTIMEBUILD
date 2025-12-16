import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { RiskProfile, RiskCalcResult } from "../types/risk";

export async function loadRiskProfile(uid: string): Promise<RiskProfile> {
  const ref = doc(db, `users/${uid}/private/risk_profiles/profile`);
  const s = await getDoc(ref);
  if (!s.exists()) {
    const def: RiskProfile = {
      accountEquity: 10000,
      riskPercentPerTrade: 1,
      maxPortfolioRiskPercent: 5,
      updatedAt: Date.now(),
    };
    await setDoc(ref, def, { merge: true });
    return def;
  }
  return s.data() as RiskProfile;
}

export async function saveRiskProfile(uid: string, p: RiskProfile) {
  await setDoc(doc(db, `users/${uid}/private/risk_profiles/profile`), { ...p, updatedAt: Date.now() }, { merge: true });
}

export async function saveRiskCalc(uid: string, r: RiskCalcResult) {
  await setDoc(doc(collection(db, `users/${uid}/private/risk_calcs`)), r, { merge: false });
}
