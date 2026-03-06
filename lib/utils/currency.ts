/**
 * 원화 금액 포맷팅 유틸리티
 * 예: 1234567 → "₩1,234,567"
 */
export function formatKRW(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
}

/**
 * 저축률 포맷팅 (소수점 1자리)
 * 예: 34.4 → "34.4%"
 */
export function formatSavingsRate(rate: number): string {
  return `${rate.toFixed(1)}%`;
}

/**
 * 전월 대비 증감률 계산
 * 반환값: { value: number, isPositive: boolean }
 */
export function calcChangeRate(
  current: number,
  previous: number
): { value: number; isPositive: boolean } {
  if (previous === 0) return { value: 0, isPositive: true };
  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(parseFloat(change.toFixed(1))),
    isPositive: change >= 0,
  };
}
