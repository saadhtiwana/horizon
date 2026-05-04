import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2, RotateCcw, X } from "lucide-react";

import { AppShell, PageBody, PageHeader } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { Button } from "@/components/ui-kit/Button";
import { TransactionForm } from "@/components/TransactionForm";
import { CsvImport } from "@/components/CsvImport";
import { useTransactions } from "@/lib/storage";
import { CATEGORIES, CATEGORY_COLORS, type Category } from "@/lib/types";
import { formatCurrency, formatDateShort } from "@/lib/format";

export const Route = createFileRoute("/transactions")({
  component: TransactionsPage,
});

type Filters = {
  category: Category | "All";
  from: string;
  to: string;
  min: string;
  max: string;
};

const EMPTY_FILTERS: Filters = {
  category: "All",
  from: "",
  to: "",
  min: "",
  max: "",
};

function TransactionsPage() {
  const { transactions, add, addMany, remove, reset, hydrated } = useTransactions();
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const filtered = useMemo(() => {
    const min = filters.min ? Number(filters.min) : null;
    const max = filters.max ? Number(filters.max) : null;
    return transactions
      .filter((t) => {
        if (filters.category !== "All" && t.category !== filters.category) return false;
        if (filters.from && t.date < filters.from) return false;
        if (filters.to && t.date > filters.to) return false;
        if (min !== null && t.amount < min) return false;
        if (max !== null && t.amount > max) return false;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, filters]);

  const totalShown = filtered.reduce(
    (acc, t) => acc + (t.category === "Income" ? t.amount : -t.amount),
    0,
  );

  const filtersActive =
    filters.category !== "All" ||
    filters.from !== "" ||
    filters.to !== "" ||
    filters.min !== "" ||
    filters.max !== "";

  const inputCls =
    "h-8 w-full rounded-md border border-border-strong bg-surface-2 px-2.5 text-[12px] text-foreground placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary tabular-nums-feat";

  return (
    <AppShell>
      <PageHeader
        title="Transactions"
        description="All recorded income and expenses."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setShowImport((s) => !s);
                if (!showImport) setShowForm(false);
              }}
            >
              Import CSV
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowForm((s) => !s);
                if (!showForm) setShowImport(false);
              }}
            >
              <Plus size={14} />
              Add transaction
            </Button>
          </div>
        }
      />
      <PageBody>
        {(showForm || showImport) && (
          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {showForm && (
              <Panel title="New transaction">
                <TransactionForm
                  onSubmit={(tx) => {
                    add(tx);
                    setShowForm(false);
                  }}
                  onCancel={() => setShowForm(false)}
                />
              </Panel>
            )}
            {showImport && (
              <Panel title="Bulk import">
                <CsvImport
                  onImport={(rows) => {
                    addMany(rows);
                  }}
                />
              </Panel>
            )}
          </div>
        )}

        <Panel
          title={`${filtered.length} of ${transactions.length} transactions`}
          description={`Net for selection: ${formatCurrency(totalShown)}`}
          action={
            hydrated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (window.confirm("Reset all transactions to defaults?")) reset();
                }}
                title="Reset to default sample data"
              >
                <RotateCcw size={13} />
                Reset
              </Button>
            )
          }
        >
          <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((f) => ({ ...f, category: e.target.value as Category | "All" }))
              }
              className={inputCls}
            >
              <option value="All">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
              className={inputCls}
              aria-label="From date"
            />
            <input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
              className={inputCls}
              aria-label="To date"
            />
            <input
              type="number"
              placeholder="Min Rs"
              value={filters.min}
              onChange={(e) => setFilters((f) => ({ ...f, min: e.target.value }))}
              className={inputCls}
            />
            <input
              type="number"
              placeholder="Max Rs"
              value={filters.max}
              onChange={(e) => setFilters((f) => ({ ...f, max: e.target.value }))}
              className={inputCls}
            />
          </div>

          {filtersActive && (
            <div className="mb-3 flex items-center gap-2 text-[11px] text-muted-foreground">
              <button
                type="button"
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="inline-flex items-center gap-1 rounded-md border border-border-strong bg-surface-2 px-2 py-1 text-[11px] text-foreground hover:bg-surface-3"
              >
                <X size={12} />
                Clear filters
              </button>
            </div>
          )}

          {filtered.length === 0 ? (
            <EmptyTransactions hasAny={transactions.length > 0} />
          ) : (
            <div className="overflow-hidden rounded-md border border-border">
              <table className="w-full text-[13px]">
                <thead className="bg-surface-2/60 text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium">Date</th>
                    <th className="px-4 py-2.5 text-left font-medium">Category</th>
                    <th className="px-4 py-2.5 text-left font-medium">Note</th>
                    <th className="px-4 py-2.5 text-right font-medium">Amount</th>
                    <th className="w-10 px-4 py-2.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((t) => {
                    const isIncome = t.category === "Income";
                    return (
                      <tr key={t.id} className="group hover:bg-surface-2/50">
                        <td className="tabular-nums-feat px-4 py-2.5 text-muted-foreground">
                          {formatDateShort(t.date)}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center gap-2">
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: CATEGORY_COLORS[t.category] }}
                            />
                            <span className="text-foreground">{t.category}</span>
                          </span>
                        </td>
                        <td className="max-w-0 truncate px-4 py-2.5 text-muted-foreground">
                          {t.note || "—"}
                        </td>
                        <td
                          className={`tabular-nums-feat px-4 py-2.5 text-right font-semibold ${
                            isIncome ? "text-success" : "text-foreground"
                          }`}
                        >
                          {isIncome ? "+" : "−"}
                          {formatCurrency(t.amount).replace("-", "")}
                        </td>
                        <td className="px-2 py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => remove(t.id)}
                            className="rounded p-1 text-subtle opacity-0 transition-opacity hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
                            aria-label="Delete transaction"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </PageBody>
    </AppShell>
  );
}

function EmptyTransactions({ hasAny }: { hasAny: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-surface/40 py-12 text-center">
      <div className="text-[13px] font-medium text-foreground">
        {hasAny ? "No transactions match your filters" : "No transactions yet"}
      </div>
      <div className="text-[12px] text-muted-foreground">
        {hasAny
          ? "Try widening your date or amount range."
          : "Add one manually or import a CSV to get started."}
      </div>
    </div>
  );
}
