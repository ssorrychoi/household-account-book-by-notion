# Starter Kit Optimizer Memory

## 프로젝트: Notion 가계부 웹 대시보드

**현재 상태**: MVP 스켈레톤 완성 (빌드 성공)
**PRD 경로**: `.claude/agents/docs/PRD.md`

## 핵심 아키텍처 결정

### @notionhq/client v5 변경사항
- `databases.query` 없음 → `dataSources.query` 사용
- 파라미터: `data_source_id` (databases.query의 `database_id`와 다름)
- 타입: `QueryDataSourceParameters`, `QueryDataSourceResponse`

### 빌드 타임 환경변수 오류 방지
- `lib/notion/client.ts`: 모듈 로드 시 `new Client()` 호출 금지
- Proxy 패턴으로 지연 초기화 (실제 호출 시에만 env 읽음)
- 이유: Next.js 빌드 시 Route Handler를 prerender하면서 모듈 최상위 코드 실행

### TypeScript strict 모드 주의사항
- `while` 루프 내 `const`는 순환 참조 추론 오류 없음 (do-while은 발생)
- `@notionhq/client/build/src/api-endpoints` 타입 임포트 경로 정상 작동

## 디렉토리 구조 (생성 완료)

```
app/(dashboard)/layout.tsx, page.tsx   # 메인 대시보드
app/transactions/page.tsx              # 거래 내역
app/api/*/route.ts                     # 4개 API 엔드포인트
components/dashboard/*.tsx             # SummaryCards, CategoryChart, MonthlyTrendChart, MonthSelector
components/transactions/*.tsx          # TransactionTable, TransactionFilters
lib/notion/client.ts, queries.ts, parser.ts
lib/utils/currency.ts, date.ts
types/transaction.ts
store/transactionStore.ts
```

## 설치된 추가 의존성
- `@notionhq/client@5.11.0`
- `recharts@3.7.0`
- shadcn/ui: `table`, `select`, `input` 추가 설치

## 파싱 주의사항
- `lib/notion/parser.ts`의 `FIELD_MAP`에서 Notion 필드명 매핑
- 필드명이 DB와 다르면 파싱 실패 → null 반환 (자동 제외)
