# PRD 메타 프롬프트 — Notion 가계부 웹 대시보드

> 이 파일은 MVP PRD 문서를 생성하기 위한 메타 프롬프트입니다.
> 아래 프롬프트를 Claude에게 전달하면 완전한 PRD 문서가 생성됩니다.

---

## 사용 방법

아래 `--- 프롬프트 시작 ---` 부터 `--- 프롬프트 끝 ---` 사이의 내용을 복사하여 Claude에게 전달하세요.

---

--- 프롬프트 시작 ---

당신은 시니어 프로덕트 매니저입니다.
아래 프로젝트 컨텍스트와 기술 스택을 기반으로 **MVP PRD 문서(docs/PRD.md)** 를 한국어로 작성해주세요.

## 프로젝트 컨텍스트

**프로젝트명**: Notion 가계부 웹 대시보드
**목적**: 사용자가 Notion 데이터베이스에 가계부를 기록하면, 웹 페이지에서 차트와 통계로 지출/수입 현황을 시각적으로 확인할 수 있는 개인용 대시보드

**핵심 사용자 스토리**:
- "나는 매달 Notion에 가계부를 적고 있는데, 지출 패턴을 차트로 한눈에 보고 싶다."
- "카테고리별로 얼마나 썼는지 바로 확인하고 싶다."
- "월별 수입/지출 추이를 그래프로 보고 싶다."

## 기술 스택 (변경 불가)

```
- Next.js 16 + App Router (Turbopack)
- React 19 (Server Components 우선 활용)
- TypeScript (strict 모드, 경로 별칭 @/*)
- TailwindCSS v4 (tailwind.config.js 없음, globals.css @theme 블록 사용)
- shadcn/ui (Radix UI 기반, components/ui/ 위치)
- Zustand (클라이언트 상태 관리)
- Notion API (@notionhq/client)
- 차트 라이브러리: Recharts (shadcn/ui 차트 컴포넌트와 호환)
```

## PRD 문서 구조 요구사항

다음 섹션을 모두 포함하여 PRD를 작성하세요:

### 1. 개요 (Overview)
- 프로젝트 배경 및 목적
- 해결하려는 문제 (Problem Statement)
- 목표 사용자 (Target User)
- MVP 범위 정의 (In Scope / Out of Scope)

### 2. 핵심 기능 정의 (Core Features)
MVP에 포함될 기능을 **우선순위 순서**로 나열하세요:

각 기능마다 다음을 포함:
- 기능 이름
- 사용자 스토리 (As a ... I want ... So that ...)
- 수락 기준 (Acceptance Criteria) — 체크리스트 형식
- 기술 구현 힌트

반드시 포함해야 할 기능:
1. **Notion DB 연동** — 데이터베이스 읽기, 필드 매핑, 캐싱 전략
2. **월별 대시보드** — 수입/지출 합계, 잔액, 저축률
3. **카테고리별 지출 차트** — 파이 차트 또는 도넛 차트
4. **월별 추이 차트** — 수입/지출 바 차트 또는 라인 차트
5. **거래 내역 테이블** — 날짜/항목/금액/카테고리 필터링 및 정렬

### 3. Notion 데이터 모델 (Data Model)
Notion 데이터베이스의 **권장 스키마**를 정의하세요:

| 필드명 | Notion 타입 | 설명 | 필수 여부 |
|--------|------------|------|----------|
| ...    | ...        | ...  | ...      |

그리고 Next.js에서 사용할 TypeScript 인터페이스를 작성하세요:
```typescript
interface Transaction { ... }
interface MonthlySummary { ... }
```

### 4. API 설계 (API Design)
Next.js Route Handler 기반 API 엔드포인트를 설계하세요:

각 엔드포인트마다:
- Method + Path
- Query Parameters
- Response 스키마 (TypeScript 타입)
- 캐싱 전략 (revalidate 값)
- 에러 케이스

### 5. 화면 구성 (UI/UX Spec)
각 페이지/컴포넌트의 레이아웃을 ASCII 와이어프레임으로 표현하세요.

필수 화면:
- 메인 대시보드 (/)
- 거래 내역 목록 (/transactions)
- (선택) 월별 상세 (/month/[year]/[month])

사용할 shadcn/ui 컴포넌트를 명시하세요.

### 6. 비기능 요구사항 (Non-Functional Requirements)
다음 항목에 대한 목표치를 명시하세요:
- 성능: 페이지 로드 시간, Lighthouse 점수
- 캐싱: Notion API 호출 최소화 전략 (ISR / revalidate)
- 보안: Notion API Key 관리, 환경변수
- 반응형: 모바일/태블릿/데스크톱 지원
- 접근성: WCAG 수준

### 7. 환경 설정 (Environment Setup)
필요한 환경변수 목록:
```env
NOTION_API_KEY=
NOTION_DATABASE_ID=
```

Notion Integration 설정 방법을 단계별로 설명하세요.

### 8. 개발 타임라인 (Development Timeline)
MVP 완성까지의 Phase별 일정 (주 단위):

| Phase | 내용 | 기간 |
|-------|------|------|
| ...   | ...  | ...  |

### 9. 성공 지표 (Success Metrics)
MVP 성공을 판단하는 정량적 기준:
- 기술적 지표 (성능, 에러율 등)
- 사용성 지표

### 10. 향후 확장 계획 (Future Roadmap)
MVP 이후 추가할 수 있는 기능 아이디어 (우선순위 순):
- v1.1: ...
- v1.2: ...
- v2.0: ...

## 작성 가이드라인

1. **구체성**: 모호한 표현 대신 수치와 예시를 사용하세요.
2. **개발자 친화적**: 수락 기준은 테스트 가능한 형태로 작성하세요.
3. **현실적 MVP**: 2~4주 내 1인 개발 가능한 범위로 제한하세요.
4. **한국어**: 모든 내용을 한국어로 작성하되, 코드/변수명은 영어를 유지하세요.
5. **마크다운 형식**: GitHub에서 바로 읽을 수 있는 마크다운으로 작성하세요.

위 요구사항을 모두 충족하는 완전한 PRD 문서를 `docs/PRD.md` 파일로 작성해주세요.

--- 프롬프트 끝 ---

---

## 활용 팁

- 위 프롬프트 실행 후 생성된 `docs/PRD.md`를 검토하고 필요한 부분을 수정하세요.
- Notion 데이터베이스 스키마는 실제 사용하는 필드에 맞게 조정이 필요합니다.
- 차트 라이브러리는 프로젝트에 맞게 변경 가능합니다 (Recharts → Victory, Chart.js 등).
