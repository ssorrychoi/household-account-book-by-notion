# Notion 가계부 웹 대시보드

Notion 가계부 데이터를 웹에서 시각화하는 대시보드. Notion에 입력한 가계부 데이터를 그대로 사용하면서, 차트와 통계로 재무 현황을 직관적으로 확인할 수 있다.

## 주요 기능

- **월별 요약 카드** — 총 수입 / 총 지출 / 잔액 / 저축률 (전월 대비 증감률 포함)
- **카테고리별 지출 도넛 차트** — 어떤 항목에 지출이 집중되는지 한눈에 파악
- **월별 수입/지출 추이 바 차트** — 최근 12개월 재무 패턴 시각화
- **거래 내역 테이블** — 필터링, 정렬, 검색, 페이지네이션 지원
- **반응형 레이아웃** — 모바일 / 태블릿 / 데스크톱 완전 지원

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 + App Router |
| 언어 | TypeScript (strict) |
| 스타일링 | TailwindCSS v4 (CSS-first) |
| UI 컴포넌트 | shadcn/ui + Radix UI |
| 차트 | Recharts |
| 상태 관리 | Zustand |
| 데이터 소스 | Notion API (@notionhq/client) |

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
npm install @notionhq/client recharts
```

### 2. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local`을 열어 아래 두 값을 입력한다:

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Notion API Key 발급 방법:**
1. [notion.so/my-integrations](https://www.notion.so/my-integrations) 접속
2. "새 Integration 만들기" → 권한: 콘텐츠 읽기만 체크
3. Internal Integration Secret 복사

**Database ID 확인 방법:**
1. Notion 가계부 데이터베이스 페이지 열기
2. 우측 상단 `...` → "연결 추가" → 위 Integration 선택
3. URL에서 ID 복사: `https://notion.so/workspace/{DATABASE_ID}?v=...`

### 3. Notion DB 스키마 확인

아래 필드명이 Notion DB와 정확히 일치해야 한다:

| 필드명 | Notion 타입 | 필수 |
|--------|------------|:----:|
| 항목 | Title | ✅ |
| 날짜 | Date | ✅ |
| 금액 | Number | ✅ |
| 유형 | Select ("수입" / "지출") | ✅ |
| 카테고리 | Select | ✅ |
| 메모 | Text | - |
| 결제수단 | Select | - |

필드명이 다를 경우 `lib/notion/parser.ts`의 `FIELD_MAP`을 수정한다.

### 4. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인.

## 스크립트

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
```

## 프로젝트 구조

```
app/
  (dashboard)/page.tsx          # 메인 대시보드 (/)
  transactions/page.tsx         # 거래 내역 목록 (/transactions)
  api/                          # Route Handler (서버 전용 Notion 호출)

components/
  dashboard/                    # 대시보드 UI 컴포넌트
  transactions/                 # 거래 내역 UI 컴포넌트
  ui/                           # shadcn/ui (자동 관리)

lib/
  notion/                       # Notion API 클라이언트 및 파서
  utils/                        # 원화 포맷팅, 날짜 유틸

types/transaction.ts            # 공유 TypeScript 인터페이스
store/transactionStore.ts       # Zustand 상태 (필터/정렬)
```

## 보안 주의사항

- `NOTION_API_KEY`와 `NOTION_DATABASE_ID`는 **서버 환경변수 전용**
- `NEXT_PUBLIC_` 접두사 사용 절대 금지 (클라이언트 노출 위험)
- `.env.local`은 `.gitignore`에 포함되어 있음 (커밋 금지)
- Notion API는 Route Handler(서버)에서만 호출

## 라이선스

MIT
