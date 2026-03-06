import { NextRequest, NextResponse } from "next/server";
import { fetchTransactionPages } from "@/lib/notion/queries";
import { parsePages } from "@/lib/notion/parser";
import type { ApiResponse, MonthlySummary } from "@/types/transaction";

// ISR 캐싱: 5분 (300초)
export const revalidate = 300;

/** 거래 배열에서 월별 요약 집계 */
function calcSummary(
  year: number,
  month: number,
  transactions: ReturnType<typeof parsePages>
): MonthlySummary {
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

  return { year, month, totalIncome, totalExpense, balance, savingsRate };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const yearParam = searchParams.get("year");
  const monthParam = searchParams.get("month");

  if (!yearParam || !monthParam) {
    return NextResponse.json(
      { error: "year, month 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  const year = parseInt(yearParam, 10);
  const month = parseInt(monthParam, 10);

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    return NextResponse.json(
      { error: "유효하지 않은 year 또는 month 값입니다." },
      { status: 400 }
    );
  }

  try {
    // 현재 월 + 전월 병렬 조회
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;

    const [currentPages, previousPages] = await Promise.all([
      fetchTransactionPages(year, month),
      fetchTransactionPages(prevYear, prevMonth),
    ]);

    const current = calcSummary(year, month, parsePages(currentPages));
    const previous = calcSummary(prevYear, prevMonth, parsePages(previousPages));

    const response: ApiResponse<{ current: MonthlySummary; previous: MonthlySummary }> = {
      data: { current, previous },
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
