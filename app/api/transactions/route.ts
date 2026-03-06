import { NextRequest, NextResponse } from "next/server";
import { fetchTransactionPages } from "@/lib/notion/queries";
import { parsePages } from "@/lib/notion/parser";
import type { ApiResponse, Transaction } from "@/types/transaction";

// ISR 캐싱: 5분 (300초)
export const revalidate = 300;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const yearParam = searchParams.get("year");
  const monthParam = searchParams.get("month");

  // 파라미터 유효성 검사
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

    const response: ApiResponse<Transaction[]> = {
      data: transactions,
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
