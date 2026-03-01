# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
```

> 참고: 이 프로젝트는 Turbopack을 기본으로 사용한다. 테스트 프레임워크는 현재 설정되지 않았다.

## 아키텍처

### 기술 스택

- **Next.js 16** + App Router (Turbopack 기본)
- **React 19** (Server Components 지원)
- **TypeScript** strict 모드 (경로 별칭: `@/*` → 프로젝트 루트)
- **TailwindCSS v4** — CSS-first 방식으로 `tailwind.config.js` 파일 없음. 모든 테마 설정은 `app/globals.css`의 `@theme` 블록에서 관리
- **shadcn/ui** — Radix UI 기반 헤드리스 컴포넌트, `components/ui/`에 위치
- **Zustand** — 클라이언트 상태 관리 (현재 사용 예시 없음, 필요 시 추가)

### 디렉토리 구조

```
app/              # Next.js App Router
  layout.tsx      # 루트 레이아웃 (Geist 폰트, lang="ko", 메타데이터)
  globals.css     # TailwindCSS v4 @theme, CSS 변수, 다크모드 정의
  page.tsx        # 홈페이지
components/
  ui/             # shadcn/ui 컴포넌트 (수정하지 말 것, CLI로 관리)
lib/
  utils.ts        # cn() 유틸 (clsx + tailwind-merge)
```

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

`avatar`, `badge`, `button`, `card`, `dropdown-menu`, `scroll-area`, `separator`, `sheet`, `skeleton`, `tooltip`
