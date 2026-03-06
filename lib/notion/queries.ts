import { getMonthRange } from "@/lib/utils/date";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { cache } from "react";
import { getDatabaseId, notion } from "./client";

/**
 * 특정 월의 Notion 가계부 페이지 목록 조회
 * @notionhq/client v5: dataSources.query 사용 (data_source_id 파라미터)
 * React cache()로 중복 호출 제거 (Deduplication)
 * revalidate는 각 Route Handler에서 설정
 */
export const fetchTransactionPages = cache(
  async (year: number, month: number): Promise<PageObjectResponse[]> => {
    const databaseId = getDatabaseId();
    const { start, end } = getMonthRange(year, month);
    const allPages: PageObjectResponse[] = [];
    let hasMore = true;
    let cursor: string | undefined = undefined;

    // has_more 처리로 100건 이상 데이터 수집
    while (hasMore) {
      const queryResult = await notion.databases.query({
        database_id: databaseId,
        filter: {
          and: [
            { property: "날짜", date: { on_or_after: start } },
            { property: "날짜", date: { on_or_before: end } },
          ],
        },
        sorts: [{ property: "날짜", direction: "descending" }],
        ...(cursor ? { start_cursor: cursor } : {}),
        page_size: 100,
      });

      allPages.push(
        ...queryResult.results.filter(
          (r): r is PageObjectResponse =>
            r.object === "page" && "properties" in r,
        ),
      );

      hasMore = queryResult.has_more;
      cursor = queryResult.next_cursor ?? undefined;
    }

    // 날짜 범위 클라이언트 측 필터 (datetime 형식 대응: "2026-03-31T14:30:00+09:00" → "2026-03-31")
    return allPages.filter((page) => {
      const dateProperty = page.properties["날짜"];
      if (dateProperty?.type !== "date" || !dateProperty.date?.start)
        return false;
      const date = dateProperty.date.start.split("T")[0];
      return date >= start && date <= end;
    });
  },
);
