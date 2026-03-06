import { Client } from "@notionhq/client";

/**
 * Notion 클라이언트 싱글톤 (지연 초기화)
 * NOTION_API_KEY 환경변수 필수 (서버 전용, NEXT_PUBLIC_ 금지)
 * 빌드 타임이 아닌 실제 API 호출 시에만 환경변수를 읽음
 */
let _notion: Client | null = null;

export function getNotionClient(): Client {
  if (!_notion) {
    const apiKey = process.env.NOTION_API_KEY;
    if (!apiKey) {
      throw new Error(
        "NOTION_API_KEY 환경변수가 설정되지 않았습니다. .env.local 파일을 확인하세요."
      );
    }
    _notion = new Client({ auth: apiKey });
  }
  return _notion;
}

/** Notion 가계부 데이터베이스 ID */
export function getDatabaseId(): string {
  const dbId = process.env.NOTION_DATABASE_ID;
  if (!dbId) {
    throw new Error(
      "NOTION_DATABASE_ID 환경변수가 설정되지 않았습니다. .env.local 파일을 확인하세요."
    );
  }
  return dbId;
}

// 하위 호환성을 위한 named export (실제 호출 시 초기화)
export const notion = new Proxy({} as Client, {
  get(_target, prop) {
    return getNotionClient()[prop as keyof Client];
  },
});
