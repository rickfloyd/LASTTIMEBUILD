export type ScanRule = 
  | { kind: "PRICE_GT"; value: number }
  | { kind: "PRICE_LT"; value: number }
  | { kind: "CHANGE_PCT_GT"; value: number };

export type ScanInputRow = {
  symbol: string;
  price: number;
  changePct: number;
};

export type ScanResultRow = ScanInputRow & { matched: boolean; reasons: string[] };

export function runScan(rows: ScanInputRow[], rules: ScanRule[]): ScanResultRow[] {
  return rows.map(r => {
    const reasons: string[] = [];
    for (const rule of rules) {
      if (rule.kind === "PRICE_GT" && r.price > rule.value) reasons.push(`price>${rule.value}`);
      if (rule.kind === "PRICE_LT" && r.price < rule.value) reasons.push(`price<${rule.value}`);
      if (rule.kind === "CHANGE_PCT_GT" && r.changePct > rule.value) reasons.push(`changePct>${rule.value}`);
    }
    return { ...r, matched: reasons.length === rules.length, reasons };
  });
}
