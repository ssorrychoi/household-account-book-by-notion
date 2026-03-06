"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthNavProps {
  year: number;
  month: number;
}

export function MonthNav({ year, month }: MonthNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function navigate(targetYear: number, targetMonth: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", String(targetYear));
    params.set("month", String(targetMonth));
    router.push(`?${params.toString()}`);
  }

  function goPrev() {
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    navigate(prevYear, prevMonth);
  }

  function goNext() {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    navigate(nextYear, nextMonth);
  }

  const now = new Date();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={goPrev} aria-label="이전 달">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-lg font-semibold min-w-[80px] text-center">
        {year}년 {month}월
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={goNext}
        disabled={isCurrentMonth}
        aria-label="다음 달"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
