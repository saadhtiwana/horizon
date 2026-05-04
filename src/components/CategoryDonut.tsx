import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";
import { CATEGORY_COLORS } from "@/lib/types";
import type { Category } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/format";

type Datum = { category: Category; value: number; percent: number };

type TooltipPayloadItem = { payload: Datum };

function CustomTooltip(props: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) {
  const { active, payload } = props;
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-md border border-border-strong bg-surface-3 px-3 py-2 text-[12px] shadow-lg">
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: CATEGORY_COLORS[d.category] }}
        />
        <span className="font-medium text-foreground">{d.category}</span>
      </div>
      <div className="tabular-nums-feat mt-1 flex items-baseline gap-2">
        <span className="text-foreground">{formatCurrency(d.value)}</span>
        <span className="text-muted-foreground">{formatPercent(d.percent)}</span>
      </div>
    </div>
  );
}

type Props = {
  data: Datum[];
};

export function CategoryDonut({ data }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((a, b) => a + b.value, 0);

  if (data.length === 0) {
    return (
      <div className="flex h-[280px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-surface/50 text-center">
        <div className="text-[13px] font-medium text-foreground">No spending this month</div>
        <div className="text-[12px] text-muted-foreground">
          Add transactions to see the breakdown.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_220px]">
      <div className="relative h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              stroke="var(--color-background)"
              strokeWidth={2}
              onMouseEnter={(_, idx) => setActive(idx)}
              onMouseLeave={() => setActive(null)}
            >
              {data.map((d, idx) => (
                <Cell
                  key={d.category}
                  fill={CATEGORY_COLORS[d.category]}
                  opacity={active === null || active === idx ? 1 : 0.25}
                  style={{ transition: "opacity 150ms ease" }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={false} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
            {active !== null ? data[active].category : "Total"}
          </span>
          <span
            className="tabular-nums-feat mt-1 text-[22px] font-semibold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {formatCurrency(active !== null ? data[active].value : total, { compact: true })}
          </span>
          {active !== null && (
            <span className="tabular-nums-feat mt-0.5 text-[11px] text-primary">
              {formatPercent(data[active].percent)}
            </span>
          )}
        </div>
      </div>
      <ul className="flex flex-col gap-1.5 self-center">
        {data.map((d, idx) => (
          <li
            key={d.category}
            onMouseEnter={() => setActive(idx)}
            onMouseLeave={() => setActive(null)}
            className={`flex cursor-default items-center justify-between gap-3 rounded-md px-2 py-1.5 text-[12px] transition-colors ${
              active === idx ? "bg-surface-2" : ""
            }`}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[d.category] }}
              />
              <span className="truncate text-foreground">{d.category}</span>
            </span>
            <span className="tabular-nums-feat shrink-0 text-muted-foreground">
              {formatPercent(d.percent, 0)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
