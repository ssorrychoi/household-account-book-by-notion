# PROJECT_RULES.md - Notion 가계부 웹 대시보드 개발 규칙

**프로젝트**: Notion 가계부 웹 대시보드 (v1.0.0-MVP)
**마지막 업데이트**: 2026-03-02
**담당**: Claude Code SuperClaude Framework

---

## 1. 코딩 스타일 & 아키텍처

### 기본 규칙

- **들여쓰기**: 2칸 (일관성)
- **언어**: TypeScript strict 모드
  - `any` 타입 금지
  - 모든 함수 파라미터 & 반환값에 타입 명시
- **경로 별칭**: `@/*` (상대 경로 금지)
- **유니코드**: 파일명은 영문+숫자+하이픈만 허용

### 네이밍 컨벤션

| 대상 | 형식 | 예시 |
|------|------|------|
| React 컴포넌트 | PascalCase | `SummaryCards.tsx` |
| 함수 | camelCase | `formatKRW()`, `getCurrentYearMonth()` |
| 변수 | camelCase | `transactionList`, `isLoading` |
| 상수 | UPPER_SNAKE_CASE | `MAX_ITEMS_PER_PAGE`, `CACHE_TTL` |
| 타입/인터페이스 | PascalCase | `Transaction`, `SummaryData` |
| 디렉토리 | kebab-case | `dashboard/`, `transactions/` |

### 컴포넌트 패턴

```typescript
// 예: Server Component (기본값)
export default function SummaryCards({ month }: { month: string }) {
  return <div>...</div>;
}

// 예: Client Component (상태 관리 필요시)
"use client";
import { useTransactionStore } from "@/store/transactionStore";

export function TransactionFilters() {
  const { filters, setFilter } = useTransactionStore();
  return <div>...</div>;
}
```

**규칙**:
- 기본값: Server Component (성능 이점)
- `"use client"` 마크: 상태/이벤트 리스너 필요한 경우만
- Props: 타입 정의 필수 (Interface 권장)
- 스타일링: `cn()` 유틸 + Tailwind + shadcn/ui

---

## 2. 데이터 흐름 & Notion 통합

### Notion 데이터 모델

Notion DB 필드명 (정확히 일치 필수):

| 필드명 | Notion 타입 | TypeScript | 필수 |
|--------|------------|-----------|------|
| 항목 | Title | string | ✅ |
| 날짜 | Date | Date | ✅ |
| 금액 | Number | number | ✅ |
| 유형 | Select | "수입" \| "지출" | ✅ |
| 카테고리 | Select | string | ✅ |
| 메모 | Text | string \| null | ❌ |
| 결제수단 | Select | string \| null | ❌ |

**필드명 변경 시 필수**: `lib/notion/parser.ts`의 `FIELD_MAP` 수정

### API 캐싱 전략

```typescript
// ISR (Incremental Static Regeneration)
export const revalidate = 300; // /api/transactions, /api/summary, /api/chart/category

export const revalidate = 3600; // /api/chart/monthly-trend

// React cache() (세션 레벨 중복 제거)
export const getTransactions = cache(async () => {
  return notionClient.databases.query(...);
});
```

**규칙**:
- `/api/transactions`, `/api/summary`, `/api/chart/category`: 5분 (300초) ISR
- `/api/chart/monthly-trend`: 1시간 (3600초) ISR
- Notion 쿼리는 `React cache()` 적용 (세션 내 중복 제거)
- 클라이언트는 Zustand (필터/정렬만)

### 에러 처리

```typescript
// Notion API 실패 처리
try {
  const data = await getTransactions(month);
  return { success: true, data };
} catch (error) {
  console.error("Notion API Error:", error);
  // Fallback: 캐시된 데이터 또는 빈 배열 반환
  return { success: false, data: [] };
}
```

**규칙**:
- API 실패: 사용자 알림 + fallback 데이터 제공
- 파싱 에러: 해당 아이템 격리 (다른 데이터 영향 제외)
- 로깅: 모든 에러를 서버 로그에 기록

---

## 3. 상태 관리

### Zustand 스토어

```typescript
// store/transactionStore.ts
import { create } from "zustand";

interface TransactionStore {
  filters: { type?: string; category?: string; search?: string };
  setFilter: (key: string, value: any) => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  filters: {},
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
}));
```

**규칙**:
- 위치: `store/transactionStore.ts`
- 범위: 클라이언트 상태만 (필터/정렬/UI)
- 서버 상태: API 라우트에서 관리 (React cache)
- 불변성: 객체 구조 변경 금지
- Selector: `useShallow()` 활용 (불필요한 리렌더 방지)

---

## 4. TailwindCSS v4 특수 규칙

### 테마 커스터마이징

```css
/* app/globals.css */
@theme {
  /* 커스텀 색상 (OKLch 색공간) */
  --color-primary: oklch(0.5 0.1 30);
  --color-secondary: oklch(0.6 0.08 200);

  /* 커스텀 간격 */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;

  /* 커스텀 폰트 */
  --font-sans: "Geist", system-ui, sans-serif;
}

/* 다크모드 오버라이드 */
@layer base {
  .dark {
    --color-primary: oklch(0.7 0.1 30);
    --color-secondary: oklch(0.8 0.08 200);
  }
}
```

**규칙**:
- `tailwind.config.js` 없음 (v4 CSS-first)
- 모든 커스터마이징: `app/globals.css`의 `@theme {}` 블록
- 색상: OKLch 색공간 사용 (`oklch(...)`)
- 다크모드: `.dark` 클래스 기반

---

## 5. 컴포넌트 라이브러리 (shadcn/ui)

### 설치 & 관리

```bash
# shadcn/ui 컴포넌트 추가
npx shadcn@latest add <component-name>

# 현재 설치된 컴포넌트
avatar, badge, button, card, dropdown-menu, input,
scroll-area, select, separator, sheet, skeleton, table, tooltip
```

**규칙**:
- `components/ui/` 디렉토리: CLI로만 관리 (수정 금지)
- 커스텀: `components/{feature}/` 에서 shadcn 컴포넌트 래핑
- 스타일링: `cn()` 유틸로 클래스 병합

```typescript
// 예: 커스텀 버튼 컴포넌트
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CustomButton({ variant = "primary", ...props }) {
  return (
    <Button
      className={cn(
        variant === "primary" && "bg-blue-500 hover:bg-blue-600",
        variant === "secondary" && "bg-gray-200 hover:bg-gray-300"
      )}
      {...props}
    />
  );
}
```

---

## 6. 테스트 & 품질 기준

### 현재 상태
- 테스트 프레임워크: 미설정 (개발 중)
- 테스트 전략: UI 수동 테스트 → Jest 단위 테스트 (Phase 2 예정)

### 품질 체크리스트

개발 중 반드시 확인:

- [ ] **TypeScript**: strict 모드 컴파일 성공, `any` 타입 없음
- [ ] **Lint**: `npm run lint` 통과
- [ ] **브라우저**: Chrome, Safari, Firefox 호환성
- [ ] **반응형**: 모바일 (375px), 태블릿 (768px), 데스크탑 (1024px)
- [ ] **다크모드**: `.dark` 클래스 적용 테스트
- [ ] **Notion 연동**: DB 동기화 + 필드명 검증
- [ ] **차트**: Recharts 렌더링 (도넛, 바 차트)
- [ ] **성능**: Lighthouse >90, LCP <2.5s
- [ ] **접근성**: WCAG 2.1 AA (shadcn/ui 기본값)

### 검증 명령어

```bash
# ESLint 검사
npm run lint

# TypeScript 컴파일
npx tsc --noEmit

# 개발 서버 (localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build
```

---

## 7. 배포 & 운영

### 환경 설정

```bash
# .env.local 생성 (git 제외)
cp .env.example .env.local
```

**필수 환경변수**:
```
NOTION_API_KEY=<your-integration-secret>
NOTION_DATABASE_ID=<your-database-id>
```

**규칙**:
- 서버 전용: `NEXT_PUBLIC_` 접두사 금지
- 보안: `.env.local`은 git에 커밋 금지

### 빌드 & 배포

```bash
# 개발 서버 (webpack 모드)
npm run dev --webpack

# 프로덕션 빌드 (webpack 모드)
npm run build --webpack

# 프로덕션 서버 실행
npm run start
```

### 배포 전 체크리스트

- [ ] `.env.local` 설정 확인
- [ ] `npm run build` 성공
- [ ] `npm run lint` 통과
- [ ] Notion DB 연결성 테스트
- [ ] API 응답 시간 측정 (<200ms)
- [ ] 성능 지표 확인 (Lighthouse, Core Web Vitals)
- [ ] 오류 로깅 시스템 활성화

---

## 8. 디렉토리 구조 규칙

```
project-root/
├── app/                      # Next.js App Router
│   ├── (dashboard)/          # 대시보드 영역
│   │   ├── layout.tsx        # 대시보드 레이아웃
│   │   └── page.tsx          # 메인 페이지 (/)
│   ├── transactions/         # 거래 내역 페이지
│   │   └── page.tsx          # /transactions
│   ├── api/                  # API 라우트
│   │   ├── transactions/
│   │   ├── summary/
│   │   └── chart/
│   ├── layout.tsx            # 루트 레이아웃
│   └── globals.css           # TailwindCSS v4 @theme
│
├── components/               # React 컴포넌트
│   ├── dashboard/            # 대시보드 컴포넌트
│   ├── transactions/         # 거래 내역 컴포넌트
│   └── ui/                   # shadcn/ui (CLI 관리만)
│
├── lib/                      # 유틸리티 & 비즈니스 로직
│   ├── notion/               # Notion 클라이언트
│   │   ├── client.ts         # 싱글톤
│   │   ├── queries.ts        # DB 쿼리 (React cache)
│   │   └── parser.ts         # 응답 변환 (FIELD_MAP)
│   ├── utils/
│   │   ├── currency.ts       # 원화 포맷팅
│   │   └── date.ts           # 날짜 유틸
│   └── utils.ts              # cn() 유틸
│
├── types/                    # TypeScript 공유 타입
│   └── transaction.ts        # Transaction 인터페이스
│
├── store/                    # Zustand 스토어
│   └── transactionStore.ts   # 클라이언트 상태
│
├── .env.example              # 환경변수 예시
├── .env.local                # 실제 환경변수 (git 제외)
├── CLAUDE.md                 # 프로젝트 가이드
├── PROJECT_RULES.md          # 이 파일
└── package.json              # 의존성
```

---

## 9. Commit Message 규칙 (한국어)

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 타입

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `refactor`: 리팩토링 (기능 변경 없음)
- `style`: 코드 스타일 (포맷팅, 세미콜론 등)
- `docs`: 문서 수정
- `test`: 테스트 추가
- `chore`: 빌드, 의존성 등

### 예시

```
feat(dashboard): 월별 수입/지출 추이 차트 추가

Recharts 바 차트로 월별 추이를 시각화했습니다.
- 1시간 ISR 캐싱 적용
- 다크모드 지원

Closes #15
```

---

## 10. 자주 실수하는 부분 (체크리스트)

- [ ] Notion 필드명: `FIELD_MAP` 동기화 (오타 체크)
- [ ] 환경변수: `NEXT_PUBLIC_` 접두사 사용 금지
- [ ] TypeScript: `any` 타입 사용
- [ ] 상대 경로: `import` 상대 경로 사용 (경로 별칭 사용)
- [ ] TailwindCSS: `tailwind.config.js` 수정 (불가, `globals.css` 사용)
- [ ] shadcn/ui: `components/ui/` 직접 수정 (CLI로만 관리)
- [ ] 상태 관리: 서버 상태를 Zustand에 저장 (API 라우트에서만)
- [ ] 컴포넌트: `use client` 없이 hooks 사용
- [ ] 캐싱: ISR 시간 설정 누락
- [ ] 에러 처리: 무시하는 에러 처리

---

## 참고 자료

- **CLAUDE.md**: 프로젝트 개요 및 기술 스택
- **package.json**: 의존성 및 스크립트
- **Next.js 공식 문서**: https://nextjs.org/docs
- **TailwindCSS v4**: https://tailwindcss.com/docs/v4
- **shadcn/ui**: https://ui.shadcn.com
- **Zustand**: https://github.com/pmndrs/zustand
- **Notion API**: https://developers.notion.com

---

**마지막 검토**: 2026-03-02
**다음 검토 일정**: 2026-04-02
