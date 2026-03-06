import { NextRequest, NextResponse } from "next/server";
import { fetchTransactionPages } from "@/lib/notion/queries";
import { parsePages } from "@/lib/notion/parser";
import type { ApiResponse, CategorySummary } from "@/types/transaction";

// ISR 캐싱: 5분 (300초)
export const revalidate = 300;

/** 카테고리별 고정 색상 팔레트 (8색) */
const CATEGORY_COLORS: string[] = [
  "#6366f1", // indigo
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // red
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#f97316", // orange
  "#14b8a6", // teal
];

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
    const pages = await fetchTransactionPages(year, month);
    const transactions = parsePages(pages);

    // 지출만 필터링 후 카테고리별 집계
    const expenses = transactions.filter((t) => t.type === "expense");
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

    const categoryMap = new Map<string, number>();
    for (const t of expenses) {
      const key = t.category || "기타";
      categoryMap.set(key, (categoryMap.get(key) ?? 0) + t.amount);
    }

    // 금액 내림차순 정렬
    const sorted = Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1]);

    // 최대 8개, 나머지 "기타"로 묶음
    const top7 = sorted.slice(0, 7);
    const others = sorted.slice(7);
    const othersTotal = others.reduce((sum, [, amt]) => sum + amt, 0);

    const items = othersTotal > 0 ? [...top7, ["기타", othersTotal] as [string, number]] : top7;

    const data: CategorySummary[] = items.map(([category, amount], index) => ({
      category,
      amount,
      ratio: totalExpense === 0 ? 0 : parseFloat(((amount / totalExpense) * 100).toFixed(1)),
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }));

    const response: ApiResponse<CategorySummary[]> = {
      data,
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
