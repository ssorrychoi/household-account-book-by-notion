/**
 * API 요청 검증 유틸리티
 * 파라미터 검증 및 에러 처리
 */

/**
 * 연도와 월 파라미터 검증
 * @param year - 연도 (문자열)
 * @param month - 월 (문자열)
 * @returns 검증된 {year, month}
 * @throws Error - 유효하지 않은 파라미터
 */
export function validateYearMonth(
  year: string | null,
  month: string | null
): { year: number; month: number } {
  // 파라미터 확인
  if (!year || !month) {
    throw new Error("year 와 month 파라미터는 필수입니다");
  }

  // 숫자 변환
  const y = parseInt(year, 10);
  const m = parseInt(month, 10);

  // NaN 확인
  if (isNaN(y) || isNaN(m)) {
    throw new Error("year 와 month 는 유효한 숫자여야 합니다");
  }

  // 연도 범위 확인 (1900~2099)
  if (y < 1900 || y > 2099) {
    throw new Error("year 는 1900~2099 범위여야 합니다");
  }

  // 월 범위 확인 (1~12)
  if (m < 1 || m > 12) {
    throw new Error("month 는 1~12 범위여야 합니다");
  }

  return { year: y, month: m };
}

/**
 * 월(months) 파라미터 검증
 * @param months - 조회할 개월 수 (문자열 또는 숫자)
 * @returns 검증된 months 값 (기본값: 12)
 * @throws Error - 유효하지 않은 파라미터
 */
export function validateMonths(months: string | number | null): number {
  // 기본값 설정
  if (!months) {
    return 12;
  }

  // 숫자 변환
  const m = typeof months === "string" ? parseInt(months, 10) : months;

  // NaN 확인
  if (isNaN(m)) {
    throw new Error("months 는 유효한 숫자여야 합니다");
  }

  // 범위 확인 (1~36개월)
  if (m < 1 || m > 36) {
    throw new Error("months 는 1~36 범위여야 합니다");
  }

  return m;
}

/**
 * API 에러 응답 생성
 * @param message - 에러 메시지
 * @param statusCode - HTTP 상태 코드
 * @returns Response 객체
 */
export function createErrorResponse(
  message: string,
  statusCode: number = 400
): Response {
  return Response.json(
    {
      error: message,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}

/**
 * API 성공 응답 생성
 * @param data - 응답 데이터
 * @returns Response 객체
 */
export function createSuccessResponse<T>(data: T): Response {
  return Response.json({
    data,
    cachedAt: new Date().toISOString(),
  });
}
