import { Suspense } from "react";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { MonthNav } from "@/components/dashboard/MonthNav";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { fetchTransactionPages } from "@/lib/notion/queries";
import { parsePages } from "@/lib/notion/parser";
import { aggregateByMonth, aggregateByCategory } from "@/lib/utils/aggregate";
import { getCurrentYearMonth, getRecentMonths } from "@/lib/utils/date";
import { CATEGORY_COLORS } from "@/lib/mock/data";

interface PageProps {
  searchParams: Promise<{ year?: string; month?: string }>;
}

/**
 * 메인 대시보드 페이지 (Server Component)
 * URL searchParams로 월을 선택하며 Notion 데이터를 조회하여 렌더링
 */
export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { year: currentYear, month: currentMonth } = getCurrentYearMonth();

  const year = params.year ? parseInt(params.year, 10) : currentYear;
  const month = params.month ? parseInt(params.month, 10) : currentMonth;

  let currentMonthData = null;
  let previousMonthData = null;
  let categoryData: ReturnType<typeof aggregateByCategory> = [];
  let trendData: ReturnType<typeof aggregateByMonth>[] = [];
  let currentTransactions: ReturnType<typeof parsePages> = [];
  let error = null;

  try {
    // 선택 월 데이터 조회
    const currentPages = await fetchTransactionPages(year, month);
    currentTransactions = parsePages(currentPages);
    currentMonthData = aggregateByMonth(currentTransactions, year, month);
    categoryData = aggregateByCategory(currentTransactions, CATEGORY_COLORS);

    // 이전 월 데이터 조회 (전월 대비 비교용)
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const previousPages = await fetchTransactionPages(prevYear, prevMonth);
    const previousTransactions = parsePages(previousPages);
    previousMonthData = aggregateByMonth(previousTransactions, prevYear, prevMonth);

    // 최근 12개월 추이 데이터 병렬 조회
    const recentMonths = getRecentMonths(12);
    const trendPages = await Promise.all(
      recentMonths.map(({ year: y, month: m }) => fetchTransactionPages(y, m))
    );
    trendData = trendPages.map((pages, i) => {
      const transactions = parsePages(pages);
      return aggregateByMonth(transactions, recentMonths[i].year, recentMonths[i].month);
    });
  } catch (err) {
    error = err instanceof Error ? err.message : "Notion 데이터 조회 실패";
    console.error("[DashboardPage Error]", error);
  }

  // 에러 처리
  if (error || !currentMonthData) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Notion 가계부 대시보드
          </h1>
        </div>

        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
          <p className="text-destructive font-semibold">
            ⚠️ Notion 데이터를 불러올 수 없습니다
          </p>
          <p className="text-muted-foreground text-sm mt-2">{error}</p>
          <p className="text-muted-foreground text-xs mt-4">
            환경변수 설정을 확인하세요: NOTION_API_KEY, NOTION_DATABASE_ID
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 페이지 제목 + 월 네비게이션 */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Notion 가계부 대시보드
          </h1>
          <p className="text-muted-foreground mt-2">
            월별 재무 현황 (실시간 Notion 데이터)
          </p>
        </div>
        <Suspense fallback={null}>
          <MonthNav year={year} month={month} />
        </Suspense>
      </div>

      {/* 요약 카드 섹션 */}
      <section className="mb-10">
        <SummaryCards current={currentMonthData} previous={previousMonthData} />
      </section>

      {/* 차트 섹션 */}
      <section className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 카테고리별 지출 도넛 차트 */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-base font-semibold mb-4">카테고리별 지출</h2>
          <CategoryChart data={categoryData} />
        </div>

        {/* 월별 수입/지출 추이 바 차트 */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-base font-semibold mb-4">월별 수입/지출 추이</h2>
          <MonthlyTrendChart data={trendData} />
        </div>
      </section>

      {/* 거래 내역 섹션 */}
      <section>
        <h2 className="text-base font-semibold mb-4">거래 내역</h2>
        {(() => {
          const categories = Array.from(
            new Set(currentTransactions.map((t) => t.category).filter((c): c is string => Boolean(c)))
          ).sort();
          return (
            <div className="space-y-4">
              <TransactionFilters categories={categories} />
              <TransactionTable transactions={currentTransactions} />
            </div>
          );
        })()}
      </section>
    </main>
  );
}
