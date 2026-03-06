/**
 * 더미 데이터 생성 유틸리티
 * Phase 2 UI 개발용 목데이터
 */

import type {
  Transaction,
  MonthlySummary,
  CategorySummary,
} from "@/types/transaction";
import { getMonthRange } from "@/lib/utils/date";
import {
  aggregateByMonth,
  aggregateByCategory,
} from "@/lib/utils/aggregate";

/**
 * 카테고리 목록
 */
export const CATEGORIES = ["식비", "교통", "문화", "의료", "급여", "기타"];

/**
 * 카테고리별 색상 (TailwindCSS v4 OKLch 색공간)
 */
export const CATEGORY_COLORS: Record<string, string> = {
  식비: "oklch(0.63 0.22 50)",    // 주황
  교통: "oklch(0.56 0.21 240)",   // 파랑
  문화: "oklch(0.56 0.22 280)",   // 보라
  의료: "oklch(0.55 0.22 25)",    // 빨강
  급여: "oklch(0.55 0.21 155)",   // 초록
  기타: "oklch(0.54 0.22 260)",   // 인디고
};

/**
 * 거래명 샘플 데이터
 */
const TRANSACTION_TITLES = {
  income: ["월급", "보너스", "용돈", "수익금"],
  expense: {
    식비: [
      "카페",
      "점심",
      "저녁",
      "편의점",
      "마트",
      "음식배달",
      "외식",
      "간식",
    ],
    교통: ["택시", "버스", "지하철", "주유", "휘발유", "자동차 유지비"],
    문화: [
      "영화표",
      "공연",
      "책",
      "게임",
      "스트리밍",
      "음악",
      "온라인 강좌",
    ],
    의료: ["약국", "병원", "치과", "안경", "건강검진"],
    급여: ["회사"],
    기타: ["쇼핑", "의류", "일상용품", "선물"],
  },
};

/**
 * 임의의 거래 생성
 */
function generateRandomTransaction(
  year: number,
  month: number,
  isIncome: boolean
): Transaction {
  const { start, end } = getMonthRange(year, month);
  const startDate = new Date(start);
  const endDate = new Date(end);

  // 해당 월의 임의 날짜
  const randomTime =
    startDate.getTime() +
    Math.random() * (endDate.getTime() - startDate.getTime());
  const randomDate = new Date(randomTime);
  const dateStr = randomDate.toISOString().split("T")[0];

  let category: string;
  let title: string;
  let amount: number;

  if (isIncome) {
    category = "급여";
    title =
      TRANSACTION_TITLES.income[
        Math.floor(Math.random() * TRANSACTION_TITLES.income.length)
      ];
    amount = Math.floor(Math.random() * 2000000) + 2000000; // 200만~400만
  } else {
    category =
      CATEGORIES[Math.floor(Math.random() * (CATEGORIES.length - 1))]; // 급여 제외
    const titles =
      TRANSACTION_TITLES.expense[
        category as keyof typeof TRANSACTION_TITLES.expense
      ] || TRANSACTION_TITLES.expense.기타;
    title = titles[Math.floor(Math.random() * titles.length)];
    amount = Math.floor(Math.random() * 100000) + 5000; // 5천~10만원대
  }

  return {
    id: crypto.randomUUID(),
    title,
    date: dateStr,
    amount,
    type: isIncome ? "income" : "expense",
    category,
    memo: null,
    paymentMethod: null,
  };
}

/**
 * 월별 더미 거래 데이터 생성 (30~50개)
 * @param year - 연도
 * @param month - 월 (1~12)
 * @returns 생성된 거래 배열
 */
export function generateMockTransactions(
  year: number,
  month: number
): Transaction[] {
  const transactions: Transaction[] = [];
  const count = Math.floor(Math.random() * 21) + 30; // 30~50개

  // 수입 ~30% (7~15개), 지출 ~70% (15~43개)
  const incomeCount = Math.floor(count * 0.3);
  const expenseCount = count - incomeCount;

  // 수입 거래
  for (let i = 0; i < incomeCount; i++) {
    transactions.push(generateRandomTransaction(year, month, true));
  }

  // 지출 거래
  for (let i = 0; i < expenseCount; i++) {
    transactions.push(generateRandomTransaction(year, month, false));
  }

  // 날짜순 정렬
  return transactions.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

/**
 * 월별 요약 데이터 생성
 * @param year - 연도
 * @param month - 월 (1~12)
 * @returns 월별 요약 데이터
 */
export function generateMockMonthlySummary(
  year: number,
  month: number
): MonthlySummary {
  const transactions = generateMockTransactions(year, month);
  return aggregateByMonth(transactions, year, month);
}

/**
 * 카테고리별 지출 집계 생성
 * @param transactions - 거래 배열
 * @returns 카테고리별 지출 요약 (색상 포함)
 */
export function generateMockCategorySummary(
  transactions: Transaction[]
): CategorySummary[] {
  const categorySummaries = aggregateByCategory(transactions, CATEGORY_COLORS);
  return categorySummaries;
}

/**
 * 월별 추이 데이터 생성
 * @param months - 조회할 개월 수 (기본값: 12)
 * @returns 월별 요약 배열 (오래된 순)
 */
export function generateMockTrend(months: number = 12): MonthlySummary[] {
  const trend: MonthlySummary[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    trend.push(generateMockMonthlySummary(year, month));
  }

  return trend;
}
