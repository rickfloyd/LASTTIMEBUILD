import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { uid } from "../lib/uid";
import { JournalEntry, JournalTrade, JournalStatsSummary } from "../types/journal";

export async function addJournalEntry(uidUser: string, entry: Omit<JournalEntry, "id"|"at"> & { at?: number }) {
  const out: JournalEntry = {
    ...entry,
    id: uid(),
    at: entry.at ?? Date.now(),
  };
  await setDoc(doc(db, `users/${uidUser}/private/journal_entries/${out.id}`), out, { merge: false });
  return out;
}

export async function addJournalTrade(uidUser: string, trade: Omit<JournalTrade, "id"|"at"|"pnl"> & { at?: number }) {
  const pnl = (trade.exit - trade.entry) * trade.qty * (trade.side === "LONG" ? 1 : -1);
  const out: JournalTrade = {
    ...trade,
    id: uid(),
    at: trade.at ?? Date.now(),
    pnl,
  };
  await setDoc(doc(db, `users/${uidUser}/private/journal_trades/${out.id}`), out, { merge: false });
  return out;
}

export async function recomputeStats(uidUser: string) {
  const snap = await getDocs(collection(db, `users/${uidUser}/private/journal_trades`));
  const trades = snap.docs.map(d => d.data() as JournalTrade);

  const total = trades.length;
  const wins = trades.filter(t => t.pnl > 0).length;
  const losses = trades.filter(t => t.pnl <= 0).length;
  const netPnl = trades.reduce((s, t) => s + t.pnl, 0);
  const avgPnl = total ? netPnl / total : 0;
  const winRate = total ? wins / total : 0;

  const summary: JournalStatsSummary = {
    updatedAt: Date.now(),
    trades: total,
    wins,
    losses,
    winRate,
    netPnl,
    avgPnl,
  };

  await setDoc(doc(db, `users/${uidUser}/private/journal_stats/summary`), summary, { merge: true });
  return summary;
}

export async function loadStats(uidUser: string) {
  const s = await getDoc(doc(db, `users/${uidUser}/private/journal_stats/summary`));
  return s.exists() ? (s.data() as JournalStatsSummary) : null;
}
