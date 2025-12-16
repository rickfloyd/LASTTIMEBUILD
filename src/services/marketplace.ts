import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

export async function upsertCreatorProfile(payload: any) {
  const fn = httpsCallable(functions, "upsertCreatorProfile");
  const res = await fn(payload);
  return res.data as any;
}

export async function upsertCourse(payload: any) {
  const fn = httpsCallable(functions, "upsertCourse");
  const res = await fn(payload);
  return res.data as any;
}

export async function createPurchase(courseId: string) {
  const fn = httpsCallable(functions, "createPurchase");
  const res = await fn({ courseId });
  return res.data as any;
}

/**
 * Report endpoint is HTTPS (not callable) on purpose.
 * This makes it easy to post reports even if user isn’t logged in.
 */
export async function submitReport(payload: any) {
  const r = await fetch("/submitReport", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`report_failed_${r.status}`);
  return r.json();
}
