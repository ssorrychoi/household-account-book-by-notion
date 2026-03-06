/**
 * 데이터 집계 유틸리티
 * 거래 데이터를 월별, 카테고리별로 집계하는 함수들
 */

import type {
  Transaction,
  MonthlySummary,
  CategorySummary,
} from "@/types/transaction";

/**
 * 거래 배열을 월별 요약 데이터로 집계
 * @param transactions - 거래 데이터 배열
 * @param year - 연도 (선택사항, 거래의 연도 자동 감지)
 * @param month - 월 (선택사항, 거래의 월 자동 감지)
 * @returns 월별 요약 데이터
 */
export function aggregateByMonth(
  transactions: Transaction[],
  year?: number,
  month?: number
): MonthlySummary {
  // 거래가 없으면 기본값 반환
  if (transactions.length === 0) {
    const now = new Date();
    return {
      year: year ?? now.getFullYear(),
      month: month ?? now.getMonth() + 1,
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      savingsRate: 0,
    };
  }

  // 첫 거래에서 연월 자동 감지
  let detectedYear = year;
  let detectedMonth = month;

  if (!detectedYear || !detectedMonth) {
    const firstDate = new Date(transactions[0].date);
    if (!detectedYear) detectedYear = firstDate.getFullYear();
    if (!detectedMonth) detectedMonth = firstDate.getMonth() + 1;
  }

  // 소득 및 지출 합계 계산
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // 저축률 계산 (소수점 1자리)
  const savingsRate =
    totalIncome > 0
      ? parseFloat(((balance / totalIncome) * 100).toFixed(1))
      : 0;

  return {
    year: detectedYear,
    month: detectedMonth,
    totalIncome,
    totalExpense,
    balance,
    savingsRate,
  };
}

/**
 * 거래 배열을 카테고리별 지출로 집계
 * @param transactions - 거래 데이터 배열
 * @param categoryColors - 카테고리별 색상 맵 (선택사항)
 * @returns 카테고리별 지출 배열 (금액 내림차순)
 */
export function aggregateByCategory(
  transactions: Transaction[],
  categoryColors?: Record<string, string>
): CategorySummary[] {
  // 지출(expense)만 필터링하여 카테고리별 합계 계산
  const categoryMap = new Map<string, number>();

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const current = categoryMap.get(t.category) ?? 0;
      categoryMap.set(t.category, current + t.amount);
    });

  // 전체 지출 합계
  const totalExpense = Array.from(categoryMap.values()).reduce(
    (sum, amount) => sum + amount,
    0
  );

  // 카테고리별 비율 계산 및 정렬
  const result: CategorySummary[] = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      ratio:
        totalExpense > 0
          ? parseFloat(((amount / totalExpense) * 100).toFixed(1))
          : 0,
      color: categoryColors?.[category] ?? "#8b5cf6", // 기본색: 보라색
    }))
    .sort((a, b) => b.amount - a.amount); // 금액 내림차순

  return result;
}

/**
 * 저축률 계산
 * @param income - 총 소득
 * @param expense - 총 지출
 * @returns 저축률 (소수점 1자리, 0~100)
 */
export function calculateSavingsRate(income: number, expense: number): number {
  if (income <= 0) return 0;
  const rate = ((income - expense) / income) * 100;
  return parseFloat(rate.toFixed(1));
}

/**
 * 거래 배열에서 특정 카테고리의 합계 계산
 * @param transactions - 거래 데이터 배열
 * @param category - 카테고리명
 * @param type - 거래 유형 (income/expense, 선택사항)
 * @returns 해당 카테고리의 합계
 */
export function getTotalByCategory(
  transactions: Transaction[],
  category: string,
  type?: "income" | "expense"
): number {
  return transactions
    .filter(
      (t) =>
        t.category === category && (type === undefined || t.type === type)
    )
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * 거래 배열에서 특정 유형의 합계 계산
 * @param transactions - 거래 데이터 배열
 * @param type - 거래 유형 (income/expense)
 * @returns 해당 유형의 합계
 */
export function getTotalByType(
  transactions: Transaction[],
  type: "income" | "expense"
): number {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
}
