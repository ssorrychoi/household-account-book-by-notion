"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { formatKRW } from "@/lib/utils/currency";
import { formatMonthLabel } from "@/lib/utils/date";
import type { MonthlySummary } from "@/types/transaction";

interface MonthlyTrendChartProps {
  data: MonthlySummary[];
  isLoading?: boolean;
}

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const income = payload.find((p) => p.name === "수입");
  const expense = payload.find((p) => p.name === "지출");
  const balance = (income?.value ?? 0) - (expense?.value ?? 0);

  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md text-sm min-w-[160px]">
      <p className="font-semibold mb-2">{label}</p>
      {income && (
        <p className="text-emerald-600">수입: {formatKRW(income.value)}</p>
      )}
      {expense && (
        <p className="text-destructive">지출: {formatKRW(expense.value)}</p>
      )}
      <p className={`mt-1 font-medium ${balance >= 0 ? "text-emerald-600" : "text-destructive"}`}>
        잔액: {formatKRW(balance)}
      </p>
    </div>
  );
}

function yAxisFormatter(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}백만`;
  if (value >= 10_000) return `${(value / 10_000).toFixed(0)}만`;
  return String(value);
}

export function MonthlyTrendChart({ data, isLoading = false }: MonthlyTrendChartProps) {
  if (isLoading) {
    return (
      <div className="flex items-end gap-2 h-48 px-2">
        {[60, 80, 50, 90, 70, 85].map((h, i) => (
          <Skeleton key={i} className="flex-1 rounded" style={{ height: `${h}%` }} />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        데이터가 없습니다.
      </div>
    );
  }

  const chartData = data.map((item) => ({
    label: formatMonthLabel(item.year, item.month),
    수입: item.totalIncome,
    지출: item.totalExpense,
  }));

  return (
    <div className="w-full overflow-x-auto">
      <div style={{ minWidth: Math.max(chartData.length * 60, 300) }}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} barCategoryGap="30%" barGap={4}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={yAxisFormatter}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />
            <Bar dataKey="수입" fill="oklch(0.55 0.21 155)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="지출" fill="oklch(0.55 0.22 25)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
