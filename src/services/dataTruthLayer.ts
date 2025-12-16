import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Snapshot, MismatchReport, DataSourceId } from "../types/marketData";
import { buildMismatchReport } from "../lib/mismatchDetector";

function path(uid: string, symbol: string, timeframe: string, source: DataSourceId) {
  return `users/${uid}/private/dataSnapshots/${symbol}__${timeframe}__${source}`;
}

export async function saveSnapshot(uid: string, snap: Snapshot) {
  const ref = doc(db, path(uid, snap.symbol, snap.timeframe, snap.source));
  await setDoc(ref, snap, { merge: true });
}

export async function loadSnapshot(uid: string, symbol: string, timeframe: string, source: DataSourceId) {
  const ref = doc(db, path(uid, symbol, timeframe, source));
  const s = await getDoc(ref);
  return s.exists() ? (s.data() as Snapshot) : null;
}

export async function compareSources(uid: string, symbol: string, timeframe: string, a: DataSourceId, b: DataSourceId) {
  const sa = await loadSnapshot(uid, symbol, timeframe, a);
  const sb = await loadSnapshot(uid, symbol, timeframe, b);
  if (!sa || !sb) return null;

  const report: MismatchReport = buildMismatchReport({
    symbol,
    timeframe,
    sourceA: a,
    sourceB: b,
    candlesA: sa.candles,
    candlesB: sb.candles,
    tolerancePct: 0.02,
  });

  const reportRef = doc(db, `users/${uid}/private/dataMismatchReports/${symbol}__${timeframe}__${a}__${b}`);
  await setDoc(reportRef, report, { merge: true });
  return report;
}
