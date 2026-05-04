import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatCurrency } from "@/lib/format";
import type { MonthlySeries } from "@/lib/analytics";

type TooltipItem = {
  dataKey: string;
  value: number;
  color: string;
};

function CustomTooltip(props: {
  active?: boolean;
  payload?: TooltipItem[];
  label?: string;
}) {
  const { active, payload, label } = props;
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-md border border-border-strong bg-surface-3 px-3 py-2 text-[12px] shadow-lg">
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      {payload.map((p) => (
        <div
          key={p.dataKey}
          className="tabular-nums-feat flex items-center justify-between gap-4"
        >
          <span className="flex items-center gap-2 capitalize text-foreground">
            <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: p.color }} />
            {p.dataKey}
          </span>
          <span className="text-foreground">{formatCurrency(p.value ?? 0)}</span>
        </div>
      ))}
    </div>
  );
}

export function MonthlyBarChart({ data }: { data: MonthlySeries[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-5 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-sm bg-primary" />
          Income
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-sm border border-border-strong bg-surface-3" />
          Expenses
        </span>
      </div>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="var(--color-muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => formatCurrency(v, { compact: true })}
              width={56}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "var(--color-surface-2)", radius: 4 }}
            />
            <Bar dataKey="income" fill="var(--color-primary)" radius={[3, 3, 0, 0]} maxBarSize={28} />
            <Bar dataKey="expenses" fill="var(--color-foreground)" radius={[3, 3, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
