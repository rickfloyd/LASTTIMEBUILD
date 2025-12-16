import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { sha256Hex, stableStringify } from "../lib/cryptoHash";
import { uid } from "../lib/uid";
import { IndicatorReceipt, IndicatorRunInput } from "../types/indicators";
import { smaCrossSignals } from "../lib/indicatorNonRepaint";

export async function runAndStoreSmaCrossReceipt(uidUser: string, input: IndicatorRunInput) {
  const datasetHash = await sha256Hex(stableStringify(input.candles));
  const settingsHash = await sha256Hex(stableStringify(input.settings));

  const indicatorId = "SMA_CROSS";
  const indicatorVersion = await sha256Hex(stableStringify({
    algo: "smaCrossSignals",
    v: 1,
  }));

  const signals = smaCrossSignals({
    candles: input.candles,
    fast: Number(input.settings.fast ?? 10),
    slow: Number(input.settings.slow ?? 30),
    proofMode: input.proofMode,
  });

  const receipt: IndicatorReceipt = {
    id: uid(),
    symbol: input.symbol,
    timeframe: input.timeframe,
    indicatorId,
    indicatorVersion,
    datasetHash,
    settingsHash,
    generatedAt: Date.now(),
    proofMode: input.proofMode,
    signals,
  };

  await setDoc(doc(db, `users/${uidUser}/private/indicator_receipts/${receipt.id}`), receipt, { merge: false });
  return receipt;
}

export async function loadReceipt(uidUser: string, receiptId: string) {
  const snap = await getDoc(doc(db, `users/${uidUser}/private/indicator_receipts/${receiptId}`));
  return snap.exists() ? (snap.data() as IndicatorReceipt) : null;
}
