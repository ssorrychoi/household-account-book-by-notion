import { NextRequest, NextResponse } from "next/server";
import { fetchTransactionPages } from "@/lib/notion/queries";
import { parsePages } from "@/lib/notion/parser";
import { getRecentMonths } from "@/lib/utils/date";
import type { ApiResponse, MonthlySummary } from "@/types/transaction";

// ISR 캐싱: 1시간 (추이 데이터는 과거 수정이 적음)
export const revalidate = 3600;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const monthsParam = searchParams.get("months");
  const months = monthsParam ? parseInt(monthsParam, 10) : 12;

  if (isNaN(months) || months < 1 || months > 24) {
    return NextResponse.json(
      { error: "months는 1~24 사이의 정수여야 합니다." },
      { status: 400 }
    );
  }

  try {
    const recentMonths = getRecentMonths(months);

    // 병렬로 모든 월 조회
    const results = await Promise.all(
      recentMonths.map(async ({ year, month }) => {
        const pages = await fetchTransactionPages(year, month);
        const transactions = parsePages(pages);
        const totalIncome = transactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0);
        const balance = totalIncome - totalExpense;
        const savingsRate =
          totalIncome === 0
            ? 0
            : parseFloat(((balance / totalIncome) * 100).toFixed(1));

        return { year, month, totalIncome, totalExpense, balance, savingsRate } satisfies MonthlySummary;
      })
    );

    const response: ApiResponse<MonthlySummary[]> = {
      data: results,
      cachedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json(
      { error: `Notion API 호출 실패: ${message}` },
      { status: 500 }
    );
  }
}
