import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Pencil } from "lucide-react";

import { AppShell, PageBody, PageHeader } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { useBudgets, useTransactions } from "@/lib/storage";
import { EXPENSE_CATEGORIES, type Category } from "@/lib/types";
import { categoryBreakdown } from "@/lib/analytics";
import { formatCurrency, formatPercent } from "@/lib/format";

export const Route = createFileRoute("/budgets")({
  component: BudgetsPage,
});

function BudgetsPage() {
  const { transactions, hydrated: txHy } = useTransactions();
  const { budgets, setBudget, hydrated: budHy } = useBudgets();

  if (!txHy || !budHy) {
    return (
      <AppShell>
        <PageHeader title="Budgets" />
        <PageBody>
          <div className="h-32" />
        </PageBody>
      </AppShell>
    );
  }

  const now = new Date();
  const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const breakdown = categoryBreakdown(transactions, now);
  const spendByCategory = new Map<Category, number>();
  for (const b of breakdown) spendByCategory.set(b.category, b.value);

  const rows = EXPENSE_CATEGORIES.map((category) => {
    const limit = budgets[category] ?? null;
    const spent = spendByCategory.get(category) ?? 0;
    const pct = limit && limit > 0 ? (spent / limit) * 100 : 0;
    return { category, limit, spent, pct };
  }).sort((a, b) => b.pct - a.pct);

  const overspent = rows.filter((r) => r.limit !== null && r.spent > r.limit).length;
  const totalLimit = rows.reduce((acc, r) => acc + (r.limit ?? 0), 0);
  const totalSpent = rows.reduce((acc, r) => acc + r.spent, 0);

  return (
    <AppShell>
      <PageHeader
        title="Budgets"
        description={`${monthLabel} · ${overspent > 0 ? `${overspent} category${overspent === 1 ? "" : "ies"} over limit` : "All categories on track."}`}
      />
      <PageBody>
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <SummaryStat
            label="Total Budget"
            value={formatCurrency(totalLimit, { compact: true })}
          />
          <SummaryStat
            label="Spent"
            value={formatCurrency(totalSpent, { compact: true })}
          />
          <SummaryStat
            label="Remaining"
            value={formatCurrency(Math.max(totalLimit - totalSpent, 0), { compact: true })}
            accent
          />
        </div>
        <Panel
          title="Category Limits"
          description="Set a monthly cap per category. Bars turn orange near the limit and red when exceeded."
        >
          <ul className="divide-y divide-border">
            {rows.map((row) => (
              <BudgetRow
                key={row.category}
                category={row.category}
                limit={row.limit}
                spent={row.spent}
                pct={row.pct}
                onSave={(amount) => setBudget(row.category, amount)}
              />
            ))}
          </ul>
        </Panel>
      </PageBody>
    </AppShell>
  );
}

function SummaryStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface px-5 py-4">
      <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </div>
      <div
        className={`tabular-nums-feat mt-2 text-[24px] font-semibold ${
          accent ? "text-primary" : "text-foreground"
        }`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
    </div>
  );
}

type RowProps = {
  category: Category;
  limit: number | null;
  spent: number;
  pct: number;
  onSave: (amount: number | null) => void;
};

function BudgetRow({ category, limit, spent, pct, onSave }: RowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(limit !== null ? String(limit) : "");

  const fillPct = Math.min(pct, 100);
  const over = limit !== null && spent > limit;
  const warn = !over && pct >= 80;
  const barColor = over ? "bg-danger" : warn ? "bg-primary" : "bg-primary-dim";

  const commit = () => {
    const num = Number(draft);
    if (draft.trim() === "") {
      onSave(null);
    } else if (Number.isFinite(num) && num >= 0) {
      onSave(num);
    }
    setEditing(false);
  };

  return (
    <li className="grid grid-cols-[140px_1fr_auto] items-center gap-6 py-4 first:pt-0 last:pb-0">
      <div className="text-[13px] font-medium text-foreground">{category}</div>
      <div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-surface-3">
          <div
            className={`h-full ${barColor} transition-[width] duration-500 ease-out`}
            style={{ width: `${fillPct}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="tabular-nums-feat">
            {formatCurrency(spent)}
            {limit !== null && (
              <>
                {" "}
                <span className="text-subtle">/ {formatCurrency(limit)}</span>
              </>
            )}
          </span>
          {limit !== null && (
            <span
              className={`tabular-nums-feat font-medium ${
                over ? "text-danger" : warn ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {over ? `${formatCurrency(spent - limit)} over` : formatPercent(pct, 0)}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end">
        {editing ? (
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[11px] font-medium text-subtle">
                Rs
              </span>
              <input
                type="number"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commit();
                  if (e.key === "Escape") setEditing(false);
                }}
                autoFocus
                placeholder="0"
                className="tabular-nums-feat h-8 w-28 rounded-md border border-border-strong bg-surface-2 pl-7 pr-2 text-[12px] text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="button"
              onClick={commit}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary-glow"
              aria-label="Save"
            >
              <Check size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setDraft(limit !== null ? String(limit) : "");
              setEditing(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-surface-2 px-2.5 py-1.5 text-[12px] text-muted-foreground hover:bg-surface-3 hover:text-foreground"
          >
            <Pencil size={12} />
            {limit === null ? "Set limit" : "Edit"}
          </button>
        )}
      </div>
    </li>
  );
}
