"use client";

// 월 선택 드롭다운 컴포넌트
// TODO: 선택된 월 변경 시 URL query string 또는 상태 업데이트

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRecentMonths, formatMonthLabel } from "@/lib/utils/date";

interface MonthSelectorProps {
  selectedYear: number;
  selectedMonth: number;
  onChange: (year: number, month: number) => void;
}

export function MonthSelector({
  selectedYear,
  selectedMonth,
  onChange,
}: MonthSelectorProps) {
  const months = getRecentMonths(12);
  const currentValue = `${selectedYear}-${selectedMonth}`;

  return (
    <Select
      value={currentValue}
      onValueChange={(value) => {
        const [year, month] = value.split("-").map(Number);
        onChange(year, month);
      }}
    >
      <SelectTrigger className="w-[160px]" aria-label="월 선택">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {months.map(({ year, month }) => (
          <SelectItem key={`${year}-${month}`} value={`${year}-${month}`}>
            {formatMonthLabel(year, month)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
