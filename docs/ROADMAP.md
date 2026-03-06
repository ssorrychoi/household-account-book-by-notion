# ROADMAP — Notion 가계부 웹 대시보드 v1.0.0-MVP

> **프로젝트명**: Notion 가계부 웹 대시보드
> **버전**: v1.0.0-MVP
> **상태**: 개발 계획 수립 완료
> **최종 수정**: 2026-03-02

---

## 📋 목차

1. [개요](#개요)
2. [Phase 1: 애플리케이션 골격 구축](#phase-1-애플리케이션-골격-구축)
3. [Phase 2: UI/UX 완성 (더미 데이터)](#phase-2-uiux-완성-더미-데이터)
4. [Phase 3: 핵심 기능 구현](#phase-3-핵심-기능-구현)
5. [Phase 4: 최적화 및 배포](#phase-4-최적화-및-배포)
6. [Task 상세 정의](#task-상세-정의)
7. [개발 일정 및 리소스](#개발-일정-및-리소스)

---

## 개요

### 개발 방법론: 구조 우선 접근법 (Structure-First Approach)

이 프로젝트는 4개 Phase로 나뉘어 진행됩니다:


| Phase       | 목표         | 기간     | 초점                      |
| ----------- | ---------- | ------ | ----------------------- |
| **Phase 1** | 애플리케이션 골격  | 2.5일   | 라우팅, 타입, API 스켈레톤       |
| **Phase 2** | UI/UX 완성   | 5일     | 모든 페이지 UI 완성 (더미 데이터)   |
| **Phase 3** | 핵심 기능      | 6.5일   | Notion API 연동 & 데이터 바인딩 |
| **Phase 4** | 최적화 & 배포   | 3.5일   | 성능, 에러 처리, 배포           |
| **총 예상 기간** | **MVP 완성** | **3주** | 프로덕션 레디                 |


### 현재 완료된 작업 (초기화 완료)

✅ **이미 생성된 항목들**:

- 디렉토리 구조 (app/, components/, lib/, types/, store/)
- TypeScript 인터페이스 (types/transaction.ts)
- Notion 클라이언트 (lib/notion/client.ts, parser.ts, queries.ts)
- Zustand 스토어 (store/transactionStore.ts)
- API 라우트 스켈레톤 (app/api/**/route.ts)
- 컴포넌트 스켈레톤 (components/dashboard/*, components/transactions/*)

✅ **프로젝트 구조**:

```
next-js-starterkit/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx        # 대시보드 레이아웃 [스켈레톤]
│   │   └── page.tsx          # 메인 대시보드 [스켈레톤]
│   ├── transactions/
│   │   └── page.tsx          # 거래 내역 목록 [스켈레톤]
│   ├── api/
│   │   ├── transactions/
│   │   │   └── route.ts      # 거래 내역 API [스켈레톤]
│   │   ├── summary/
│   │   │   └── route.ts      # 요약 통계 API [스켈레톤]
│   │   └── chart/
│   │       ├── category/
│   │       │   └── route.ts  # 카테고리 차트 API [스켈레톤]
│   │       └── monthly-trend/
│   │           └── route.ts  # 월별 추이 API [스켈레톤]
│   ├── layout.tsx            # 루트 레이아웃
│   └── globals.css           # TailwindCSS v4 설정
│
├── components/
│   ├── dashboard/            # 대시보드 컴포넌트들 [스켈레톤]
│   │   ├── SummaryCards.tsx
│   │   ├── CategoryChart.tsx
│   │   ├── MonthlyTrendChart.tsx
│   │   └── MonthSelector.tsx
│   ├── transactions/         # 거래 테이블 컴포넌트들 [스켈레톤]
│   │   ├── TransactionTable.tsx
│   │   └── TransactionFilters.tsx
│   └── ui/                   # shadcn/ui 컴포넌트 (자동 생성)
│
├── lib/
│   ├── notion/
│   │   ├── client.ts         # Notion API 클라이언트 ✅ 완료
│   │   ├── parser.ts         # Notion 데이터 파싱 ✅ 완료
│   │   └── queries.ts        # DB 쿼리 함수 ✅ 완료
│   ├── utils/
│   │   ├── currency.ts       # 원화 포맷팅 [필요]
│   │   └── date.ts           # 날짜 유틸 [필요]
│   └── utils.ts
│
├── types/
│   └── transaction.ts        # TypeScript 인터페이스 ✅ 완료
│
├── store/
│   └── transactionStore.ts   # Zustand 상태 관리 ✅ 완료
│
├── docs/
│   ├── PRD.md                # 요구사항 정의서 ✅ 완료
│   ├── ROADMAP.md            # 이 파일
│   └── IMPLEMENTATION.md      # 구현 가이드 [Phase 1에서 생성]
│
└── package.json
```

---

## Phase 1: 애플리케이션 골격 구축

**기간**: 2.5일 | **산출물**: 라우팅, API 스켈레톤, 유틸 함수
**목표**: 애플리케이션의 기본 구조를 완성하고 API 엔드포인트 구현을 준비한다.

### Task 001: 유틸 함수 구현 (currency, date formatting) — 우선순위: 🔴 High

**설명**: 원화 포맷팅, 날짜 변환, 통화 표시 등 전역에서 사용할 유틸 함수 구현

**구현 사항**:

- ✓ `lib/utils/currency.ts` 생성 — 원화 포맷팅 함수
  - `formatCurrency(amount: number): string` — ₩1,234,567 형식
  - `parseCurrency(str: string): number` — "₩1,234,567" → 1234567
  - `getCurrencySymbol(): string` — "₩" 반환
- ✓ `lib/utils/date.ts` 생성 — 날짜 유틸 함수
  - `formatDate(date: string | Date): string` — "2026-03-02" → "2026년 3월 2일"
  - `formatMonthYear(year: number, month: number): string` — "2026년 3월"
  - `getMonthRange(year: number, month: number): { start: Date, end: Date }`
  - `getLastNMonths(n: number): Array<{year: number, month: number}>`
- ✓ `lib/utils/aggregate.ts` 생성 — 데이터 집계 함수
  - `aggregateByMonth(transactions: Transaction[]): MonthlySummary[]`
  - `aggregateByCategory(transactions: Transaction[]): CategorySummary[]`
  - `calculateSavingsRate(income: number, expense: number): number`

**기술 스택**: TypeScript, Intl API (Internationalization)

**완료 기준**:

- 모든 함수 구현 완료
- 단위 테스트 작성 (선택사항)
- 타입 정의 완벽 (any 금지)

**참조**: See: PRD 섹션 3.2 (TypeScript 인터페이스), PRD 섹션 4 (API 설계)

---

### Task 002: 레이아웃 컴포넌트 구조 완성 — 우선순위: 🔴 High

**설명**: 루트 레이아웃, 대시보드 레이아웃, 공통 헤더/푸터 등 기본 레이아웃 구성

**구현 사항**:

- ✓ `app/layout.tsx` 검증 및 메타데이터 설정
  - lang 속성 "ko" 확인
  - 메타데이터 (title, description, og tags)
  - Geist 폰트 로드
- ✓ `app/(dashboard)/layout.tsx` 생성 — 대시보드 공통 레이아웃
  - 헤더 (로고, 타이틀, 월 선택 드롭다운)
  - 네비게이션 (대시보드/거래내역 탭)
  - 사이드바 또는 헤더 네비게이션
  - TailwindCSS 기본 스타일 적용
- ✓ `components/layout/Header.tsx` 생성 — 헤더 컴포넌트
  - 로고 및 타이틀 ("💰 Notion 가계부")
  - 월 선택 Select 컴포넌트 통합 (TODO: MonthSelector로 연결)
  - 반응형 디자인 (모바일 메뉴 아이콘)
- ✓ `components/layout/Navigation.tsx` 생성 (선택사항)
  - 탭 기반 네비게이션 (대시보드/거래내역)
  - active 상태 하이라이트
- ✓ `app/globals.css` 검증
  - TailwindCSS v4 `@theme` 블록 설정 확인
  - 다크모드 CSS 변수 설정
  - 기본 색상 팔레트 정의

**기술 스택**: Next.js 16 (App Router), React 19, TailwindCSS v4, shadcn/ui

**완료 기준**:

- 레이아웃 구조 완성, 페이지 네비게이션 작동
- 타입 안전성 확보
- 모바일/태블릿/데스크톱 반응형 확인

**참조**: See: PRD 섹션 5.1 (UI/UX Spec), CLAUDE.md (TailwindCSS v4 주의사항)

---

### Task 003: API 라우트 핸들러 틀 작성 — 우선순위: 🔴 High

**설명**: 4개 API 엔드포인트의 기본 틀 및 에러 처리 구조 작성

**구현 사항**:

- ✓ `app/api/transactions/route.ts` 틀 작성
  - 요청 검증: year, month 파라미터 검증
  - 캐싱 설정: `revalidate: 300`
  - 에러 처리 구조 (400, 500 상태코드)
  - 응답 구조: `ApiResponse<Transaction[]>`
  - 실제 구현은 Phase 3에서 진행
- ✓ `app/api/summary/route.ts` 틀 작성
  - 요청 검증: year, month 파라미터
  - 캐싱 설정: `revalidate: 300`
  - 응답 구조: `ApiResponse<{current, previous}>`
- ✓ `app/api/chart/category/route.ts` 틀 작성
  - 요청 검증: year, month 파라미터
  - 응답 구조: `ApiResponse<CategorySummary[]>`
- ✓ `app/api/chart/monthly-trend/route.ts` 틀 작성
  - 요청 검증: months 파라미터 (선택, 기본 12)
  - 캐싱 설정: `revalidate: 3600` (1시간)
  - 응답 구조: `ApiResponse<MonthlySummary[]>`
- ✓ `lib/api/validation.ts` 생성 — API 요청 검증 유틸
  - `validateYearMonth(year: any, month: any): {year: number, month: number}`
  - `validateMonths(months: any): number`
  - 에러 메시지 표준화

**기술 스택**: Next.js 16 Route Handlers, TypeScript, fetch 캐싱

**완료 기준**:

- 모든 API 라우트 틀 작성 완료
- 요청 검증 로직 구현
- 타입 안전성 확보 (any 금지)
- Postman 또는 curl로 엔드포인트 구조 검증

**참조**: See: PRD 섹션 4 (API 설계), CLAUDE.md (Next.js 16 환경 설정)

---

### Task 004: 더미 데이터 제너레이터 생성 — 우선순위: 🔴 High

**설명**: Phase 2 UI 작업 중 사용할 더미 데이터 생성 함수

**구현 사항**:

- ✓ `lib/mock/data.ts` 생성 — 더미 데이터 생성
  - `generateMockTransactions(year: number, month: number): Transaction[]`
    - 30~50개의 랜덤 거래 내역 생성
    - 카테고리: 식비, 교통, 문화, 의료, 급여, 기타 (최소 6개)
    - 날짜 범위: 해당 월의 첫날~마지막날
    - 유형: 수입/지출 혼합
    - 금액 범위: 1,000~5,000,000원
  - `generateMockMonthlySummary(year: number, month: number): MonthlySummary`
    - 월별 수입/지출/잔액/저축률 계산
  - `generateMockCategorySummary(transactions: Transaction[]): CategorySummary[]`
    - 카테고리별 지출 집계
  - `generateMockTrend(months: number): MonthlySummary[]`
    - 최근 N개월 월별 추이 데이터
  - Color 팔레트 정의 (최소 8색)
    ```typescript
    const CATEGORY_COLORS = {
      '식비': '#ef4444',
      '교통': '#f97316',
      '문화': '#eab308',
      '의료': '#22c55e',
      '급여': '#3b82f6',
      '기타': '#8b5cf6',
    };
    ```

**기술 스택**: TypeScript, 난수 생성, 날짜 계산

**완료 기준**:

- 더미 데이터 생성 함수 완성
- 데이터 일관성 검증 (수입/지출 금액 > 0 등)
- Phase 2에서 즉시 사용 가능

**참조**: See: PRD 섹션 3.2 (TypeScript 인터페이스)

---

## Phase 2: UI/UX 완성 (더미 데이터)

**기간**: 5일 | **산출물**: 모든 페이지 UI 완성, 더미 데이터 바인딩
**목표**: 사용자 인터페이스를 완성하고 모든 상호작용 기능을 더미 데이터로 테스트한다.

### Task 005: 대시보드 요약 카드 컴포넌트 구현 — 우선순위: 🔴 High

**설명**: 월별 수입/지출/잔액/저축률 4개 카드 UI 구현

**구현 사항**:

- ✓ `components/dashboard/SummaryCards.tsx` 구현
  - Props 인터페이스:
    ```typescript
    interface SummaryCardsProps {
      current: MonthlySummary;
      previous?: MonthlySummary;
    }
    ```
  - 4개 카드 렌더링:
    1. **총 수입** (초록색 배경)
      - 금액: ₩3,200,000 (formatCurrency 사용)
      - 전월 대비: ↑5% 또는 ↓3%
      - 계산: current.totalIncome vs previous.totalIncome
    2. **총 지출** (빨강색 배경)
      - 금액: ₩2,100,000
      - 전월 대비 증감률
    3. **잔액** (파랑색 배경)
      - 금액: current.balance
      - 전월 대비 증감률
    4. **저축률** (황색/위험 배경)
      - 퍼센트: 34.4%
      - 음수일 경우 빨강색 강조
      - 계산: (balance / totalIncome) * 100
  - shadcn/ui Card 컴포넌트 사용
  - 반응형: 데스크톱 4컬럼, 태블릿 2×2, 모바일 2×2
  - 로딩 상태: Skeleton 로더 (Task 011에서)

**기술 스택**: React 19, shadcn/ui Card, TailwindCSS v4, formatCurrency 함수

**완료 기준**:

- 4개 카드 모두 정상 렌더링
- 금액 포맷팅 정확
- 전월 대비 증감률 표시
- 반응형 레이아웃 검증
- 더미 데이터로 시각적 테스트 완료

**참조**: See: PRD 섹션 2 (Feature 2), PRD 섹션 5.1 (UI/UX Spec)

---

### Task 006: 카테고리별 지출 도넛 차트 구현 — 우선순위: 🔴 High

**설명**: Recharts PieChart를 활용한 카테고리별 지출 시각화

**구현 사항**:

- ✓ `components/dashboard/CategoryChart.tsx` 구현
  - Props 인터페이스:
    ```typescript
    interface CategoryChartProps {
      data: CategorySummary[];
      loading?: boolean;
    }
    ```
  - shadcn/ui Chart 컴포넌트 사용 (Recharts 래퍼)
  - PieChart (Donut 스타일):
    - 최대 8개 카테고리 표시
    - 9번째 이상은 "기타"로 묶음
    - 각 슬라이스에 카테고리명, 금액, 비율(%) 표시
    - 마우스 호버 시 툴팁 (카테고리, 금액, 비율)
  - Legend (범례):
    - 우측 또는 하단 표시
    - 컬러 박스 + 카테고리명 + 비율%
  - 데이터 없음 처리:
    - "이번 달 지출 내역이 없습니다" 메시지
  - 색상 팔레트:
    - lib/mock/data.ts의 CATEGORY_COLORS 사용
    - 차트에 직접 적용

**기술 스택**: React 19, Recharts PieChart, shadcn/ui Chart, TailwindCSS v4

**완료 기준**:

- 도넛 차트 정상 렌더링
- 호버 시 툴팁 작동
- 범례 표시
- 8개 초과 카테고리 "기타" 처리
- 더미 데이터로 시각적 테스트 완료

**참조**: See: PRD 섹션 2 (Feature 3), Recharts 공식 문서

---

### Task 007: 월별 수입/지출 추이 바 차트 구현 — 우선순위: 🔴 High

**설명**: Recharts BarChart를 활용한 최근 12개월 추이 시각화

**구현 사항**:

- ✓ `components/dashboard/MonthlyTrendChart.tsx` 구현
  - Props 인터페이스:
    ```typescript
    interface MonthlyTrendChartProps {
      data: MonthlySummary[];
      loading?: boolean;
    }
    ```
  - BarChart (Grouped Bar):
    - X축: 월 레이블 (예: "2025.03", "2025.04", ..., "2026.02")
    - Y축: 금액 (원화, formatCurrency로 변환)
    - 초록 바: 수입 (totalIncome)
    - 빨강 바: 지출 (totalExpense)
    - 12개월 데이터 표시 (데이터 없는 월은 0)
    - 마우스 호버 시 툴팁: 월, 수입, 지출, 잔액
  - ResponsiveContainer로 반응형 처리
  - 모바일에서 가로 스크롤 가능하게 설정
  - 범례: 우측 상단 ("수입", "지출")

**기술 스택**: React 19, Recharts BarChart + ResponsiveContainer, TailwindCSS v4

**완료 기준**:

- 바 차트 정상 렌더링 (최소 12개월)
- X축/Y축 레이블 정상 표시
- 호버 시 툴팁 작동
- 모바일 가로 스크롤 작동
- 더미 데이터로 시각적 테스트 완료

**참조**: See: PRD 섹션 2 (Feature 4), Recharts 공식 문서

---

### Task 008: 거래 내역 테이블 UI 구현 — 우선순위: 🔴 High

**설명**: shadcn/ui Table을 사용한 거래 내역 목록 표시

**구현 사항**:

- ✓ `components/transactions/TransactionTable.tsx` 구현
  - Props 인터페이스:
    ```typescript
    interface TransactionTableProps {
      transactions: Transaction[];
      pageIndex: number;
      onPageChange: (index: number) => void;
      onSort: (column: string, direction: 'asc' | 'desc') => void;
    }
    ```
  - shadcn/ui Table 컴포넌트 사용
  - 컬럼:
    1. **날짜** (날짜 정렬 가능, 기본 내림차순)
    2. **항목명** (거래 설명)
    3. **카테고리** (Badge로 스타일링)
    4. **유형** (수입/지출, Badge 색상 구분)
    5. **금액** (오른쪽 정렬, formatCurrency 사용, 금액 정렬 가능)
  - 페이지네이션:
    - 한 페이지 최대 50건
    - 페이지 번호 또는 [이전] [다음] 버튼
    - 현재 페이지 표시 (예: "1 / 3")
  - 테이블 하단 합계:
    - 필터된 결과의 총 수입, 총 지출 표시
  - 정렬:
    - 헤더 클릭 시 정렬 (날짜, 금액)
    - 상향/하향 화살표 표시

**기술 스택**: React 19, shadcn/ui Table, TailwindCSS v4

**완료 기준**:

- 테이블 정상 렌더링
- 페이지네이션 작동
- 정렬 기능 작동 (클라이언트 사이드)
- 합계 표시
- 더미 데이터로 완전 테스트

**참조**: See: PRD 섹션 2 (Feature 5), PRD 섹션 5.2 (거래 내역 목록 UI)

---

### Task 009: 월 선택 드롭다운 컴포넌트 — 우선순위: 🟡 Medium

**설명**: 최근 12개월 중 원하는 월을 선택하는 Select 컴포넌트

**구현 사항**:

- ✓ `components/dashboard/MonthSelector.tsx` 구현
  - Props 인터페이스:
    ```typescript
    interface MonthSelectorProps {
      value: { year: number; month: number };
      onChange: (year: number, month: number) => void;
      disabled?: boolean;
    }
    ```
  - shadcn/ui Select 컴포넌트 사용
  - 옵션: 현재 월 기준 과거 12개월
    - 2025.12, 2025.11, ..., 2025.01
    - 또는 연도별 그룹핑 가능
  - 기본값: 현재 월
  - 선택 시 콜백: onChange(year, month) 호출
  - 헤더에 표시 형식: "2026년 3월" 또는 "Mar 2026"

**기술 스택**: React 19, shadcn/ui Select, date 유틸

**완료 기준**:

- Select 드롭다운 작동
- 옵션 목록 정확 (최근 12개월)
- 선택 시 콜백 호출
- 현재 월 기본값

**참조**: See: PRD 섹션 2 (Feature 2)

---

### Task 010: 거래 내역 필터 컴포넌트 — 우선순위: 🟡 Medium

**설명**: 카테고리, 유형, 검색 필터링 UI

**구현 사항**:

- ✓ `components/transactions/TransactionFilters.tsx` 구현
  - Props 인터페이스:
    ```typescript
    interface TransactionFiltersProps {
      onFilter: (filters: {
        type?: 'income' | 'expense';
        categories?: string[];
        searchTerm?: string;
      }) => void;
    }
    ```
  - **유형 필터** (Tabs 또는 ButtonGroup):
    - "전체" (기본)
    - "수입"
    - "지출"
  - **카테고리 필터** (Multi-Select 또는 Checkbox):
    - shadcn/ui Select (다중 선택)
    - 전체 카테고리 옵션
  - **검색 필터** (Input):
    - 항목명 기반 텍스트 검색
    - 입력 시 useTransition으로 디바운스 처리 (300ms)
  - 필터 제거 버튼 (선택사항):
    - "필터 초기화" 또는 X 버튼
  - 필터 적용 시 onFilter 콜백 호출

**기술 스택**: React 19, shadcn/ui Select/Tabs, useTransition, TailwindCSS v4

**완료 기준**:

- 모든 필터 UI 렌더링
- 필터 상태 변경 시 콜백 호출
- 검색 디바운스 작동
- 더미 데이터로 필터링 시뮬레이션

**참조**: See: PRD 섹션 2 (Feature 5)

---

### Task 011: 로딩 상태 및 Skeleton 컴포넌트 — 우선순위: 🟡 Medium

**설명**: 데이터 로딩 중 표시할 Skeleton 로더 구현

**구현 사항**:

- ✓ `components/dashboard/SummaryCardsSkeleton.tsx` 생성
  - SummaryCards와 동일한 레이아웃
  - Skeleton 로더 4개 배치
- ✓ `components/dashboard/ChartSkeleton.tsx` 생성
  - 차트 영역의 Skeleton 로더
- ✓ `components/transactions/TransactionTableSkeleton.tsx` 생성
  - 테이블 헤더 + 행 Skeleton 로더 (10행)
- ✓ shadcn/ui Skeleton 컴포넌트 활용
  - 기본 `<Skeleton />` 컴포넌트 추가 (없으면)
  - 또는 `npm install lucide-react` 후 수동 구현

**기술 스택**: React 19, shadcn/ui Skeleton, TailwindCSS v4

**완료 기준**:

- 모든 Skeleton 컴포넌트 생성
- 로딩 상태에서 정상 표시
- Phase 3에서 Suspense와 연동

**참조**: See: shadcn/ui Skeleton 컴포넌트 문서

---

### Task 012: 메인 대시보드 페이지 통합 — 우선순위: 🔴 High

**설명**: 모든 컴포넌트를 메인 대시보드 페이지에 통합

**구현 사항**:

- ✓ `app/(dashboard)/page.tsx` 구현
  - 레이아웃:
    - 헤더 (Header 컴포넌트 + MonthSelector)
    - 4개 SummaryCards (더미 데이터)
    - 2개 차트 (CategoryChart + MonthlyTrendChart) — 좌우 분할
    - 거래 내역 테이블 (거래 테이블 상단)
  - 더미 데이터 로드:
    ```typescript
    const transactions = generateMockTransactions(year, month);
    const summary = generateMockMonthlySummary(year, month);
    const categoryData = generateMockCategorySummary(transactions);
    const trendData = generateMockTrend(12);
    ```
  - 월 선택 드롭다운:
    - MonthSelector 상태 관리 (useState 또는 URL query)
    - 월 변경 시 데이터 다시 로드
  - 반응형:
    - 데스크톱: 4컬럼 카드 + 2컬럼 차트 + 풀 너비 테이블
    - 태블릿: 2×2 카드 + 세로 차트 + 테이블
    - 모바일: 2×2 카드 + 세로 차트 + 스크롤 테이블

**기술 스택**: Next.js 16 (App Router), React 19, TailwindCSS v4

**완료 기준**:

- 모든 컴포넌트 통합
- 더미 데이터 정상 표시
- 월 선택 드롭다운 작동
- 반응형 레이아웃 검증 (3가지 기기)

**참조**: See: PRD 섹션 5.1 (UI/UX Spec), Task 005~011

---

### Task 013: 거래 내역 상세 페이지 구현 — 우선순위: 🟡 Medium

**설명**: 거래 내역을 더 상세히 보는 페이지 구현

**구현 사항**:

- ✓ `app/transactions/page.tsx` 구현
  - 레이아웃:
    - 헤더 ("거래 내역 — 2026년 3월")
    - 백링크 ("← 대시보드")
    - 필터 영역 (TransactionFilters)
    - 통계 요약 (총 건수, 수입 합계, 지출 합계)
    - 거래 테이블 (TransactionTable)
  - 필터 상태 관리:
    - Zustand (transactionStore) 사용
    - URL query string 연동 (선택사항)
  - 더미 데이터 로드:
    - 현재 월의 거래 내역 (50~100건 이상)
  - 페이지네이션:
    - 한 페이지 50건
    - 다중 페이지 시뮬레이션

**기술 스택**: Next.js 16, React 19, Zustand, TailwindCSS v4

**완료 기준**:

- 거래 내역 페이지 정상 표시
- 필터링 작동 (클라이언트 사이드)
- 페이지네이션 작동
- 더미 데이터로 완전 테스트

**참조**: See: PRD 섹션 5.2 (거래 내역 목록 UI), Task 008~010

---

### Task 014: 다크모드 및 반응형 최종 검증 — 우선순위: 🟡 Medium

**설명**: 다크모드 CSS 변수 검증 및 반응형 디자인 최종 확인

**구현 사항**:

- ✓ 다크모드 테스트:
  - `app/globals.css`의 `.dark` 클래스 확인
  - CSS 변수 오버라이드 확인 (배경, 텍스트, 테두리)
  - 각 컴포넌트에서 다크모드 색상 적용
  - 차트 색상 다크모드 호환성 확인
- ✓ 반응형 검증:
  - 모바일 (375px): 모든 UI 깨짐 없음, 가로 스크롤 작동
  - 태블릿 (768px): 2컬럼 레이아웃 정상
  - 데스크톱 (1024px+): 4컬럼 + 2컬럼 차트
  - 차트 ResponsiveContainer 작동 확인
  - 테이블 스크롤 가능성 확인
- ✓ 접근성 검증:
  - 색상 외 패턴/레이블 병행 (색맹 대비)
  - 차트에 aria-label 추가
  - 키보드 네비게이션 테스트
  - 콘트라스트 비율 검증 (WCAG 2.1 AA)

**기술 스택**: TailwindCSS v4 dark mode, CSS 변수, aria attributes

**완료 기준**:

- 다크모드 정상 작동
- 모든 화면 크기에서 반응형 작동
- 접근성 기본 요구사항 충족
- 브라우저 DevTools 검증 완료

**참조**: See: PRD 섹션 6.4 (반응형), PRD 섹션 6.5 (접근성), CLAUDE.md (TailwindCSS v4)

---

## Phase 3: 핵심 기능 구현

**기간**: 6.5일 | **산출물**: Notion API 연동, 실제 데이터 바인딩
**목표**: Notion 데이터베이스와 웹 애플리케이션을 완전히 연동하고 실시간 데이터를 표시한다.

### Task 015: Notion API 데이터 파싱 및 검증 — 우선순위: 🔴 High

**설명**: Notion API 응답을 TypeScript 인터페이스로 변환하는 파서 완성

**구현 사항**:

- ✓ `lib/notion/parser.ts` 완성 및 테스트
  - `parseTransaction(page: PageObjectResponse): Transaction` 함수
    - Notion 페이지 객체에서 필드 추출
    - 필드 매핑: 항목, 날짜, 금액, 유형, 카테고리, 메모, 결제수단
    - 타입 검증 및 기본값 설정
    - 에러 시 로깅 및 null 반환
  - `validateTransaction(tx: Transaction): boolean` 함수
    - 필수 필드 검증 (title, date, amount, type, category)
    - 데이터 무결성 검증 (금액 > 0, 날짜 유효함, 유형 valid)
  - `parseTransactions(pages: PageObjectResponse[]): Transaction[]` 함수
    - 배치 처리, 필터링, 에러 처리
- ✓ `lib/notion/queries.ts` 완성 및 테스트
  - `fetchTransactionsByMonth(year: number, month: number): Promise<Transaction[]>`
    - Notion DB 쿼리 (날짜 필터)
    - 페이지네이션 처리 (has_more)
    - 캐싱 적용 (React cache())
    - 에러 처리 (API 실패 시 이전 캐시 데이터 반환)
  - `fetchMonthData(year: number, month: number): Promise<{transactions, summary, categoryData}>`
    - 3개월 데이터 한 번에 조회 (성능 최적화)
- ✓ 엣지 케이스 처리:
  - 빈 결과 (해당 월 거래 없음)
  - API 장애 (timeout, 401, 429 등)
  - 필드 누락 (일부 항목이 선택사항)
  - 숫자 포맷 이상 (금액이 문자열 등)

**기술 스택**: TypeScript, @notionhq/client, React cache(), 에러 처리

**완료 기준**:

- 파서 함수 완성 및 타입 안전성 확보
- 실제 Notion DB 데이터로 테스트 완료
- 에러 처리 및 로깅 검증
- 필드 매핑 정확성 검증

**테스트 체크리스트** (Playwright MCP 활용):

```
✓ Notion API에서 실제 거래 데이터 조회
✓ 파서가 Transaction 객체로 정확히 변환
✓ 빈 월 데이터 처리 (에러 아님)
✓ API 에러 시 graceful fallback
✓ 날짜 범위 쿼리 정확성
✓ 페이지네이션 (100+ 거래) 처리
```

**참조**: See: PRD 섹션 3 (Data Model), PRD 섹션 7 (Environment Setup)

---

### Task 016: `/api/transactions` 엔드포인트 구현 — 우선순위: 🔴 High

**설명**: 월별 거래 내역을 반환하는 API 라우트 구현

**구현 사항**:

- ✓ `app/api/transactions/route.ts` 완성
  ```typescript
  export async function GET(request: Request) {
    // 1. 요청 검증 (year, month 파라미터)
    // 2. fetchTransactionsByMonth 호출
    // 3. 캐싱 설정 (revalidate: 300)
    // 4. 응답 반환: ApiResponse<Transaction[]>
    // 5. 에러 처리
  }
  ```
  - 요청 검증: `validateYearMonth` 사용
  - Notion 쿼리: `fetchTransactionsByMonth(year, month)`
  - 정렬: 날짜 기준 내림차순
  - 응답:
    ```typescript
    {
      data: Transaction[],
      cachedAt: "2026-03-02T12:34:56Z"
    }
    ```
  - ISR 캐싱: `revalidate: 300` (5분)
  - 에러 응답:
    - 400: 유효하지 않은 year/month
    - 500: Notion API 호출 실패 (에러 메시지 포함)

**기술 스택**: Next.js 16 Route Handlers, fetch 캐싱, error handling

**완료 기준**:

- API 엔드포인트 작동
- 파라미터 검증 동작
- 캐싱 정상 (5분 TTL)
- curl/Postman 테스트 완료
- 응답 형식 검증

**테스트 체크리스트** (Playwright MCP):

```
✓ GET /api/transactions?year=2026&month=3 → 200, 데이터 반환
✓ 캐시 히트 시 <100ms 응답
✓ 캐시 미스 시 <3초 응답
✓ 유효하지 않은 파라미터 → 400
✓ Notion API 실패 → 500 + 에러 메시지
✓ 빈 월 데이터 → 200, data: []
```

**참조**: See: PRD 섹션 4.1 (API 설계)

---

### Task 017: `/api/summary` 엔드포인트 구현 — 우선순위: 🔴 High

**설명**: 월별 수입/지출/잔액/저축률 요약을 반환하는 API

**구현 사항**:

- ✓ `app/api/summary/route.ts` 완성
  ```typescript
  export async function GET(request: Request) {
    // 1. 요청 검증
    // 2. fetchTransactionsByMonth로 거래 데이터 조회
    // 3. aggregateByMonth로 통계 계산
    // 4. 전월 데이터도 조회 (비교용)
    // 5. 응답 반환
  }
  ```
  - 요청 검증: `validateYearMonth` 사용
  - 데이터 집계:
    - `aggregateByMonth(transactions)` → MonthlySummary
    - totalIncome (유형 = "income")
    - totalExpense (유형 = "expense")
    - balance = totalIncome - totalExpense
    - savingsRate = (balance / totalIncome) * 100
  - 전월 데이터: 비교용 (이전 달 수입/지출)
  - 응답:
    ```typescript
    {
      data: {
        current: MonthlySummary,
        previous: MonthlySummary | null
      },
      cachedAt: "..."
    }
    ```
  - ISR 캐싱: `revalidate: 300`

**기술 스택**: Next.js 16, TypeScript, aggregation 함수

**완료 기준**:

- API 엔드포인트 작동
- 통계 계산 정확성 (수입/지출/잔액/저축률)
- 전월 데이터 포함
- curl/Postman 테스트 완료

**테스트 체크리스트** (Playwright MCP):

```
✓ GET /api/summary?year=2026&month=3 → 200, 요약 데이터
✓ current.totalIncome / totalExpense 계산 정확
✓ balance = totalIncome - totalExpense 검증
✓ savingsRate 계산 정확 (음수 포함)
✓ previous 필드 (이전 달 존재 시)
✓ 첫 번째 월 (previous: null)
```

**참조**: See: PRD 섹션 4.2 (API 설계)

---

### Task 018: `/api/chart/category` 엔드포인트 구현 — 우선순위: 🔴 High

**설명**: 카테고리별 지출 집계를 반환하는 API

**구현 사항**:

- ✓ `app/api/chart/category/route.ts` 완성
  ```typescript
  export async function GET(request: Request) {
    // 1. 요청 검증
    // 2. fetchTransactionsByMonth로 거래 데이터 조회
    // 3. aggregateByCategory로 카테고리별 집계
    // 4. 내림차순 정렬, 상위 8개 + "기타" 처리
    // 5. 응답 반환
  }
  ```
  - 요청 검증: `validateYearMonth` 사용
  - 카테고리 집계:
    - 지출(expense) 거래만 필터링
    - 카테고리별 합계, 비율(%) 계산
    - 색상 할당 (CATEGORY_COLORS 사용)
  - 정렬 및 그룹핑:
    - 금액 기준 내림차순
    - 상위 8개 표시
    - 9번째 이상은 "기타"로 묶음
  - 응답:
    ```typescript
    {
      data: CategorySummary[],  // 금액 내림차순
      cachedAt: "..."
    }
    ```
  - ISR 캐싱: `revalidate: 300`

**기술 스택**: Next.js 16, TypeScript, 데이터 집계

**완료 기준**:

- 카테고리별 지출 집계 정확
- 상위 8개 + "기타" 처리 정확
- 비율(%) 계산 정확 (합계 100%)
- 색상 할당 정확

**테스트 체크리스트** (Playwright MCP):

```
✓ GET /api/chart/category?year=2026&month=3 → 200, 카테고리 데이터
✓ 지출(expense) 만 포함 확인
✓ 금액 내림차순 정렬
✓ 상위 8개 + "기타" 그룹핑
✓ 비율 합계 = 100% 검증
✓ 색상 값 유효 (hex format)
✓ 지출 없는 월 → data: []
```

**참조**: See: PRD 섹션 4.3 (API 설계)

---

### Task 019: `/api/chart/monthly-trend` 엔드포인트 구현 — 우선순위: 🔴 High

**설명**: 최근 N개월 월별 수입/지출 추이를 반환하는 API

**구현 사항**:

- ✓ `app/api/chart/monthly-trend/route.ts` 완성
  ```typescript
  export async function GET(request: Request) {
    // 1. months 파라미터 검증 (기본값: 12)
    // 2. 최근 N개월의 월 범위 계산
    // 3. 각 월별로 fetchTransactionsByMonth + aggregateByMonth
    // 4. 병렬 쿼리로 성능 최적화 (Promise.all)
    // 5. 오래된 월부터 정렬해서 응답
  }
  ```
  - 요청 검증: `validateMonths(months)` — 기본값 12, 범위 1~24
  - 월 범위 계산:
    - `getLastNMonths(12)` → Array<{year, month}>
    - 오래된 순서 (12개월 전 → 현재)
  - 병렬 조회: Promise.all로 N개월 동시 쿼리
  - 응답:
    ```typescript
    {
      data: MonthlySummary[],  // 오래된 월 → 최신 월
      cachedAt: "..."
    }
    ```
  - ISR 캐싱: `revalidate: 3600` (1시간, 추이는 변화 적음)

**기술 스택**: Next.js 16, TypeScript, Promise.all, 날짜 계산

**완료 기준**:

- N개월 추이 데이터 반환 정확
- 오래된 월부터 정렬
- 병렬 조회 성능 (N개월 < 3초)
- 빈 월 데이터 처리 (0 값 포함)

**테스트 체크리스트** (Playwright MCP):

```
✓ GET /api/chart/monthly-trend?months=12 → 200, 12개월 데이터
✓ GET /api/chart/monthly-trend (기본값) → 12개월
✓ 데이터 개수 = months 파라미터값
✓ 오래된 월 → 최신 월 순서 정렬
✓ 각 월의 totalIncome, totalExpense, balance 포함
✓ 빈 월도 포함 (totalIncome: 0, totalExpense: 0)
✓ 캐싱 1시간 (3600초)
```

**참조**: See: PRD 섹션 4.4 (API 설계)

---

### Task 020: 대시보드 페이지를 Server Components로 재구성 — 우선순위: 🔴 High

**설명**: Phase 2의 더미 데이터 기반 대시보드를 실제 API 호출로 변경

**구현 사항**:

- ✓ `app/(dashboard)/page.tsx` 재구성 (Server Component)
  ```typescript
  export default async function DashboardPage(props: {
    searchParams: Promise<{ year?: string; month?: string }>;
  }) {
    // 1. searchParams에서 year, month 추출 (URL query)
    // 2. 각 API 엔드포인트 호출
    //    - fetch('/api/summary?year=...&month=...')
    //    - fetch('/api/chart/category?...')
    //    - fetch('/api/chart/monthly-trend')
    //    - fetch('/api/transactions?...')
    // 3. 데이터 전달 (props로 Client Component에)
    // 4. Suspense 경계 설정 (로딩 상태)
  }
  ```
  - URL query 기반 월 선택:
    - 기본값: 현재 월 (또는 가장 최근 데이터)
    - URL 변경: useRouter.push(`/?year=2026&month=3`)
  - 병렬 API 호출 (Promise.all):
    - 성능 최적화 (<3초)
  - Suspense 및 Skeleton:
    - SummaryCardsSkeleton, ChartSkeleton 등 보여주기
  - 에러 처리:
    - API 실패 시 에러 바운더리 또는 재시도 UI
  - 데이터 전달:
    - Client Components (SummaryCards, CategoryChart 등)에 props 전달
    - 필요시 Client Component로 감싸기 ("use client" 지시어)

**기술 스택**: Next.js 16 Server Components, async/await, Suspense, fetch

**완료 기준**:

- API 데이터 정상 로드
- 월 선택 시 URL 변경 및 데이터 갱신
- Suspense/Skeleton 로딩 표시
- 에러 처리 구현
- 성능 목표 (LCP < 2.5초)

**테스트 체크리스트** (Playwright MCP):

```
✓ 대시보드 페이지 로드 시 API 호출 확인
✓ 월 선택 후 URL 변경 및 데이터 갱신
✓ API 응답 시간 <3초
✓ Skeleton 로더 표시 (느린 네트워크 시뮬레이션)
✓ API 실패 시 에러 표시
✓ Lighthouse 성능 점수 ≥85
✓ LCP < 2.5초 측정
```

**참조**: See: PRD 섹션 5.1 (UI/UX Spec), Task 005~007

---

### Task 021: 거래 내역 페이지를 실제 데이터로 연동 — 우선순위: 🟡 Medium

**설명**: `/transactions` 페이지를 Notion 실제 데이터로 연동

**구현 사항**:

- ✓ `app/transactions/page.tsx` 재구성
  - URL query: `?year=2026&month=3&page=1`
  - Server Component로 거래 데이터 조회:
    ```typescript
    const { searchParams } = props;
    const year = parseInt(searchParams.year || new Date().getFullYear());
    const month = parseInt(searchParams.month || new Date().getMonth() + 1);
    const pageIndex = parseInt(searchParams.page || '0');

    const transactions = await fetch(
      `/api/transactions?year=${year}&month=${month}`
    ).then(r => r.json());
    ```
  - 필터링 (Client Component에서):
    - Zustand 상태: type, categories, searchTerm
    - 클라이언트 사이드 필터링 (데이터 작으면 OK)
    - 또는 서버 쿼리 최적화 (대량 데이터 시)
  - 페이지네이션:
    - 한 페이지 50건
    - 페이지 번호 기반 분할
  - 합계 계산:
    - 필터된 결과의 수입/지출 합계

**기술 스택**: Next.js 16 Server/Client Components, Zustand, fetch

**완료 기준**:

- 실제 Notion 데이터 표시
- 필터/정렬/검색 작동
- 페이지네이션 작동
- 성능 목표 충족

**테스트 체크리스트** (Playwright MCP):

```
✓ 거래 내역 페이지 로드 및 실제 데이터 표시
✓ 필터 적용 (유형, 카테고리, 검색)
✓ 정렬 (날짜, 금액)
✓ 페이지네이션
✓ URL query 유지
✓ 필터 초기화
```

**참조**: See: PRD 섹션 5.2 (UI/UX Spec), Task 008~010

---

### Task 022: 에러 처리 및 Fallback 구현 — 우선순위: 🟡 Medium

**설명**: API 실패 시 graceful fallback 및 사용자 안내

**구현 사항**:

- ✓ API 에러 처리:
  - Notion API 장애 시 마지막 캐시 데이터 표시 (stale-while-revalidate)
  - 또는 부분 데이터 (일부 API만 실패해도 나머지는 표시)
- ✓ 에러 배너:
  - 상단에 "데이터가 오래되었을 수 있습니다" 경고 배너
  - 에러 타입: API 실패, timeout, 네트워크 오류
- ✓ 사용자 안내:
  - "데이터를 로드할 수 없습니다. 나중에 다시 시도하세요"
  - 재시도 버튼
- ✓ 로깅:
  - 서버 콘솔에 API 에러 로깅
  - 차후 모니터링 대비

**기술 스택**: Next.js 16, error handling, React error boundaries (선택사항)

**완료 기준**:

- API 실패 시에도 앱 작동 (부분 기능)
- 사용자 안내 메시지 표시
- 에러 로깅 정상

**테스트 체크리스트** (Playwright MCP):

```
✓ Notion API 타임아웃 시뮬레이션 → 에러 배너 표시
✓ 부분 API 실패 → 나머지 데이터는 표시
✓ 네트워크 오류 → graceful fallback
✓ 재시도 버튼 작동
```

**참조**: See: PRD 섹션 6.2 (캐싱 전략)

---

### Task 023: 성능 최적화 (ISR, 캐싱, 데이터 deduplication) — 우선순위: 🟡 Medium

**설명**: API 응답 속도와 렌더링 성능 최적화

**구현 사항**:

- ✓ ISR (Incremental Static Regeneration):
  - API 라우트에 revalidate 설정
    - 거래/요약: 300초 (5분)
    - 추이: 3600초 (1시간)
  - next/cache의 `revalidatePath()` 고려 (데이터 갱신 시)
- ✓ 데이터 Deduplication:
  - React cache() 활용 (동일 요청 중복 제거)
  - 예: 같은 달의 거래 데이터를 여러 곳에서 조회할 때 한 번만 API 호출
- ✓ 번들 최적화:
  - Recharts 라이브러리 로딩 (큰 라이브러리)
  - Dynamic import 고려: `dynamic(() => import('...'))`
- ✓ 이미지 최적화 (선택사항):
  - 로고, 아이콘은 inline SVG 또는 lucide-react 사용

**기술 스택**: Next.js 16 ISR, React cache(), dynamic import, TailwindCSS v4

**완료 기준**:

- API 응답 시간 <100ms (캐시 히트)
- 페이지 로드 시간 <3초 (3G 환경)
- Lighthouse 성능 점수 ≥85
- LCP < 2.5초

**테스트 체크리스트** (Playwright MCP):

```
✓ 캐시 히트 API 응답 시간 <100ms 측정
✓ 캐시 미스 API 응답 시간 <3초 측정
✓ Lighthouse 성능 테스트 ≥85점
✓ LCP 측정 <2.5초
✓ FCP (First Contentful Paint) 측정
✓ 번들 크기 측정 (Next.js analytics)
```

**참조**: See: PRD 섹션 6.1 (성능)

---

## Phase 4: 최적화 및 배포

**기간**: 3.5일 | **산출물**: 프로덕션 레디 애플리케이션
**목표**: 성능, 보안, 안정성을 최종 검증하고 배포를 준비한다.

### Task 024: 보안 검증 (환경변수, API 키 관리) — 우선순위: 🔴 High

**설명**: NOTION_API_KEY 및 민감한 정보 보안 검증

**구현 사항**:

- ✓ 환경변수 설정 검증:
  - `.env.local` 파일 생성 및 `.gitignore` 확인
  - NOTION_API_KEY: 서버 환경변수만 사용
  - NOTION_DATABASE_ID: 공개 가능 (읽기 권한만)
  - `NEXT_PUBLIC`_ 접두사 절대 금지
- ✓ API 보안:
  - Route Handler에서만 Notion API 호출 (클라이언트 X)
  - 클라이언트 측 API 키 노출 확인 (DevTools)
- ✓ 소스 코드 감사:
  - API 키가 하드코딩되지 않았는지 확인
  - 민감한 로깅 제거
- ✓ 배포 전 체크리스트:
  - `.env.local` .gitignore 포함 확인
  - 환경 변수 배포 환경에 설정
  - 프로덕션 환경변수와 개발 환경 분리

**기술 스택**: Next.js 환경변수, .env.local, .gitignore

**완료 기준**:

- API 키 노출 없음
- 환경변수 설정 정확
- 배포 준비 완료

**테스트 체크리스트**:

```
✓ 소스 코드에서 NOTION_API_KEY 검색 → 결과 없음
✓ 클라이언트 번들에 API 키 포함 안 됨 (DevTools Network 확인)
✓ .env.local .gitignore 포함 확인
✓ 프로덕션 환경변수 설정 완료
```

**참조**: See: PRD 섹션 6.3 (보안), PRD 섹션 7.1 (환경 설정)

---

### Task 025: Playwright E2E 테스트 작성 및 실행 — 우선순위: 🟡 Medium

**설명**: Playwright를 활용한 엔드-투-엔드 테스트

**구현 사항**:

- ✓ `tests/e2e/` 디렉토리 생성
- ✓ `tests/e2e/dashboard.spec.ts` 작성
  - 대시보드 페이지 로드 확인
  - 월 선택 드롭다운 작동 확인
  - API 데이터 표시 확인 (Text 검색)
  - 차트 렌더링 확인
- ✓ `tests/e2e/transactions.spec.ts` 작성
  - 거래 내역 페이지 로드
  - 필터 적용 및 결과 확인
  - 페이지네이션 작동
  - 검색 필터 작동
- ✓ `tests/e2e/api.spec.ts` 작성 (API 테스트)
  - GET /api/transactions 응답 검증
  - GET /api/summary 응답 검증
  - GET /api/chart/category 응답 검증
  - GET /api/chart/monthly-trend 응답 검증
  - 캐싱 동작 검증 (응답 시간)
  - 에러 응답 검증 (400, 500)
- ✓ `playwright.config.ts` 설정
  - baseURL 설정 (localhost:3000)
  - timeout 설정 (네트워크 지연 대비)
  - 여러 브라우저 설정 (Chrome, Firefox)

**기술 스택**: Playwright, TypeScript, E2E 테스트

**완료 기준**:

- E2E 테스트 모두 통과 (✓ all tests pass)
- API 응답 시간 검증
- 브라우저 호환성 확인

**테스트 체크리스트**:

```
✓ 대시보드 페이지 로드 성공
✓ 월 선택 후 데이터 갱신
✓ 차트 렌더링 완료
✓ API 응답 200 확인
✓ 캐시 히트 <100ms
✓ 캐시 미스 <3초
✓ 에러 응답 처리
✓ Chrome, Firefox 호환성
```

**참조**: See: PRD 섹션 2 (Core Features), Playwright 공식 문서

---

### Task 026: 접근성 및 반응형 최종 검증 — 우선순위: 🟡 Medium

**설명**: WCAG 2.1 AA 수준 접근성 및 반응형 완료

**구현 사항**:

- ✓ 접근성 검증:
  - 색상 조합 콘트라스트 비율 확인 (WCAG AA: 4.5:1)
  - 차트에 aria-label 추가
  - 프텍스트 대체 (alt 속성, aria-describedby)
  - 키보드 네비게이션 (Tab, Enter, Escape)
  - 스크린 리더 테스트 (macOS VoiceOver 등)
- ✓ 반응형 최종 검증:
  - 모바일 (375px), 태블릿 (768px), 데스크톱 (1920px)
  - 모든 페이지 및 컴포넌트 확인
  - 터치 인터페이스 (버튼 크기 ≥44px)
- ✓ 다크모드 최종 검증:
  - 모든 색상 조합 확인
  - 콘트라스트 비율 다크모드에서도 AA 이상

**기술 스택**: WCAG 2.1, aria attributes, CSS media queries

**완료 기준**:

- 접근성 검증 완료 (WCAG AA)
- 모든 화면 크기에서 반응형 작동
- 키보드 네비게이션 완전 작동
- 스크린 리더 호환성 검증

**테스트 체크리스트**:

```
✓ 콘트라스트 비율 검증 (axe DevTools, Lighthouse)
✓ 키보드 네비게이션 (Tab 순서, Escape 처리)
✓ 스크린 리더 테스트
✓ 터치 버튼 크기 ≥44px
✓ 모바일/태블릿/데스크톱 반응형 확인
✓ 다크모드 색상 검증
```

**참조**: See: PRD 섹션 6.5 (접근성), PRD 섹션 6.4 (반응형)

---

### Task 027: Lighthouse 성능 최적화 및 측정 — 우선순위: 🔴 High

**설명**: Lighthouse 성능 점수 ≥85 달성

**구현 사항**:

- ✓ 성능 지표 측정:
  - LCP (Largest Contentful Paint) < 2.5초
  - FCP (First Contentful Paint) < 1.8초
  - CLS (Cumulative Layout Shift) < 0.1
  - TTFB (Time to First Byte) < 0.6초
- ✓ 최적화:
  - 번들 크기 분석 (webpack bundle analyzer)
  - 불필요한 의존성 제거
  - Dynamic import로 코드 분할
  - 이미지 최적화 (Next.js Image 컴포넌트 권장)
  - CSS 최적화 (TailwindCSS purge)
- ✓ Lighthouse 측정:
  - 개발 환경: `npx lighthouse https://localhost:3000`
  - 프로덕션 환경: 실제 배포 후 측정
  - 모든 페이지 측정 (대시보드, 거래 내역)

**기술 스택**: Lighthouse, webpack bundle analyzer, Next.js optimization

**완료 기준**:

- Lighthouse 성능 점수 ≥85
- LCP < 2.5초
- FCP < 1.8초
- CLS < 0.1

**테스트 체크리스트**:

```
✓ Lighthouse 성능 측정 ≥85점
✓ LCP < 2.5초 측정
✓ FCP < 1.8초 측정
✓ CLS < 0.1 검증
✓ 번들 크기 분석 및 최적화
```

**참조**: See: PRD 섹션 6.1 (성능)

---

### Task 028: 에러 바운더리 및 Fallback UI 구현 — 우선순위: 🟡 Medium

**설명**: 런타임 에러 처리 및 사용자 안내

**구현 사항**:

- ✓ `app/error.tsx` 생성 (Next.js Error Boundary)
  - 대시보드 레이아웃 내 에러 처리
  - 사용자 친화적 에러 메시지
  - 재시도 버튼
  - 에러 로깅
- ✓ `app/not-found.tsx` 생성 (404 페이지)
  - 대시보드 링크 제공
- ✓ Suspense Fallback:
  - 각 섹션별 Skeleton 로더
  - 부분 로딩 상태 표시
- ✓ 런타임 에러 처리:
  - API 실패 시 부분 데이터 표시
  - 재시도 메커니즘

**기술 스택**: Next.js Error Handling, error.tsx, not-found.tsx, React Suspense

**완료 기준**:

- 에러 발생 시 앱 작동 유지
- 사용자 안내 메시지 표시
- 재시도 가능

**참조**: See: Next.js 공식 문서 (Error Handling)

---

### Task 029: 배포 및 배포 후 검증 — 우선순위: 🔴 High

**설명**: 프로덕션 배포 및 최종 검증

**배포 대상**: Vercel (Next.js 권장) 또는 선호하는 호스팅 서비스

**구현 사항**:

- ✓ Vercel 배포:
  1. GitHub 저장소 연결
  2. 환경변수 설정 (NOTION_API_KEY, NOTION_DATABASE_ID)
  3. 빌드 설정 확인 (next.config.js)
  4. 배포 버튼 클릭
- ✓ 배포 전 체크리스트:
  - `.env.local` .gitignore 확인
  - 환경변수 Vercel에 설정
  - 빌드 성공 확인 (`npm run build`)
  - 성능 테스트 완료
- ✓ 배포 후 검증:
  - 라이브 환경에서 페이지 로드 확인
  - API 응답 테스트
  - 월 선택 및 데이터 갱신 확인
  - Lighthouse 측정 (프로덕션 환경)
  - 모바일/데스크톱 사용자 경험 확인
- ✓ 모니터링:
  - Vercel Analytics 활성화 (선택사항)
  - 에러 로깅 설정 (Sentry, Datadog 등, 선택사항)

**기술 스택**: Vercel, Next.js, 환경변수, GitHub

**완료 기준**:

- 프로덕션 환경 배포 완료
- 라이브 환경 테스트 완료
- 성능 목표 달성
- 사용자 접근 가능

**배포 체크리스트**:

```
✓ GitHub 저장소에 코드 푸시 완료
✓ Vercel 연결 및 배포 성공
✓ 환경변수 설정 완료
✓ 라이브 URL 접근 가능
✓ 대시보드 데이터 로드 확인
✓ API 응답 확인
✓ Lighthouse 측정 (프로덕션)
✓ 모바일 사용성 확인
✓ 에러 로깅 설정 (필요 시)
```

**참조**: See: Vercel 공식 문서, Next.js 배포 가이드

---

## Task 상세 정의

### Task ID 명명 규칙

- **Phase별 번호**: 001~~014 (Phase 1), 015~~023 (Phase 2, 3), 024~029 (Phase 4)
- **형식**: Task [3자리 숫자]: [동사] + [대상] + [목적]

### Task 의존성 그래프

```
Phase 1: 애플리케이션 골격
├── Task 001: 유틸 함수 (currency, date)
├── Task 002: 레이아웃 컴포넌트
├── Task 003: API 라우트 틀
└── Task 004: 더미 데이터 제너레이터

Phase 2: UI/UX 완성
├── Task 005: SummaryCards (의존: Task 001)
├── Task 006: CategoryChart (의존: Task 004)
├── Task 007: MonthlyTrendChart (의존: Task 004)
├── Task 008: TransactionTable
├── Task 009: MonthSelector (의존: Task 001)
├── Task 010: TransactionFilters
├── Task 011: Skeleton Loaders
├── Task 012: 대시보드 페이지 통합 (의존: Task 002, 005~011)
├── Task 013: 거래 내역 페이지 (의존: Task 008~010)
└── Task 014: 다크모드 & 반응형 검증

Phase 3: 핵심 기능 구현
├── Task 015: Notion 파싱 (의존: Task 001)
├── Task 016: /api/transactions (의존: Task 003, 015)
├── Task 017: /api/summary (의존: Task 003, 015)
├── Task 018: /api/chart/category (의존: Task 003, 015)
├── Task 019: /api/chart/monthly-trend (의존: Task 003, 015)
├── Task 020: 대시보드 Server Components (의존: Task 016~019)
├── Task 021: 거래 내역 실제 데이터 (의존: Task 016, 021)
├── Task 022: 에러 처리 & Fallback
└── Task 023: 성능 최적화

Phase 4: 최적화 & 배포
├── Task 024: 보안 검증 (의존: Task 001~023)
├── Task 025: Playwright E2E 테스트 (의존: Task 001~023)
├── Task 026: 접근성 & 반응형 검증 (의존: Task 001~023)
├── Task 027: Lighthouse 최적화 (의존: Task 001~023)
├── Task 028: 에러 바운더리 & Fallback
└── Task 029: 배포 & 배포 후 검증 (의존: Task 024~028)
```

---

## 개발 일정 및 리소스

### 전체 타임라인


| Phase       | 시작일         | 종료일         | 기간   | 누적        |
| ----------- | ----------- | ----------- | ---- | --------- |
| **Phase 1** | Mon, Mar 3  | Wed, Mar 5  | 2.5일 | 2.5일      |
| **Phase 2** | Thu, Mar 6  | Tue, Mar 11 | 5일   | 7.5일      |
| **Phase 3** | Wed, Mar 12 | Tue, Mar 18 | 6.5일 | 14일       |
| **Phase 4** | Wed, Mar 19 | Sat, Mar 22 | 3.5일 | **17.5일** |


### 주간 일정

**Week 1 (Mar 3~8)**

- Mon 3/3: Task 001~004 (유틸, 레이아웃, API 틀, 더미 데이터)
- Tue 3/4: Task 005~007 (카드, 차트 UI)
- Wed 3/5: Task 008~011 (테이블, 필터, Skeleton)
- Thu 3/6: Task 012~014 (페이지 통합, 다크모드)
- Fri 3/7: Phase 2 최종 검증
- Sat 3/8: 휴식 또는 버퍼

**Week 2 (Mar 10~15)**

- Mon 3/10: Task 015~016 (Notion 파싱, API 구현)
- Tue 3/11: Task 017~018 (추가 API)
- Wed 3/12: Task 019~020 (추이 API, 대시보드 연동)
- Thu 3/13: Task 021~022 (거래 페이지, 에러 처리)
- Fri 3/14: Task 023 (성능 최적화)
- Sat 3/15: Phase 3 최종 검증

**Week 3 (Mar 17~22)**

- Mon 3/17: Task 024~025 (보안, E2E 테스트)
- Tue 3/18: Task 026~027 (접근성, Lighthouse)
- Wed 3/19: Task 028~029 (에러 바운더리, 배포)
- Thu 3/20: 배포 후 검증
- Fri 3/21: 최종 점검 및 문서화
- Sat 3/22: MVP 완성 및 배포

### 리소스 및 권장사항

**필요 인프라**:

- Notion 워크스페이스 (가계부 DB)
- GitHub 저장소
- Vercel 계정 (배포)

**선택사항**:

- Sentry (에러 로깅)
- Datadog (모니터링)
- Figma (UI 디자인, 선택)

**개발 환경**:

- Node.js 18+ (또는 20+)
- npm/yarn/pnpm
- VS Code (또는 선호하는 에디터)

---

## 성공 기준 (Success Metrics)

### 기능 완성도


| 기능                          | 수락 기준                              | 상태                                     |
| --------------------------- | ---------------------------------- | -------------------------------------- |
| **Feature 1: Notion DB 연동** | 환경변수 설정만으로 Notion 데이터 조회, 3초 이내 응답 | Phase 3 Task 015~019                   |
| **Feature 2: 월별 요약 카드**     | 4개 카드 표시, 전월 대비 증감률                | Phase 2 Task 005, Phase 3 Task 020     |
| **Feature 3: 카테고리 도넛 차트**   | 카테고리별 지출 비율, 최대 8개                 | Phase 2 Task 006, Phase 3 Task 020     |
| **Feature 4: 월별 추이 바 차트**   | 최근 12개월 수입/지출, 모바일 스크롤             | Phase 2 Task 007, Phase 3 Task 020     |
| **Feature 5: 거래 내역 테이블**    | 필터링, 정렬, 페이지네이션, 합계                | Phase 2 Task 008~013, Phase 3 Task 021 |


### 성능 지표


| 지표                        | 목표값            | 검증 방법                   |
| ------------------------- | -------------- | ----------------------- |
| **LCP**                   | < 2.5초         | Lighthouse, WebPageTest |
| **FCP**                   | < 1.8초         | Lighthouse              |
| **CLS**                   | < 0.1          | Lighthouse              |
| **Notion API 응답 (캐시 히트)** | < 100ms        | Playwright              |
| **Notion API 응답 (캐시 미스)** | < 3초           | Playwright              |
| **Lighthouse 성능 점수**      | ≥85            | Lighthouse              |
| **번들 크기**                 | < 300KB (gzip) | webpack analyzer        |


### 품질 기준


| 항목           | 기준                    | 검증                    |
| ------------ | --------------------- | --------------------- |
| **타입 안전성**   | any 타입 금지             | `tsc --noImplicitAny` |
| **접근성**      | WCAG 2.1 AA           | axe DevTools, 수동 테스트  |
| **반응형**      | 3가지 기기 (모바일/태블릿/데스크톱) | 브라우저 DevTools         |
| **다크모드**     | 모든 색상 조합 AA 이상        | 콘트라스트 검사              |
| **보안**       | API 키 노출 금지           | 소스 코드 감사              |
| **테스트 커버리지** | E2E 테스트 완성            | Playwright            |


---

## 참고 문서 및 링크

### 프로젝트 문서

- **PRD.md**: `/Users/djacob/Documents/JacobStudy/claude-code-mastery/next-js-starterkit/.claude/agents/docs/PRD.md`
- **CLAUDE.md**: `/Users/djacob/Documents/JacobStudy/claude-code-mastery/next-js-starterkit/CLAUDE.md`

### 기술 문서

- [Next.js 16 공식 문서](https://nextjs.org/docs)
- [React 19 공식 문서](https://react.dev)
- [TailwindCSS v4 가이드](https://tailwindcss.com/docs/v4-migration-guide)
- [shadcn/ui 컴포넌트](https://ui.shadcn.com)
- [Recharts 문서](https://recharts.org)
- [Zustand 문서](https://github.com/pmndrs/zustand)
- [Notion API 문서](https://developers.notion.com)
- [Playwright 문서](https://playwright.dev)

### 배포 및 모니터링

- [Vercel 배포 가이드](https://vercel.com/docs)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org)

---

## 요약

이 ROADMAP은 **구조 우선 접근법**을 따르는 3주간의 개발 계획입니다:

1. **Phase 1 (2.5일)**: 애플리케이션 골격 및 API 틀 구축
2. **Phase 2 (5일)**: 모든 UI 완성 (더미 데이터 기반)
3. **Phase 3 (6.5일)**: Notion API 연동 및 실제 데이터 바인딩
4. **Phase 4 (3.5일)**: 성능 최적화, 배포, 최종 검증

각 Task는 **구체적인 구현 사항**, **기술 스택**, **완료 기준**, **테스트 체크리스트**를 포함하여 명확하고 실행 가능합니다.

현재 프로젝트 초기화 단계에서 이미 완료된 작업들(타입, API 스켈레톤, 컴포넌트 구조)을 기반으로 Phase 1부터 순차적으로 진행하면 됩니다.

**다음 단계**: Phase 1 Task 001 시작 (유틸 함수 구현)

---

**최종 수정**: 2026-03-02
**상태**: ✅ 완성 및 배포 준비