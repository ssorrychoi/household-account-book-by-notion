# PRD — Notion 가계부 웹 대시보드

> **버전**: v1.0.0-MVP
> **작성일**: 2026-03-02
> **상태**: 초안 (Draft)

---

## 1. 개요 (Overview)

### 1.1 프로젝트 배경 및 목적

Notion은 개인 생산성 도구로 널리 사용되며, 많은 사람이 Notion 데이터베이스를 활용해 가계부를 관리한다. 그러나 Notion 자체의 차트 기능은 제한적이며, 지출 패턴이나 월별 추이를 시각적으로 파악하기 어렵다.

**Notion 가계부 웹 대시보드**는 기존 Notion 가계부 데이터를 그대로 유지하면서, 웹 페이지에서 차트와 통계로 재무 현
황을 직관적으로 시각화한다. 입력 방식은 바꾸지 않고, **조회 경험만 개선**하는 것이 핵심이다.

### 1.2 해결하려는 문제 (Problem Statement)

| 문제 | 현재 상황 | 기대 효과 |
|------|----------|----------|
| 지출 패턴 파악 불가 | Notion 표에서 숫자만 나열됨 | 카테고리별 도넛 차트로 즉시 확인 |
| 월별 추이 비교 어려움 | 각 월 페이지를 개별로 열어야 함 | 12개월 바 차트 한 화면에 표시 |
| 저축률 계산 수동 | 직접 계산기를 사용해야 함 | 대시보드에서 자동 계산 및 표시 |
| 필터링/정렬 불편 | Notion 뷰 설정이 번거로움 | 웹 테이블에서 클릭 한 번으로 정렬 |

### 1.3 목표 사용자 (Target User)

- **주 사용자**: Notion으로 가계부를 작성하는 20~40대 개인
- **기술 수준**: Notion 사용 경험 있음, 개발 지식 불필요
- **사용 패턴**: 월 1~4회 대시보드 접속, 월말 결산 확인

### 1.4 MVP 범위 정의

#### In Scope (포함)
- Notion API를 통한 가계부 데이터 읽기
- 월별 수입/지출/잔액/저축률 요약 카드
- 카테고리별 지출 도넛 차트
- 월별 수입/지출 추이 바 차트
- 거래 내역 테이블 (필터링, 정렬)
- 월 선택 네비게이션
- 반응형 레이아웃 (모바일/태블릿/데스크톱)

#### Out of Scope (제외)
- Notion 데이터 쓰기/수정 기능
- 사용자 인증 및 멀티 유저 지원
- 예산 설정 및 목표 관리
- 알림 기능 (이메일, 푸시)
- 다중 Notion DB 연결
- 데이터 내보내기 (Excel, CSV)

---

## 2. 핵심 기능 정의 (Core Features)

### Feature 1: Notion DB 연동 ⭐ 최우선

**사용자 스토리**
As a Notion 가계부 사용자,
I want 내 Notion 데이터베이스가 웹 대시보드와 자동으로 연결되기를,
So that 별도 데이터 입력 없이 기존 가계부 데이터를 바로 활용할 수 있다.

**수락 기준 (Acceptance Criteria)**
- [ ] `NOTION_API_KEY`, `NOTION_DATABASE_ID` 환경변수 설정만으로 연동 완료
- [ ] 데이터베이스 쿼리 시 최대 응답 시간 3초 이내
- [ ] API 응답은 5분(300초) TTL로 캐싱되어 불필요한 재호출 방지
- [ ] Notion API 장애 시 마지막 캐시 데이터를 표시하고 에러 배너 노출
- [ ] 날짜, 금액, 카테고리, 유형(수입/지출), 메모 필드 정상 파싱

**기술 구현 힌트**
```
- @notionhq/client 사용, Server Component에서 직접 호출
- Next.js fetch revalidate: 300 (ISR 방식)
- Notion DB 필터: date 필드 기준 월별 범위 쿼리
- 페이지네이션: has_more 처리로 100건 이상 데이터 수집
```

---

### Feature 2: 월별 대시보드 요약 카드

**사용자 스토리**
As a 사용자,
I want 해당 월의 수입/지출/잔액/저축률을 한눈에 보고 싶다,
So that 이번 달 재무 상태를 5초 안에 파악할 수 있다.

**수락 기준 (Acceptance Criteria)**
- [ ] 총 수입, 총 지출, 잔액(수입-지출), 저축률((잔액/수입)×100%) 카드 4개 표시
- [ ] 전월 대비 증감률을 퍼센트와 화살표(↑↓)로 표시
- [ ] 저축률이 음수(적자)일 경우 빨간색으로 강조 표시
- [ ] 금액은 한국 원화 형식 (₩1,234,567) 으로 표시
- [ ] 월 선택 드롭다운으로 최근 12개월 중 원하는 월 조회 가능

**기술 구현 힌트**
```
- shadcn/ui Card 컴포넌트 활용
- 서버에서 집계 계산 후 props로 전달 (클라이언트 계산 최소화)
- Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }) 사용
```

---

### Feature 3: 카테고리별 지출 도넛 차트

**사용자 스토리**
As a 사용자,
I want 이번 달 지출을 카테고리별 비율로 보고 싶다,
So that 어떤 항목에 돈을 많이 쓰는지 즉시 파악할 수 있다.

**수락 기준 (Acceptance Criteria)**
- [ ] 카테고리별 지출 금액과 비율(%)을 도넛 차트로 표시
- [ ] 최대 8개 카테고리 표시, 나머지는 "기타"로 묶음
- [ ] 차트 호버 시 카테고리명, 금액, 비율 툴팁 표시
- [ ] 차트 우측 또는 하단에 범례(Legend) 표시
- [ ] 지출 데이터가 없을 경우 "이번 달 지출 내역이 없습니다" 안내 메시지 표시

**기술 구현 힌트**
```
- shadcn/ui Chart + Recharts PieChart 사용
- 카테고리별 고정 색상 팔레트 정의 (최소 8색)
- 데이터 집계는 서버에서 처리 후 직렬화 전달
```

---

### Feature 4: 월별 수입/지출 추이 바 차트

**사용자 스토리**
As a 사용자,
I want 최근 6~12개월의 수입과 지출 추이를 그래프로 보고 싶다,
So that 재무 패턴의 변화를 시간 흐름에 따라 추적할 수 있다.

**수락 기준 (Acceptance Criteria)**
- [ ] 최근 12개월의 수입(초록)/지출(빨강) 묶음 바 차트 표시
- [ ] X축: 월 레이블 (예: 2025.03), Y축: 금액 (원화)
- [ ] 바 호버 시 해당 월의 수입, 지출, 잔액 툴팁 표시
- [ ] 데이터가 없는 월은 0으로 표시 (빈 칸 없음)
- [ ] 모바일에서 가로 스크롤 가능하게 처리

**기술 구현 힌트**
```
- Recharts BarChart (grouped/stacked 선택)
- 12개월 데이터를 병렬 쿼리로 한 번에 수집
- ResponsiveContainer로 반응형 처리
```

---

### Feature 5: 거래 내역 테이블

**사용자 스토리**
As a 사용자,
I want 해당 월의 모든 거래를 목록으로 보고 필터링/정렬하고 싶다,
So that 특정 지출 항목을 빠르게 찾아 확인할 수 있다.

**수락 기준 (Acceptance Criteria)**
- [ ] 날짜, 항목명, 카테고리, 유형(수입/지출), 금액 컬럼 표시
- [ ] 날짜 기준 기본 내림차순 정렬, 컬럼 클릭으로 정렬 전환
- [ ] 카테고리 필터 드롭다운 (다중 선택 가능)
- [ ] 유형 필터 (전체/수입/지출) 탭 또는 버튼 그룹
- [ ] 항목명 검색 (클라이언트 사이드 필터링)
- [ ] 한 페이지 최대 50건, 페이지네이션 제공
- [ ] 테이블 하단에 필터된 결과의 합계 표시

**기술 구현 힌트**
```
- shadcn/ui Table 컴포넌트 활용
- 필터/정렬 상태는 Zustand로 관리 (URL query string 연동 권장)
- 검색은 useTransition으로 디바운스 처리
```

---

## 3. Notion 데이터 모델 (Data Model)

### 3.1 Notion 데이터베이스 권장 스키마

| 필드명 | Notion 타입 | 설명 | 필수 여부 |
|--------|------------|------|:--------:|
| 항목 | Title | 거래 항목명 (예: "카페 아메리카노") | ✅ |
| 날짜 | Date | 거래 발생 날짜 | ✅ |
| 금액 | Number (원화 형식) | 거래 금액 (양수만 입력) | ✅ |
| 유형 | Select | "수입" 또는 "지출" | ✅ |
| 카테고리 | Select | 식비, 교통, 문화, 의료 등 | ✅ |
| 메모 | Text | 부가 설명 (선택) | ❌ |
| 결제수단 | Select | 현금, 카드, 계좌이체 등 (선택) | ❌ |

> **주의**: Notion 필드명은 정확히 위 이름과 일치해야 API 파싱이 정상 작동합니다.
> 필드명 변경 시 `lib/notion/parser.ts`의 매핑 설정도 함께 수정해야 합니다.

### 3.2 TypeScript 인터페이스

```typescript
// types/transaction.ts

/** Notion DB에서 파싱한 단일 거래 데이터 */
export interface Transaction {
  id: string;
  title: string;        // 항목명
  date: string;         // ISO 날짜 문자열 (YYYY-MM-DD)
  amount: number;       // 거래 금액 (항상 양수)
  type: 'income' | 'expense';
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
```

---

## 4. API 설계 (API Design)

### 4.1 `GET /api/transactions`

| 항목 | 내용 |
|------|------|
| **Method** | GET |
| **Path** | `/api/transactions` |
| **설명** | 특정 월의 거래 내역 목록 반환 |

**Query Parameters**

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|:----:|--------|------|
| `year` | number | ✅ | - | 연도 (예: 2026) |
| `month` | number | ✅ | - | 월 (1~12) |

**Response Schema**
```typescript
{
  data: Transaction[];
  cachedAt: string;
}
```

**캐싱 전략**: `revalidate: 300` (5분 ISR)

**에러 케이스**
- `400`: year 또는 month 파라미터 누락/유효하지 않은 값
- `500`: Notion API 호출 실패 (에러 메시지 포함)

---

### 4.2 `GET /api/summary`

| 항목 | 내용 |
|------|------|
| **Method** | GET |
| **Path** | `/api/summary` |
| **설명** | 특정 월의 수입/지출/잔액/저축률 요약 반환 |

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `year` | number | ✅ | 연도 |
| `month` | number | ✅ | 월 (1~12) |

**Response Schema**
```typescript
{
  data: {
    current: MonthlySummary;
    previous: MonthlySummary | null;  // 전월 비교용
  };
  cachedAt: string;
}
```

**캐싱 전략**: `revalidate: 300`

---

### 4.3 `GET /api/chart/category`

| 항목 | 내용 |
|------|------|
| **Method** | GET |
| **Path** | `/api/chart/category` |
| **설명** | 특정 월의 카테고리별 지출 집계 반환 |

**Query Parameters**: `year`, `month` (필수)

**Response Schema**
```typescript
{
  data: CategorySummary[];   // 금액 내림차순 정렬
  cachedAt: string;
}
```

**캐싱 전략**: `revalidate: 300`

---

### 4.4 `GET /api/chart/monthly-trend`

| 항목 | 내용 |
|------|------|
| **Method** | GET |
| **Path** | `/api/chart/monthly-trend` |
| **설명** | 최근 N개월의 월별 수입/지출 추이 반환 |

**Query Parameters**

| 파라미터 | 타입 | 필수 | 기본값 |
|---------|------|:----:|--------|
| `months` | number | ❌ | 12 |

**Response Schema**
```typescript
{
  data: MonthlySummary[];   // 오래된 월 → 최신 월 순서
  cachedAt: string;
}
```

**캐싱 전략**: `revalidate: 3600` (1시간, 추이 데이터는 과거 수정이 적음)

---

## 5. 화면 구성 (UI/UX Spec)

### 5.1 메인 대시보드 (`/`)

```
┌─────────────────────────────────────────────────────────┐
│  💰 Notion 가계부                        [2026년 3월 ▾] │  ← Header + 월 선택 Dropdown
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ 총 수입  │ │ 총 지출  │ │  잔  액  │ │  저축률  │  │  ← Summary Cards (4개)
│  │ ₩3,200,000│ │₩2,100,000│ │₩1,100,000│ │  34.4%  │  │
│  │ ↑5% 전월 │ │ ↓3% 전월 │ │          │ │          │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐ ┌─────────────────────────┐│
│  │   카테고리별 지출       │ │   월별 수입/지출 추이   ││
│  │                         │ │                         ││  ← 차트 2개 (좌우 분할)
│  │     [도넛 차트]         │ │     [바 차트]           ││
│  │                         │ │                         ││
│  │  ● 식비 45%            │ │  수입 ■  지출 ■         ││
│  │  ● 교통 15%            │ │                         ││
│  └─────────────────────────┘ └─────────────────────────┘│
├─────────────────────────────────────────────────────────┤
│  거래 내역 [전체] [수입] [지출]          🔍 검색        │  ← 거래 테이블 영역
│  ┌────────────────────────────────────────────────────┐ │
│  │ 날짜↕    항목          카테고리  유형   금액↕      │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ 03.15   카페 아메리카노  식비    지출  ₩4,500      │ │
│  │ 03.14   월급            급여    수입  ₩3,200,000   │ │
│  │ ...                                                │ │
│  └────────────────────────────────────────────────────┘ │
│                        [1] [2] [3] ...                  │
└─────────────────────────────────────────────────────────┘
```

**사용하는 shadcn/ui 컴포넌트**
- `Card`, `CardHeader`, `CardContent` — 요약 카드
- `Select` — 월 선택 드롭다운
- `Chart` (Recharts 래퍼) — 도넛/바 차트
- `Table`, `TableHeader`, `TableRow`, `TableCell` — 거래 테이블
- `Input` — 검색 입력
- `Badge` — 카테고리/유형 태그
- `Tabs` — 수입/지출 필터 탭
- `Skeleton` — 로딩 상태

---

### 5.2 거래 내역 목록 (`/transactions`)

```
┌─────────────────────────────────────────────────────────┐
│  ← 대시보드    거래 내역 — 2026년 3월                  │
├─────────────────────────────────────────────────────────┤
│  [전체 ▾] [카테고리 ▾] [결제수단 ▾]   🔍 항목 검색   │  ← 필터 영역
├─────────────────────────────────────────────────────────┤
│  총 47건 | 수입 합계: ₩3,200,000 | 지출 합계: ₩2,100,000│
├─────────────────────────────────────────────────────────┤
│  날짜↕    항목              카테고리   유형   금액↕     │
│  ─────────────────────────────────────────────────────  │
│  03.15    카페 아메리카노   식비       지출   ₩4,500    │
│  03.14    월급              급여       수입   ₩3,200,000│
│  03.13    지하철            교통       지출   ₩1,500    │
│  ...                                                    │
│                        [이전] 1 / 2 [다음]             │
└─────────────────────────────────────────────────────────┘
```

---

### 5.3 모바일 레이아웃 (375px 기준)

- 요약 카드: 2×2 그리드
- 차트: 세로 스택 배치 (도넛 → 바 차트 순)
- 거래 테이블: 스와이프 가능한 가로 스크롤 또는 카드 형태로 변환

---

## 6. 비기능 요구사항 (Non-Functional Requirements)

### 6.1 성능

| 지표 | 목표값 |
|------|--------|
| LCP (Largest Contentful Paint) | < 2.5초 |
| 페이지 로드 (3G 환경) | < 3초 |
| Lighthouse 성능 점수 | ≥ 85점 |
| Notion API 응답 (캐시 히트 시) | < 100ms |
| Notion API 응답 (캐시 미스 시) | < 3초 |

### 6.2 캐싱 전략

```
Notion API 호출 최소화 방안:

1. ISR (Incremental Static Regeneration)
   - 거래 내역 / 요약: revalidate 300초 (5분)
   - 추이 차트: revalidate 3600초 (1시간)

2. React cache() 활용
   - 동일 요청 중복 제거 (Deduplication)

3. 에러 시 Stale 데이터 유지
   - Notion API 장애 시 마지막 캐시 데이터 표시
   - 상단 배너로 "데이터가 오래되었을 수 있습니다" 안내
```

### 6.3 보안

- `NOTION_API_KEY`는 반드시 서버 환경변수로만 사용 (클라이언트 노출 금지)
- `NEXT_PUBLIC_` 접두사 사용 절대 금지
- `.env.local`은 `.gitignore`에 포함 확인
- Notion API는 Route Handler (서버) 에서만 호출

### 6.4 반응형

| 브레이크포인트 | 대상 기기 | 레이아웃 |
|---------------|---------|---------|
| `< 640px` | 모바일 | 단일 컬럼, 카드 2×2 |
| `640px ~ 1024px` | 태블릿 | 2컬럼 혼합 |
| `> 1024px` | 데스크톱 | 4컬럼 카드 + 2컬럼 차트 |

### 6.5 접근성

- WCAG 2.1 AA 수준 준수
- 차트에 `aria-label` 및 텍스트 대체 데이터 테이블 제공
- 키보드 네비게이션 지원
- 색맹 사용자를 위한 색상 외 패턴/레이블 병행 사용

---

## 7. 환경 설정 (Environment Setup)

### 7.1 환경변수

```env
# .env.local

# Notion Integration Secret Key
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 가계부 데이터베이스 ID (URL에서 추출)
# https://notion.so/your-workspace/{DATABASE_ID}?v=...
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 7.2 Notion Integration 설정 방법

**Step 1: Integration 생성**
1. [notion.so/my-integrations](https://www.notion.so/my-integrations) 접속
2. "새 Integration 만들기" 클릭
3. 이름 입력 (예: "가계부 대시보드")
4. 권한: **콘텐츠 읽기** 만 체크 (쓰기 권한 불필요)
5. 저장 후 **Internal Integration Secret** 복사 → `NOTION_API_KEY`에 입력

**Step 2: 데이터베이스 연결**
1. Notion에서 가계부 데이터베이스 페이지 열기
2. 우측 상단 `...` 메뉴 → "연결 추가" → 위에서 만든 Integration 선택
3. 데이터베이스 URL에서 ID 복사
   ```
   https://notion.so/workspace/[DATABASE_ID]?v=...
   ```
4. 복사한 ID → `NOTION_DATABASE_ID`에 입력

**Step 3: 데이터베이스 스키마 확인**
- 섹션 3.1의 권장 스키마와 Notion DB 필드명 일치 여부 확인
- 필드명이 다를 경우 `lib/notion/parser.ts`에서 매핑 수정

### 7.3 의존성 설치

```bash
# Notion 클라이언트
npm install @notionhq/client

# 차트 라이브러리 (shadcn/ui chart 컴포넌트가 Recharts 사용)
npm install recharts

# shadcn/ui 차트 컴포넌트 추가
npx shadcn@latest add chart

# 추가 필요 shadcn/ui 컴포넌트
npx shadcn@latest add select tabs table
```

---

## 8. 개발 타임라인 (Development Timeline)

| Phase | 내용 | 기간 | 산출물 |
|-------|------|------|--------|
| **Phase 1** | 프로젝트 설정 + Notion API 연동 | 0.5주 | `/lib/notion/client.ts`, `/lib/notion/parser.ts`, TypeScript 인터페이스 |
| **Phase 2** | API Route Handler 구현 | 0.5주 | `/api/transactions`, `/api/summary`, `/api/chart/*` |
| **Phase 3** | 대시보드 UI 구현 | 1주 | Summary Cards, 도넛 차트, 바 차트, 기본 레이아웃 |
| **Phase 4** | 거래 내역 테이블 구현 | 0.5주 | 필터링, 정렬, 페이지네이션 |
| **Phase 5** | 반응형 + polish | 0.5주 | 모바일 레이아웃, 로딩 Skeleton, 에러 처리 |
| **합계** | | **3주** | MVP 완성 |

### 일별 세부 계획 (Phase 1~2)

```
Week 1
  Mon: 환경 설정, Notion API 연결 테스트
  Tue: Transaction 파서 구현 + 타입 정의
  Wed: /api/transactions, /api/summary 구현
  Thu: /api/chart/* 구현 + 캐싱 전략 적용
  Fri: API 통합 테스트 + 엣지 케이스 처리
```

---

## 9. 성공 지표 (Success Metrics)

### 기능 구현 완료 기준

| 기능 | 완료 조건 |
| ------ | ---------- |
| Notion DB 연동 | Notion 데이터가 웹 페이지에 정상 표시됨 |
| 월별 요약 카드 | 수입/지출/잔액/저축률 4개 카드 정상 렌더링 |
| 카테고리 도넛 차트 | 카테고리별 지출 비율 차트 정상 표시 |
| 월별 추이 바 차트 | 최근 12개월 수입/지출 차트 정상 표시 |
| 거래 내역 테이블 | 목록 조회 + 필터링 + 정렬 정상 동작 |
| 반응형 레이아웃 | 모바일/태블릿/데스크톱에서 UI 깨짐 없음 |

---

## 10. 향후 확장 계획 (Future Roadmap)

### v1.1 — 사용성 개선 (MVP 후 1개월)
- 예산 목표 설정 및 달성률 표시
- 지출 카테고리 커스터마이징
- 거래 내역 CSV 내보내기
- 다크모드 완전 지원

### v1.2 — 분석 고도화 (MVP 후 2~3개월)
- 연간 결산 리포트 페이지
- 카테고리별 월평균 vs 이번 달 비교
- 지출 예측 (선형 추세 기반)
- 반복 지출 자동 감지 및 표시

### v2.0 — 멀티 사용자 / 공유 (MVP 후 6개월+)
- 사용자 인증 (NextAuth.js)
- 여러 Notion DB 연결 (가정/개인 분리)
- 가족 공유 대시보드
- 모바일 앱 (React Native / PWA)
- AI 기반 지출 패턴 인사이트 (Claude API 활용)

---

## 부록 — 디렉토리 구조 (권장)

```
app/
  (dashboard)/
    page.tsx              # 메인 대시보드
    layout.tsx            # 대시보드 레이아웃
  transactions/
    page.tsx              # 거래 내역 목록
  api/
    transactions/
      route.ts
    summary/
      route.ts
    chart/
      category/route.ts
      monthly-trend/route.ts

components/
  dashboard/
    SummaryCards.tsx      # 요약 카드 4개
    CategoryChart.tsx     # 도넛 차트
    MonthlyTrendChart.tsx # 바 차트
    MonthSelector.tsx     # 월 선택 드롭다운
  transactions/
    TransactionTable.tsx  # 거래 테이블
    TransactionFilters.tsx
  ui/                     # shadcn/ui (수정 금지)

lib/
  notion/
    client.ts             # Notion 클라이언트 초기화
    queries.ts            # DB 쿼리 함수
    parser.ts             # Notion 응답 → TypeScript 타입 변환
  utils/
    currency.ts           # 원화 포맷팅
    date.ts               # 날짜 유틸

types/
  transaction.ts          # 공유 TypeScript 인터페이스

store/
  transactionStore.ts     # Zustand 스토어 (필터/정렬 상태)
```
