import type { Transaction } from "@/types/transaction";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

/**
 * Notion 페이지 응답 → Transaction 타입 변환
 *
 * Notion DB 필드명 매핑:
 *   항목       → title
 *   날짜       → date
 *   금액       → amount
 *   유형       → type (수입 | 지출 | 저축)
 *   카테고리   → category
 *   메모       → memo
 *   결제수단   → paymentMethod
 *
 * 필드명이 다를 경우 아래 FIELD_MAP을 수정하세요.
 */
const FIELD_MAP = {
  title: "항목",
  date: "날짜",
  amount: "금액",
  type: "유형",
  category: "카테고리",
  memo: "메모",
  paymentMethod: "결제수단",
} as const;

function extractText(
  property: PageObjectResponse["properties"][string],
): string {
  if (property.type === "title") {
    return property.title.map((t) => t.plain_text).join("");
  }
  if (property.type === "rich_text") {
    return property.rich_text.map((t) => t.plain_text).join("");
  }
  return "";
}

function extractSelect(
  property: PageObjectResponse["properties"][string],
): string {
  if (property.type === "select") {
    return property.select?.name ?? "";
  }
  return "";
}

function extractNumber(
  property: PageObjectResponse["properties"][string],
): number {
  if (property.type === "number") {
    return property.number ?? 0;
  }
  return 0;
}

function extractDate(
  property: PageObjectResponse["properties"][string],
): string {
  if (property.type === "date") {
    return property.date?.start ?? "";
  }
  return "";
}

/**
 * Notion 페이지를 Transaction으로 파싱
 * 유효하지 않은 데이터는 null 반환
 */
export function parsePage(page: PageObjectResponse): Transaction | null {
  const props = page.properties;

  const title = extractText(props[FIELD_MAP.title]);
  const date = extractDate(props[FIELD_MAP.date]);
  const amount = extractNumber(props[FIELD_MAP.amount]);
  const typeRaw = extractSelect(props[FIELD_MAP.type]);
  const category = extractSelect(props[FIELD_MAP.category]);
  const memo = extractText(props[FIELD_MAP.memo]) || null;
  const paymentMethod = extractSelect(props[FIELD_MAP.paymentMethod]) || null;

  // 필수 필드 검증
  if (!title || !date || amount <= 0) return null;
  const type =
    typeRaw === "수입"
      ? "income"
      : typeRaw === "지출"
        ? "expense"
        : typeRaw === "저축"
          ? "savings"
          : null;
  if (!type) return null;

  return {
    id: page.id,
    title,
    date,
    amount,
    type,
    category,
    memo,
    paymentMethod,
  };
}

/**
 * 여러 Notion 페이지를 Transaction 배열로 변환
 * 파싱 실패 항목은 자동 제외
 */
export function parsePages(pages: PageObjectResponse[]): Transaction[] {
  return pages.flatMap((page) => {
    const transaction = parsePage(page);
    return transaction ? [transaction] : [];
  });
}
