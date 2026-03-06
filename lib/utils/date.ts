/**
 * 날짜 유틸리티
 */

/**
 * 현재 연도와 월 반환
 */
export function getCurrentYearMonth(): { year: number; month: number } {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

/**
 * 특정 월의 시작일 / 종료일 반환 (ISO 문자열)
 */
export function getMonthRange(
  year: number,
  month: number
): { start: string; end: string } {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0); // 해당 월의 마지막 날
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

/**
 * 최근 N개월의 연도/월 배열 반환 (오래된 순)
 * 예: getRecentMonths(3) → [{ year: 2025, month: 12 }, { year: 2026, month: 1 }, ...]
 */
export function getRecentMonths(
  n: number
): Array<{ year: number; month: number }> {
  const now = new Date();
  const result: Array<{ year: number; month: number }> = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({ year: date.getFullYear(), month: date.getMonth() + 1 });
  }
  return result;
}

/**
 * 연/월을 레이블 문자열로 변환
 * 예: formatMonthLabel(2026, 3) → "2026.03"
 */
export function formatMonthLabel(year: number, month: number): string {
  return `${year}.${String(month).padStart(2, "0")}`;
}
