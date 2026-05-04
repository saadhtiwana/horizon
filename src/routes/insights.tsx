import { createFileRoute } from "@tanstack/react-router";

import { AppShell, PageBody, PageHeader } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { CategoryDonut } from "@/components/CategoryDonut";
import { MonthlyBarChart } from "@/components/MonthlyBarChart";
import { useTransactions } from "@/lib/storage";
import {
  categoryBreakdown,
  monthlySeries,
  totalsForMonth,
  trendVsLastMonth,
} from "@/lib/analytics";
import { formatCurrency, formatPercent } from "@/lib/format";

export const Route = createFileRoute("/insights")({
  component: InsightsPage,
});

function InsightsPage() {
  const { transactions, hydrated } = useTransactions();
  if (!hydrated) {
    return (
      <AppShell>
        <PageHeader title="Insights" />
        <PageBody>
          <div className="h-32" />
        </PageBody>
      </AppShell>
    );
  }

  const now = new Date();
  const series = monthlySeries(transactions, 6);
  const breakdown = categoryBreakdown(transactions, now);
  const month = totalsForMonth(transactions, now);
  const incomeTrend = trendVsLastMonth(transactions, "income");
  const expenseTrend = trendVsLastMonth(transactions, "expenses");

  const avgExpense =
    series.length > 0
      ? series.reduce((a, b) => a + b.expenses, 0) / series.length
      : 0;
  const avgIncome =
    series.length > 0
      ? series.reduce((a, b) => a + b.income, 0) / series.length
      : 0;

  const topCat = breakdown[0];

  return (
    <AppShell>
      <PageHeader title="Insights" description="Patterns from the last six months." />
      <PageBody>
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Insight label="6-mo Avg Income" value={formatCurrency(avgIncome, { compact: true })} />
          <Insight label="6-mo Avg Expenses" value={formatCurrency(avgExpense, { compact: true })} />
          <Insight
            label="Income Δ"
            value={`${incomeTrend.pct >= 0 ? "+" : ""}${formatPercent(incomeTrend.pct, 1)}`}
            tone={incomeTrend.pct >= 0 ? "good" : "bad"}
          />
          <Insight
            label="Expense Δ"
            value={`${expenseTrend.pct >= 0 ? "+" : ""}${formatPercent(expenseTrend.pct, 1)}`}
            tone={expenseTrend.pct <= 0 ? "good" : "bad"}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Panel title="Cashflow Trend" description="Monthly income vs expenses.">
            <MonthlyBarChart data={series} />
          </Panel>
          <Panel
            title="This Month's Mix"
            description={
              topCat
                ? `${topCat.category} leads at ${formatPercent(topCat.percent, 0)} of spending.`
                : "No spending recorded yet."
            }
          >
            <CategoryDonut data={breakdown} />
          </Panel>
        </div>

        <div className="mt-6">
          <Panel title="Summary" description={`Through ${now.toLocaleDateString("en-US", { month: "long", year: "numeric" })}.`}>
            <dl className="grid grid-cols-1 gap-x-12 gap-y-3 text-[13px] md:grid-cols-2">
              <SummaryRow label="Income this month" value={formatCurrency(month.income)} />
              <SummaryRow label="Expenses this month" value={formatCurrency(month.expenses)} />
              <SummaryRow
                label="Net cashflow"
                value={formatCurrency(month.net)}
                tone={month.net >= 0 ? "good" : "bad"}
              />
              <SummaryRow
                label="Savings rate"
                value={formatPercent(month.savingsRate, 1)}
                tone={month.savingsRate >= 20 ? "good" : month.savingsRate < 0 ? "bad" : undefined}
              />
            </dl>
          </Panel>
        </div>
      </PageBody>
    </AppShell>
  );
}

function Insight({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "good" | "bad";
}) {
  const color =
    tone === "good" ? "text-success" : tone === "bad" ? "text-danger" : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-surface px-5 py-4">
      <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </div>
      <div
        className={`tabular-nums-feat mt-2 text-[22px] font-semibold ${color}`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "good" | "bad";
}) {
  const color =
    tone === "good" ? "text-success" : tone === "bad" ? "text-danger" : "text-foreground";
  return (
    <div className="flex items-center justify-between border-b border-border py-2 last:border-b-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`tabular-nums-feat font-semibold ${color}`}>{value}</dd>
    </div>
  );
}
