"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { formatKRW } from "@/lib/utils/currency";
import type { CategorySummary } from "@/types/transaction";

interface CategoryChartProps {
  data: CategorySummary[];
  isLoading?: boolean;
}

interface TooltipPayload {
  name: string;
  value: number;
  payload: CategorySummary;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0].payload;

  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md text-sm">
      <p className="font-semibold mb-1">{item.category}</p>
      <p className="text-muted-foreground">{formatKRW(item.amount)}</p>
      <p className="text-muted-foreground">{item.ratio}%</p>
    </div>
  );
}

function CustomLegend({
  payload,
}: {
  payload?: { value: string; payload: CategorySummary }[];
}) {
  if (!payload) return null;
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
      {payload.map((entry) => (
        <li key={entry.value} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: entry.payload.color }}
          />
          {entry.value} {entry.payload.ratio}%
        </li>
      ))}
    </ul>
  );
}

export function CategoryChart({ data, isLoading = false }: CategoryChartProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="w-48 h-48 rounded-full" />
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="w-16 h-4 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        이번 달 지출 내역이 없습니다.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={95}
          paddingAngle={2}
        >
          {data.map((entry) => (
            <Cell key={entry.category} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
