import { collection, doc, getDoc, getDocs, query, orderBy, limit, setDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { uid } from "../lib/uid";
import { AutomationEvent, AutomationRule, AutomationRun } from "../types/automation";

export async function saveRule(uidUser: string, rule: Omit<AutomationRule, "id"|"createdAt"|"updatedAt"> & { id?: string }) {
  const id = rule.id ?? uid();
  const now = Date.now();
  const out: AutomationRule = {
    ...rule,
    id,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(doc(db, `users/${uidUser}/private/automation_rules/${id}`), out, { merge: true });
  return out;
}

export async function listRules(uidUser: string): Promise<AutomationRule[]> {
  const snap = await getDocs(collection(db, `users/${uidUser}/private/automation_rules`));
  return snap.docs.map(d => d.data() as AutomationRule).sort((a,b)=>b.updatedAt-a.updatedAt);
}

export async function writeAutomationEvent(uidUser: string, ev: Omit<AutomationEvent, "id"|"at"> & { at?: number }) {
  const out: AutomationEvent = {
    ...ev,
    id: uid(),
    at: ev.at ?? Date.now(),
  };
  await setDoc(doc(collection(db, `users/${uidUser}/private/automation_events`)), out, { merge: false });
  return out;
}

export async function writeAutomationRun(uidUser: string, run: Omit<AutomationRun, "id"|"at"> & { at?: number }) {
  const out: AutomationRun = {
    ...run,
    id: uid(),
    at: run.at ?? Date.now(),
  };
  await setDoc(doc(db, `users/${uidUser}/private/automation_runs/${out.id}`), out, { merge: false });
  return out;
}

export async function countRecentRuns(uidUser: string, ruleId: string, sinceMs: number) {
  // NOTE: Firestore doesn’t do COUNT cheaply without aggregation; we just fetch up to maxOrdersPerHour.
  const snap = await getDocs(
    query(
      collection(db, `users/${uidUser}/private/automation_runs`),
      where("ruleId", "==", ruleId),
      where("at", ">=", sinceMs),
      orderBy("at", "desc"),
      limit(200)
    )
  );
  return snap.size;
}

export async function loadRule(uidUser: string, ruleId: string) {
  const s = await getDoc(doc(db, `users/${uidUser}/private/automation_rules/${ruleId}`));
  return s.exists() ? (s.data() as AutomationRule) : null;
}
