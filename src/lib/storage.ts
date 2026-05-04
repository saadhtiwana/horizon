import { useEffect, useState, useCallback } from "react";
import type { Transaction, Budget, Category } from "./types";
import { uid } from "./format";

const TX_KEY = "horizon.transactions.v2";
const BUDGET_KEY = "horizon.budgets.v2";

function todayISO(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function monthAgoISO(monthsAgo: number, day: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  d.setDate(Math.min(day, 28));
  return d.toISOString().slice(0, 10);
}

export const DEFAULT_TRANSACTIONS: Transaction[] = [
  // Current month
  { id: uid(), date: todayISO(-1), category: "Income", amount: 285000, note: "Salary — monthly payroll" },
  { id: uid(), date: todayISO(-2), category: "Housing", amount: 95000, note: "Rent — DHA Phase 6" },
  { id: uid(), date: todayISO(-3), category: "Food", amount: 4200, note: "Imtiaz groceries" },
  { id: uid(), date: todayISO(-4), category: "Transport", amount: 1800, note: "Careem to airport" },
  { id: uid(), date: todayISO(-5), category: "Utilities", amount: 18500, note: "K-Electric + PTCL fiber" },
  { id: uid(), date: todayISO(-6), category: "Entertainment", amount: 1500, note: "Netflix + Spotify" },
  { id: uid(), date: todayISO(-7), category: "Food", amount: 3800, note: "Dinner — Kolachi" },
  { id: uid(), date: todayISO(-9), category: "Shopping", amount: 12500, note: "Khaadi essentials" },
  { id: uid(), date: todayISO(-10), category: "Health", amount: 2400, note: "Pharmacy refill" },
  { id: uid(), date: todayISO(-12), category: "Savings", amount: 40000, note: "Meezan savings transfer" },
  { id: uid(), date: todayISO(-14), category: "Food", amount: 6200, note: "Carrefour groceries" },
  { id: uid(), date: todayISO(-16), category: "Transport", amount: 8500, note: "Petrol — Shell" },
  // Prior months
  { id: uid(), date: monthAgoISO(1, 2), category: "Income", amount: 285000, note: "Salary" },
  { id: uid(), date: monthAgoISO(1, 4), category: "Housing", amount: 95000, note: "Rent" },
  { id: uid(), date: monthAgoISO(1, 8), category: "Food", amount: 28400, note: "Groceries + dining" },
  { id: uid(), date: monthAgoISO(1, 10), category: "Transport", amount: 14200, note: "Petrol + ride-hail" },
  { id: uid(), date: monthAgoISO(1, 14), category: "Entertainment", amount: 6500, note: "Concert tickets" },
  { id: uid(), date: monthAgoISO(1, 18), category: "Utilities", amount: 17800, note: "Electric + Internet" },
  { id: uid(), date: monthAgoISO(1, 22), category: "Savings", amount: 50000, note: "Savings account" },
  { id: uid(), date: monthAgoISO(2, 2), category: "Income", amount: 285000, note: "Salary" },
  { id: uid(), date: monthAgoISO(2, 4), category: "Housing", amount: 95000, note: "Rent" },
  { id: uid(), date: monthAgoISO(2, 9), category: "Food", amount: 26200, note: "Groceries" },
  { id: uid(), date: monthAgoISO(2, 12), category: "Transport", amount: 11800, note: "Petrol" },
  { id: uid(), date: monthAgoISO(2, 16), category: "Shopping", amount: 18900, note: "Winter coat" },
  { id: uid(), date: monthAgoISO(2, 20), category: "Utilities", amount: 21500, note: "Heating + gas" },
  { id: uid(), date: monthAgoISO(3, 2), category: "Income", amount: 270000, note: "Salary" },
  { id: uid(), date: monthAgoISO(3, 4), category: "Housing", amount: 95000, note: "Rent" },
  { id: uid(), date: monthAgoISO(3, 11), category: "Food", amount: 32500, note: "Eid meals" },
  { id: uid(), date: monthAgoISO(3, 15), category: "Entertainment", amount: 8400, note: "Streaming + cinema" },
  { id: uid(), date: monthAgoISO(3, 19), category: "Shopping", amount: 24600, note: "Eid gifts" },
  { id: uid(), date: monthAgoISO(4, 2), category: "Income", amount: 270000, note: "Salary" },
  { id: uid(), date: monthAgoISO(4, 4), category: "Housing", amount: 95000, note: "Rent" },
  { id: uid(), date: monthAgoISO(4, 10), category: "Food", amount: 27800, note: "Groceries" },
  { id: uid(), date: monthAgoISO(4, 14), category: "Transport", amount: 13400, note: "Petrol + Careem" },
  { id: uid(), date: monthAgoISO(5, 2), category: "Income", amount: 270000, note: "Salary" },
  { id: uid(), date: monthAgoISO(5, 4), category: "Housing", amount: 95000, note: "Rent" },
  { id: uid(), date: monthAgoISO(5, 12), category: "Food", amount: 25600, note: "Groceries" },
  { id: uid(), date: monthAgoISO(5, 18), category: "Health", amount: 14500, note: "Annual checkup" },
];

export const DEFAULT_BUDGETS: Budget = {
  Housing: 100000,
  Food: 35000,
  Transport: 15000,
  Entertainment: 8000,
  Shopping: 20000,
  Health: 10000,
  Utilities: 22000,
  Savings: 50000,
  Other: 5000,
};

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const existing = window.localStorage.getItem(TX_KEY);
    if (existing) {
      setTransactions(readJSON<Transaction[]>(TX_KEY, []));
    } else {
      setTransactions(DEFAULT_TRANSACTIONS);
      writeJSON(TX_KEY, DEFAULT_TRANSACTIONS);
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: Transaction[]) => {
    setTransactions(next);
    writeJSON(TX_KEY, next);
  }, []);

  const add = useCallback(
    (tx: Omit<Transaction, "id">) => {
      const next = [{ ...tx, id: uid() }, ...transactions];
      persist(next);
    },
    [transactions, persist],
  );

  const addMany = useCallback(
    (txs: Omit<Transaction, "id">[]) => {
      const withIds = txs.map((t) => ({ ...t, id: uid() }));
      persist([...withIds, ...transactions]);
    },
    [transactions, persist],
  );

  const remove = useCallback(
    (id: string) => persist(transactions.filter((t) => t.id !== id)),
    [transactions, persist],
  );

  const reset = useCallback(() => persist(DEFAULT_TRANSACTIONS), [persist]);

  const clear = useCallback(() => persist([]), [persist]);

  return { transactions, add, addMany, remove, reset, clear, hydrated };
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const existing = window.localStorage.getItem(BUDGET_KEY);
    if (existing) {
      setBudgets(readJSON<Budget>(BUDGET_KEY, {}));
    } else {
      setBudgets(DEFAULT_BUDGETS);
      writeJSON(BUDGET_KEY, DEFAULT_BUDGETS);
    }
    setHydrated(true);
  }, []);

  const setBudget = useCallback(
    (category: Category, amount: number | null) => {
      setBudgets((prev) => {
        const next: Budget = { ...prev };
        if (amount === null || Number.isNaN(amount)) {
          delete next[category];
        } else {
          next[category] = amount;
        }
        writeJSON(BUDGET_KEY, next);
        return next;
      });
    },
    [],
  );

  return { budgets, setBudget, hydrated };
}
