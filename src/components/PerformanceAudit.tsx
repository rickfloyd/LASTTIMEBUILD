import { useEffect, useState } from "react";

export default function PerformanceAudit() {
  const [audit, setAudit] = useState<any>(null);
  useEffect(() => {
    fetch("/api/audit/daily")
      .then((r) => r.json())
      .then(setAudit);
  }, []);
  if (!audit) return <div className="text-gray-400">Loading audit...</div>;
  return (
    <div className="bg-black text-green-400 p-4 rounded-2xl">
      <h2 className="text-xl mb-2">Blockchain-Audited AI Performance</h2>
      <div>Date: {audit.audit.date}</div>
      <div>Win Rate: {audit.audit.win_rate}%</div>
      <div>Net PnL: {audit.audit.net_pnl}</div>
      <div className="mt-2 text-xs text-pink-400">Blockchain TX: <span className="break-all">{audit.tx_hash}</span></div>
    </div>
  );
}
