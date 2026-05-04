import type { Transaction, Category } from "./types";

export function isSameMonth(iso: string, ref: Date): boolean {
  const d = new Date(iso + "T00:00:00");
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

export function totalsForMonth(transactions: Transaction[], ref: Date) {
  let income = 0;
  let expenses = 0;
  for (const t of transactions) {
    if (!isSameMonth(t.date, ref)) continue;
    if (t.category === "Income") income += t.amount;
    else expenses += t.amount;
  }
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
  return { income, expenses, net: income - expenses, savingsRate };
}

export function totalBalance(transactions: Transaction[]): number {
  let bal = 0;
  for (const t of transactions) {
    bal += t.category === "Income" ? t.amount : -t.amount;
  }
  return bal;
}

export function categoryBreakdown(transactions: Transaction[], ref: Date) {
  const map = new Map<Category, number>();
  for (const t of transactions) {
    if (!isSameMonth(t.date, ref)) continue;
    if (t.category === "Income") continue;
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
  }
  const total = Array.from(map.values()).reduce((a, b) => a + b, 0);
  return Array.from(map.entries())
    .map(([category, value]) => ({
      category,
      value,
      percent: total > 0 ? (value / total) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

export type MonthlySeries = {
  key: string;
  label: string;
  income: number;
  expenses: number;
};

export function monthlySeries(transactions: Transaction[], months = 6): MonthlySeries[] {
  const out: MonthlySeries[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const ref = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(2, "0")}`;
    const label = ref.toLocaleDateString("en-US", { month: "short" });
    const t = totalsForMonth(transactions, ref);
    out.push({ key, label, income: t.income, expenses: t.expenses });
  }
  return out;
}

export function trendVsLastMonth(transactions: Transaction[], kind: "income" | "expenses") {
  const now = new Date();
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const cur = totalsForMonth(transactions, now)[kind];
  const last = totalsForMonth(transactions, prev)[kind];
  if (last === 0) return { delta: 0, pct: 0 };
  const pct = ((cur - last) / last) * 100;
  return { delta: cur - last, pct };
}
