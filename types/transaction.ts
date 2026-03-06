/** Notion DB에서 파싱한 단일 거래 데이터 */
export interface Transaction {
  id: string;
  title: string;        // 항목명
  date: string;         // ISO 날짜 문자열 (YYYY-MM-DD)
  amount: number;       // 거래 금액 (항상 양수)
  type: "income" | "expense" | "savings";
  category: string;     // 카테고리명
  memo: string | null;
  paymentMethod: string | null;
}

/** 월별 집계 요약 데이터 */
export interface MonthlySummary {
  year: number;
  month: number;        // 1~12
  totalIncome: number;
  totalExpense: number;
  balance: number;      // totalIncome - totalExpense
  savingsRate: number;  // (balance / totalIncome) * 100, 소수점 1자리
}

/** 카테고리별 지출 집계 */
export interface CategorySummary {
  category: string;
  amount: number;
  ratio: number;        // 전체 지출 대비 비율 (0~100)
  color: string;        // 차트용 색상 hex
}

/** API 응답 래퍼 */
export interface ApiResponse<T> {
  data: T;
  cachedAt: string;     // ISO timestamp
  error?: string;
}
