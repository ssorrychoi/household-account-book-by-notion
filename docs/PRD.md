# 견적서 웹 뷰어 MVP PRD

## 1️⃣ Executive Summary

### 1.1 프로젝트 개요

**목표**: 노션에 입력된 견적서를 웹 플랫폼에서 실시간으로 조회하고 PDF로 내보내기

**대상 사용자**: B2B 영업팀, 클라이언트

**가치 제안**:
- 견적서 공유 프로세스 자동화
- 클라이언트 셀프서비스 제공
- PDF 생성 자동화로 운영 비용 절감

### 1.2 성공 지표 (KPI)

| 지표 | 목표 | 측정 방법 |
|------|------|---------|
| 페이지 로드 시간 | <1.5초 (3G) | Lighthouse |
| PDF 생성 시간 | <3초 | E2E 테스트 |
| 사용자 만족도 | >4/5 | 설문조사 |
| 가용성 | 99.5% | 모니터링 |

---

## 2️⃣ 기능 요구사항 (Features)

### 2.1 핵심 기능 (Core MVP)

#### F1: 견적서 조회 및 렌더링

**설명**: 노션 데이터베이스에서 견적서 데이터를 조회하여 웹 인터페이스에 렌더링

**유스 케이스**:

1. 클라이언트가 고유 URL(또는 토큰) 접근
2. 시스템이 노션 API를 통해 해당 견적서 데이터 조회
3. 웹 페이지에서 포맷된 견적서 표시

**요구 명세**:

- 📌 견적서 헤더: 회사명, 견적서 번호, 발급일자, 유효기간
- 📌 고객 정보: 회사명, 담당자, 연락처
- 📌 아이템 목록: 품명, 수량, 단가, 합계
- 📌 요약: 소계, 부가세, 총액
- 📌 조건: 납기기한, 결제 조건, 특이사항

**UI 컴포넌트**:

- `QuoteHeader`: 상단 정보 영역
- `CustomerInfo`: 고객 정보 카드
- `ItemTable`: 아이템 라인 목록
- `QuoteSummary`: 금액 요약 섹션
- `TermsSection`: 조건 및 특이사항

---

#### F2: PDF 다운로드 기능

**설명**: 웹 페이지의 견적서를 PDF 형식으로 생성하여 다운로드

**유스 케이스**:

1. 클라이언트가 "PDF 다운로드" 버튼 클릭
2. 현재 견적서 데이터가 PDF로 변환
3. 브라우저 다운로드 시작 (파일명: `견적서_{견적번호}_{날짜}.pdf`)

**요구 명세**:

- 📌 모든 견적서 정보 포함
- 📌 회사 로고 및 브랜딩 유지
- 📌 고품질 출력 (300dpi 기준)
- 📌 한글, 영문 다국어 지원

**기술 스펙**:

```
라이브러리: html2pdf.js 또는 pdfkit
트리거: 버튼 클릭 → 현재 DOM 캡처 → PDF 생성 → 다운로드
성능: <3초 생성 시간
```

**UI 컴포넌트**:

- `PDFDownloadButton`: 다운로드 트리거
- `PDFPreview`: (선택) 다운로드 전 미리보기 모달

---

#### F3: 노션 데이터베이스 연동

**설명**: 노션 API를 통해 실시간 견적서 데이터 동기화

**유스 케이스**:

1. 영업팀이 노션에서 견적서 정보 입력/수정
2. 웹 플랫폼이 자동으로 최신 데이터 반영
3. 클라이언트는 항상 최신 견적서 열람

**요구 명세**:

- 📌 노션 공식 API 연동 (@notionhq/client)
- 📌 노션 데이터베이스 필수 필드:
  - `ID`: 견적서 고유ID
  - `QuoteNumber`: 견적서 번호
  - `CustomerName`: 고객사명
  - `Items`: 다중 관계형 데이터 (품명, 수량, 단가)
  - `TotalAmount`: 총액
  - `ExpirationDate`: 유효기간
  - `IssuedDate`: 발급일자
  - `Status`: 상태 (draft, sent, accepted, expired)
- 📌 데이터 캐싱: 5분 TTL (최적화)

**기술 스펙**:

```
API 엔드포인트: /api/quotes/:quoteId
인증: Notion API Key (환경변수)
응답: JSON Quote 객체
캐싱: ISR (Incremental Static Regeneration)
```

**서버 함수**:

- `getQuoteFromNotion()`: Notion DB 조회
- `mapNotionToQuote()`: 데이터 변환
- `cacheQuoteData()`: 캐시 관리

---

### 2.2 선택 기능 (Future/Out of MVP)

- [ ] 여러 견적서 비교 기능
- [ ] 견적서 서명 기능 (e-signature)
- [ ] 이메일 자동 발송
- [ ] 다국어 지원 (i18n)
- [ ] 클라이언트 계정 시스템

---

## 3️⃣ 비기능 요구사항 (NFR)

### 3.1 성능

| 요구사항 | 목표값 | 측정 기준 |
|---------|-------|---------|
| 초기 로드 | <1.5초 (3G) | Lighthouse |
| 상호작용성 (TTI) | <3초 | Core Web Vitals |
| 누적 레이아웃 이동 (CLS) | <0.1 | Core Web Vitals |
| 번들 크기 | <500KB | webpack-bundle-analyzer |

### 3.2 보안

- 📌 견적서 URL 인증: Token 기반 (UUID)
- 📌 Notion API Key: 환경변수 관리 (노출 금지)
- 📌 HTTPS 필수
- 📌 CORS: 특정 도메인만 허용

### 3.3 접근성

- 📌 WCAG 2.1 AA 준수
- 📌 스크린 리더 지원
- 📌 키보드 네비게이션

### 3.4 신뢰성

- 📌 99.5% 가용성
- 📌 Notion API 실패 시: 캐시된 데이터 반환
- 📌 에러 로깅 및 모니터링

---

## 4️⃣ 기술 아키텍처

### 4.1 시스템 구성도

```
┌─────────────────────────────────────────────────────┐
│                   클라이언트 (웹)                     │
│  - QuoteViewer 페이지 (Next.js App Router)          │
│  - PDF 다운로드 UI                                  │
└───────────────┬─────────────────────────────────────┘
                │ HTTP/REST
┌───────────────▼─────────────────────────────────────┐
│              Next.js 백엔드 서버                    │
│  ┌──────────────────────────────────────────────┐  │
│  │ /api/quotes/[quoteId]                       │  │
│  │ - Notion API 호출                           │  │
│  │ - 데이터 변환 & 캐싱                         │  │
│  │ - 응답 반환                                 │  │
│  └──────────────────────────────────────────────┘  │
└───────────────┬─────────────────────────────────────┘
                │ API
┌───────────────▼─────────────────────────────────────┐
│             Notion API (외부 서비스)                │
│  - Database Query                                  │
│  - Item Data Fetch                                │
└──────────────────────────────────────────────────────┘
```

### 4.2 기술 스택

| 계층 | 기술 | 버전 | 목적 |
|------|------|------|------|
| **프레임워크** | Next.js | 16 | 풀스택 웹 프레임워크 |
| **런타임** | React | 19 | UI 라이브러리 (Server/Client Components) |
| **언어** | TypeScript | 5.x | 타입 안정성 |
| **스타일** | TailwindCSS | v4 | 유틸리티-퍼스트 CSS |
| **UI 컴포넌트** | shadcn/ui | latest | 접근성 기반 헤드리스 컴포넌트 |
| **상태관리** | Zustand | 4.x | 클라이언트 상태 (선택사항) |
| **API 연동** | @notionhq/client | 2.x | Notion API SDK |
| **PDF 생성** | html2pdf.js | 0.10.x | 클라이언트 사이드 PDF |
| **환경 변수** | dotenv | 16.x | 환경 설정 관리 |

### 4.3 API 설계

#### Endpoint: GET /api/quotes/:quoteId

**요청**:

```typescript
GET /api/quotes/quote_123?token=abc123def456

query:
  - token: string (선택사항, 보안 인증)
```

**응답 (200 OK)**:

```json
{
  "success": true,
  "data": {
    "id": "quote_123",
    "quoteNumber": "QT-2024-001",
    "issuedDate": "2024-03-02",
    "expirationDate": "2024-04-02",
    "customer": {
      "name": "ABC 주식회사",
      "contactPerson": "홍길동",
      "email": "hong@abc.com",
      "phone": "010-1234-5678"
    },
    "items": [
      {
        "id": "item_1",
        "name": "웹 개발 서비스",
        "quantity": 1,
        "unitPrice": 5000000,
        "amount": 5000000
      }
    ],
    "summary": {
      "subtotal": 5000000,
      "tax": 500000,
      "total": 5500000
    },
    "terms": {
      "paymentTerms": "계약금 50%, 완공금 50%",
      "deliveryDate": "2024-04-30",
      "specialNotes": "유지보수 3개월 포함"
    }
  }
}
```

**에러 응답 (404 Not Found)**:

```json
{
  "success": false,
  "error": "Quote not found"
}
```

---

## 5️⃣ 페이지 및 컴포넌트 설계

### 5.1 페이지 구조

```
app/
├── quotes/
│   ├── [quoteId]/
│   │   └── page.tsx          # 견적서 조회 페이지
│   └── error.tsx             # 에러 페이지
├── api/
│   └── quotes/
│       └── [quoteId]/
│           └── route.ts      # API 엔드포인트
└── layout.tsx                # 루트 레이아웃
```

### 5.2 컴포넌트 계층

```
QuoteViewerPage (page.tsx)
├── QuoteHeader
│   ├── CompanyLogo
│   ├── QuoteNumber
│   └── IssuedDate
├── CustomerInfo
│   ├── CustomerName
│   └── ContactDetails
├── ItemsTable
│   └── ItemRow[] (각 상품)
├── QuoteSummary
│   ├── SubtotalRow
│   ├── TaxRow
│   └── TotalRow
├── TermsSection
│   ├── PaymentTerms
│   ├── DeliveryDate
│   └── SpecialNotes
└── ActionBar
    ├── PDFDownloadButton
    └── PrintButton
```

### 5.3 shadcn/ui 컴포넌트 활용

```typescript
// 기존 설치된 컴포넌트 활용
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// 신규 추가 필요 컴포넌트
- Table (아이템 라인 목록)
- AlertDialog (PDF 다운로드 확인)
```

---

## 6️⃣ 데이터 모델

### 6.1 Notion 데이터베이스 스키마

```typescript
interface QuoteInNotion {
  // 기본 정보
  ID: string                 // Notion Page ID
  QuoteNumber: string        // 예: "QT-2024-001"
  IssuedDate: Date          // 발급일
  ExpirationDate: Date      // 유효기간 만료일
  Status: "draft" | "sent" | "accepted" | "expired"

  // 고객 정보
  Customer: Relation        // 고객 DB 참조
  CustomerName: string
  ContactPerson: string
  Email: string
  Phone: string

  // 견적 항목
  Items: Relation[]         // 아이템 DB 다중 참조

  // 금액
  Subtotal: number
  TaxRate: number          // 예: 0.1 (10%)
  TaxAmount: number
  TotalAmount: number

  // 조건
  PaymentTerms: string
  DeliveryDate: Date
  SpecialNotes: string
}

interface QuoteItemInNotion {
  ID: string
  Name: string              // 품명
  Quantity: number
  UnitPrice: number
  Amount: number           // Quantity × UnitPrice
}
```

### 6.2 애플리케이션 데이터 모델

```typescript
// lib/types.ts

export interface Quote {
  id: string
  quoteNumber: string
  issuedDate: string        // ISO 8601
  expirationDate: string
  status: QuoteStatus

  customer: Customer
  items: QuoteItem[]
  summary: QuoteSummary
  terms: QuoteTerms
}

export interface Customer {
  name: string
  contactPerson: string
  email: string
  phone: string
}

export interface QuoteItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
  amount: number
}

export interface QuoteSummary {
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
}

export interface QuoteTerms {
  paymentTerms: string
  deliveryDate: string
  specialNotes: string
}

export type QuoteStatus = "draft" | "sent" | "accepted" | "expired"
```

---

## 7️⃣ 개발 계획 (Timeline)

### Phase 1: 기초 (1주)

- [ ] Notion API 연동 및 데이터 모델 설계
- [ ] 기본 페이지 라우팅 구성
- [ ] TypeScript 타입 정의
- **산출물**: API 엔드포인트 완성, 데이터 흐름 검증

### Phase 2: UI 구현 (1.5주)

- [ ] 견적서 렌더링 컴포넌트 개발
- [ ] TailwindCSS/shadcn/ui 스타일링
- [ ] 반응형 디자인 적용
- **산출물**: 웹 인터페이스 완성

### Phase 3: PDF 기능 (1주)

- [ ] PDF 라이브러리 통합
- [ ] PDF 템플릿 디자인
- [ ] 다운로드 기능 구현 및 테스트
- **산출물**: PDF 다운로드 기능 완성

### Phase 4: 테스트 & 배포 (0.5주)

- [ ] E2E 테스트 작성
- [ ] 성능 최적화 (Lighthouse)
- [ ] 배포 및 모니터링 설정
- **산출물**: 프로덕션 배포 완료

---

## 8️⃣ 테스트 전략

### 8.1 테스트 케이스

#### Unit Tests

```typescript
// lib/__tests__/notion.test.ts
- getQuoteFromNotion()
  ✓ 정상 응답 파싱
  ✓ API 에러 처리
  ✓ 캐시 반환 확인

// lib/__tests__/pdf.test.ts
- generatePDF()
  ✓ PDF 파일 생성 확인
  ✓ 한글 폰트 렌더링
  ✓ 성능 (<3초)
```

#### E2E Tests (Playwright)

```typescript
// e2e/quote-viewer.spec.ts
- 견적서 조회
  ✓ URL 접근 → 페이지 로드
  ✓ 데이터 표시 확인
  ✓ PDF 다운로드 동작
```

### 8.2 성능 지표

- **Lighthouse Score**: >90 (Performance, Accessibility)
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint): <2.5초
  - FID (First Input Delay): <100ms
  - CLS (Cumulative Layout Shift): <0.1

---

## 9️⃣ 배포 전략

### 9.1 환경 설정

```bash
# .env.local
NOTION_API_KEY=ntn_xxx
NOTION_DATABASE_ID=dba_xxx
NEXT_PUBLIC_SITE_URL=https://quotes.example.com
```

### 9.2 배포 플랫폼

- **권장**: Vercel (Next.js 최적화)
- **대안**: Netlify, AWS Amplify

### 9.3 모니터링

- 에러 로깅: Sentry
- 성능 모니터링: Vercel Analytics
- 가용성: UptimeRobot

---

## 🔟 성공 기준

| 체크항목 | 기준 | 확인 방법 |
|---------|------|---------|
| 기능 완성도 | 3가지 핵심 기능 100% 구현 | 체크리스트 |
| 성능 | Lighthouse >90 | CI/CD 자동화 |
| 보안 | 토큰 기반 인증 + HTTPS | 보안 감사 |
| 사용자 경험 | 3초 내 PDF 다운로드 | 수동 테스트 |
| 배포 안정성 | 99.5% 가용성 | 모니터링 대시보드 |

---

## 📚 참고 자료

### 공식 문서

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Notion API Docs](https://developers.notion.com)
- [TailwindCSS v4 Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

### 라이브러리

- [@notionhq/client](https://github.com/makenotion/notion-sdk-js)
- [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/)
- [clsx](https://github.com/lukeed/clsx)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)

---

## 📞 FAQ

**Q. Notion API 인증이 필수인가?**

A. 예, 보안을 위해 서버사이드에서만 API Key를 사용합니다. 클라이언트는 토큰 기반 접근 제어를 받습니다.

**Q. PDF 생성 라이브러리는 어느 것이 좋은가?**

A. MVP에서는 html2pdf.js (클라이언트 사이드)를 추천합니다. 향후 고품질 필요 시 서버사이드 솔루션(예: puppeteer) 검토.

**Q. 다국어 지원은 MVP에 포함되는가?**

A. 아니오, MVP는 한글 기준입니다. 향후 i18n 라이브러리(next-intl) 추가 가능.

---

**작성 완료**: 2024-03-02
**버전**: 1.0-MVP
**소유자**: 프로덕트 팀
