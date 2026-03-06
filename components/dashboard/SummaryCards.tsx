// 월별 요약 카드 4개 (총 수입, 총 지출, 잔액, 저축률)
// TODO: MonthlySummary 데이터를 props로 받아 렌더링

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MonthlySummary } from "@/types/transaction";
import { formatKRW, formatSavingsRate, calcChangeRate } from "@/lib/utils/currency";

interface SummaryCardsProps {
  current: MonthlySummary;
  previous: MonthlySummary | null;
}

export function SummaryCards({ current, previous }: SummaryCardsProps) {
  const incomeChange = previous ? calcChangeRate(current.totalIncome, previous.totalIncome) : null;
  const expenseChange = previous ? calcChangeRate(current.totalExpense, previous.totalExpense) : null;

  const cards = [
    {
      label: "총 수입",
      value: formatKRW(current.totalIncome),
      change: incomeChange,
      isPositiveGood: true,
    },
    {
      label: "총 지출",
      value: formatKRW(current.totalExpense),
      change: expenseChange,
      isPositiveGood: false,
    },
    {
      label: "잔액",
      value: formatKRW(current.balance),
      change: null,
      isNegative: current.balance < 0,
    },
    {
      label: "저축률",
      value: formatSavingsRate(current.savingsRate),
      change: null,
      isNegative: current.savingsRate < 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold ${
                "isNegative" in card && card.isNegative ? "text-destructive" : ""
              }`}
            >
              {card.value}
            </p>
            {card.change && (
              <p className="text-xs text-muted-foreground mt-1">
                <span
                  className={
                    card.change.isPositive === card.isPositiveGood
                      ? "text-emerald-600"
                      : "text-destructive"
                  }
                >
                  {card.change.isPositive ? "↑" : "↓"} {card.change.value}%
                </span>{" "}
                전월 대비
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
