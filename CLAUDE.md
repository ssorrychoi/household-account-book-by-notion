# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트

**Notion 가계부 웹 대시보드** — Notion 가계부 데이터를 웹에서 시각화하는 대시보드 (v1.0.0-MVP)
PRD: `.claude/agents/docs/PRD.md`

## 명령어

```bash
# 개발 서버 (localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# ESLint 검사
npm run lint

# shadcn/ui 컴포넌트 추가
npx shadcn@latest add <component-name>

# Notion 의존성 설치 (최초 1회)
npm install @notionhq/client recharts
```

> 참고: webpack 모드로 실행 중 (`--webpack` 플래그). 테스트 프레임워크는 현재 설정되지 않았다.

## 환경 설정

`.env.example`을 복사하여 `.env.local`을 만들고 Notion API Key 및 DB ID를 입력해야 한다:

```bash
cp .env.example .env.local
```

**필수 환경변수**:
- `NOTION_API_KEY` — Notion Integration Secret
- `NOTION_DATABASE_ID` — 가계부 Notion 데이터베이스 ID

> 보안: 두 환경변수는 서버 전용이며 `NEXT_PUBLIC_` 접두사 사용 절대 금지.

## 아키텍처

### 기술 스택

- **Next.js 16** + App Router (webpack 모드)
- **React 19** (Server Components 지원)
- **TypeScript** strict 모드 (경로 별칭: `@/*` → 프로젝트 루트)
- **TailwindCSS v4** — CSS-first 방식으로 `tailwind.config.js` 파일 없음. 모든 테마 설정은 `app/globals.css`의 `@theme` 블록에서 관리
- **shadcn/ui** — Radix UI 기반 헤드리스 컴포넌트, `components/ui/`에 위치
- **Zustand** — 거래 내역 필터/정렬 클라이언트 상태 관리 (`store/transactionStore.ts`)
- **@notionhq/client** — Notion API 클라이언트 (서버 전용)
- **Recharts** — 차트 라이브러리 (도넛, 바 차트)

### 디렉토리 구조

```
app/
  (dashboard)/
    layout.tsx          # 대시보드 레이아웃
    page.tsx            # 메인 대시보드 (/)
  transactions/
    page.tsx            # 거래 내역 목록 (/transactions)
  api/
    transactions/route.ts       # GET /api/transactions
    summary/route.ts            # GET /api/summary
    chart/category/route.ts     # GET /api/chart/category
    chart/monthly-trend/route.ts # GET /api/chart/monthly-trend
  layout.tsx            # 루트 레이아웃 (Geist 폰트, lang="ko")
  globals.css           # TailwindCSS v4 @theme, CSS 변수

components/
  dashboard/
    SummaryCards.tsx    # 요약 카드 4개 (수입/지출/잔액/저축률)
    CategoryChart.tsx   # 카테고리별 지출 도넛 차트
    MonthlyTrendChart.tsx # 월별 수입/지출 추이 바 차트
    MonthSelector.tsx   # 월 선택 드롭다운
  transactions/
    TransactionTable.tsx  # 거래 내역 테이블
    TransactionFilters.tsx # 필터 (유형/카테고리/검색)
  ui/                   # shadcn/ui 컴포넌트 (수정하지 말 것, CLI로 관리)

lib/
  notion/
    client.ts           # Notion 클라이언트 싱글톤
    queries.ts          # DB 쿼리 함수 (React cache() 적용)
    parser.ts           # Notion 응답 → TypeScript 타입 변환
  utils/
    currency.ts         # 원화 포맷팅 (formatKRW, formatSavingsRate)
    date.ts             # 날짜 유틸 (getCurrentYearMonth, getMonthRange 등)
  utils.ts              # cn() 유틸 (clsx + tailwind-merge)

types/
  transaction.ts        # 공유 TypeScript 인터페이스

store/
  transactionStore.ts   # Zustand 스토어 (필터/정렬 상태)
```

### Notion 데이터 모델

Notion DB 필드명 (정확히 일치해야 함):

| 필드명 | Notion 타입 | 설명 |
|--------|------------|------|
| 항목 | Title | 거래 항목명 |
| 날짜 | Date | 거래 발생 날짜 |
| 금액 | Number | 거래 금액 (양수) |
| 유형 | Select | "수입" 또는 "지출" |
| 카테고리 | Select | 식비, 교통 등 |
| 메모 | Text | 부가 설명 (선택) |
| 결제수단 | Select | 현금, 카드 등 (선택) |

필드명 변경 시 `lib/notion/parser.ts`의 `FIELD_MAP`을 수정할 것.

### API 캐싱 전략

- `/api/transactions`, `/api/summary`, `/api/chart/category` — `revalidate: 300` (5분 ISR)
- `/api/chart/monthly-trend` — `revalidate: 3600` (1시간)
- Notion 쿼리는 `React cache()`로 중복 제거 (Deduplication)

### TailwindCSS v4 주의사항

- `tailwind.config.js`가 없다 — 커스텀 토큰은 `app/globals.css`의 `@theme {}` 블록에 추가
- 다크모드는 `.dark` 클래스 기반 (CSS 변수 오버라이드 방식)
- 색상은 OKLch 색공간 사용 (`oklch(...)`)

### 컴포넌트 패턴

shadcn/ui 컴포넌트는 `cn()` 유틸과 `class-variance-authority(cva)`를 함께 사용한다:

```typescript
import { cn } from "@/lib/utils"

// 조건부 클래스 병합
<div className={cn("base-class", condition && "conditional-class", className)} />
```

### 현재 설치된 shadcn/ui 컴포넌트

`avatar`, `badge`, `button`, `card`, `dropdown-menu`, `input`, `scroll-area`, `select`, `separator`, `sheet`, `skeleton`, `table`, `tooltip`
