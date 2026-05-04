import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import { useAuth } from "@/lib/auth";

import { AppShell, PageBody, PageHeader } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { Panel } from "@/components/Panel";
import { CategoryDonut } from "@/components/CategoryDonut";
import { MonthlyBarChart } from "@/components/MonthlyBarChart";
import { useTransactions } from "@/lib/storage";
import {
  totalBalance,
  totalsForMonth,
  trendVsLastMonth,
  categoryBreakdown,
  monthlySeries,
} from "@/lib/analytics";
import { formatCurrency, formatPercent, formatDateShort } from "@/lib/format";
import { CATEGORY_COLORS } from "@/lib/types";

export const Route = createFileRoute("/")({
  component: OverviewPage,
});

function OverviewPage() {
  const { transactions, hydrated } = useTransactions();
  const { user } = useAuth();

  if (!hydrated) {
    return (
      <AppShell>
        <PageHeader title="Overview" />
        <PageBody>
          <div className="h-32" />
        </PageBody>
      </AppShell>
    );
  }

  const now = new Date();
  const balance = totalBalance(transactions);
  const month = totalsForMonth(transactions, now);
  const incomeTrend = trendVsLastMonth(transactions, "income");
  const expenseTrend = trendVsLastMonth(transactions, "expenses");
  const breakdown = categoryBreakdown(transactions, now);
  const series = monthlySeries(transactions, 6);

  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <AppShell>
      <PageHeader
        title={user ? `Hi ${user.username}` : "Overview"}
        description={`Here's your snapshot for ${monthLabel}.`}
      />
      <PageBody>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="animate-rise delay-1">
            <StatCard
              label="Total Balance"
              value={formatCurrency(balance, { compact: true })}
              numericValue={balance}
              format={(n) => formatCurrency(n, { compact: true })}
              hint="All-time net"
              icon={<Wallet size={14} />}
            />
          </div>
          <div className="animate-rise delay-2">
            <StatCard
              label="Income · This Month"
              value={formatCurrency(month.income, { compact: true })}
              numericValue={month.income}
              format={(n) => formatCurrency(n, { compact: true })}
              trend={incomeTrend.pct === 0 ? null : { pct: incomeTrend.pct, label: "vs last" }}
              icon={<TrendingUp size={14} />}
            />
          </div>
          <div className="animate-rise delay-3">
            <StatCard
              label="Expenses · This Month"
              value={formatCurrency(month.expenses, { compact: true })}
              numericValue={month.expenses}
              format={(n) => formatCurrency(n, { compact: true })}
              trend={
                expenseTrend.pct === 0
                  ? null
                  : { pct: -expenseTrend.pct, label: "vs last" }
              }
              icon={<TrendingDown size={14} />}
            />
          </div>
          <div className="animate-rise delay-4">
            <StatCard
              label="Savings Rate"
              value={formatPercent(month.savingsRate, 1)}
              numericValue={month.savingsRate}
              format={(n) => formatPercent(n, 1)}
              accent
              hint={`Net ${formatCurrency(month.net, { compact: true })}`}
              icon={<PiggyBank size={14} />}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
          <Panel
            title="Cashflow"
            description="Income vs expenses over the last 6 months."
            className="xl:col-span-2"
          >
            <MonthlyBarChart data={series} />
          </Panel>
          <Panel title="Spending Mix" description={`Where your money went in ${monthLabel}.`}>
            <CategoryDonut data={breakdown} />
          </Panel>
        </div>

        <div className="mt-6">
          <Panel title="Recent Activity" description="Your six most recent transactions.">
            {recent.length === 0 ? (
              <EmptyRecent />
            ) : (
              <ul className="divide-y divide-border">
                {recent.map((t) => {
                  const isIncome = t.category === "Income";
                  return (
                    <li
                      key={t.id}
                      className="grid grid-cols-[16px_1fr_auto] items-center gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[t.category] }}
                      />
                      <div className="min-w-0">
                        <div className="truncate text-[13px] font-medium text-foreground">
                          {t.note || t.category}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {t.category} · {formatDateShort(t.date)}
                        </div>
                      </div>
                      <span
                        className={`tabular-nums-feat text-[13px] font-semibold ${
                          isIncome ? "text-success" : "text-foreground"
                        }`}
                      >
                        {isIncome ? "+" : "−"}
                        {formatCurrency(t.amount).replace("-", "")}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </div>
      </PageBody>
    </AppShell>
  );
}

function EmptyRecent() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <div className="text-[13px] font-medium text-foreground">No transactions yet</div>
      <div className="text-[12px] text-muted-foreground">
        Add your first transaction from the Transactions page.
      </div>
    </div>
  );
}
