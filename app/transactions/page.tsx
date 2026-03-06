import { fetchTransactionPages } from "@/lib/notion/queries";
import { parsePages } from "@/lib/notion/parser";
import { getCurrentYearMonth } from "@/lib/utils/date";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import type { Transaction } from "@/types/transaction";

/**
 * 거래 내역 페이지 (Server Component)
 * 현재 월 전체 거래 내역을 Notion에서 조회하여 렌더링
 */
export default async function TransactionsPage() {
  const { year, month } = getCurrentYearMonth();

  let transactions: Transaction[] = [];
  let error = null;

  try {
    const pages = await fetchTransactionPages(year, month);
    transactions = parsePages(pages);
  } catch (err) {
    error = err instanceof Error ? err.message : "Notion 데이터 조회 실패";
  }

  // 유니크 카테고리 목록 추출
  const categories = Array.from(
    new Set(transactions.map((t) => t.category).filter(Boolean))
  ).sort();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">거래 내역</h1>

      {error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
          <p className="text-destructive font-semibold">⚠️ 데이터를 불러올 수 없습니다</p>
          <p className="text-muted-foreground text-sm mt-2">{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <TransactionFilters categories={categories} />
          <TransactionTable transactions={transactions} />
        </div>
      )}
    </main>
  );
}
