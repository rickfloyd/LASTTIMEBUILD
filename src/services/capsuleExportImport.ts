import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

async function readCollection(path: string) {
  const snap = await getDocs(collection(db, path));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function exportCapsule(uidUser: string) {
  const [
    layouts,
    drawings,
    scans,
    scanResults,
    indicatorPins,
    receipts,
    telemetry,
    orders,
  ] = await Promise.all([
    readCollection(`users/${uidUser}/private/layouts`),
    readCollection(`users/${uidUser}/private/drawings`),
    readCollection(`users/${uidUser}/private/scans`),
    readCollection(`users/${uidUser}/private/scan_results`),
    readCollection(`users/${uidUser}/private/indicator_pins`),
    readCollection(`users/${uidUser}/private/indicator_receipts`),
    readCollection(`users/${uidUser}/private/telemetry`),
    readCollection(`users/${uidUser}/private/orders`),
  ]);

  return {
    exportedAt: Date.now(),
    uid: uidUser,
    version: 1,
    data: { layouts, drawings, scans, scanResults, indicatorPins, receipts, telemetry, orders },
  };
}

export async function importCapsule(uidUser: string, capsule: any) {
  const data = capsule?.data;
  if (!data) throw new Error("Invalid capsule");

  const writeMany = async (basePath: string, items: any[]) => {
    for (const it of items || []) {
      if (!it?.id) continue;
      await setDoc(doc(db, `${basePath}/${it.id}`), it, { merge: true });
    }
  };

  await writeMany(`users/${uidUser}/private/layouts`, data.layouts);
  await writeMany(`users/${uidUser}/private/drawings`, data.drawings);
  await writeMany(`users/${uidUser}/private/scans`, data.scans);
  await writeMany(`users/${uidUser}/private/scan_results`, data.scanResults);
  await writeMany(`users/${uidUser}/private/indicator_pins`, data.indicatorPins);
  await writeMany(`users/${uidUser}/private/indicator_receipts`, data.receipts);
  await writeMany(`users/${uidUser}/private/telemetry`, data.telemetry);
  await writeMany(`users/${uidUser}/private/orders`, data.orders);

  // IMPORTANT: do NOT import entitlements here (admin-only in your rules).
  return { ok: true };
}
