import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  BookOpen,
  Box,
  CheckCircle2,
  Code2,
  Globe,
  Layers,
  Palette,
  Sparkles,
  Zap,
} from "lucide-react";

const techStack = [
  {
    icon: Globe,
    name: "Next.js 16",
    description: "App Router, Turbopack 기본 번들러, React 서버 컴포넌트",
    badge: "프레임워크",
    badgeVariant: "default" as const,
    href: "https://nextjs.org/docs",
  },
  {
    icon: Palette,
    name: "TailwindCSS v4",
    description: "CSS-first 설정 방식, tailwind.config 파일 없음, @import 기반",
    badge: "스타일링",
    badgeVariant: "secondary" as const,
    href: "https://tailwindcss.com/docs",
  },
  {
    icon: Box,
    name: "shadcn/ui",
    description: "Radix UI 기반 접근성 우선 컴포넌트, New York 스타일",
    badge: "UI 컴포넌트",
    badgeVariant: "secondary" as const,
    href: "https://ui.shadcn.com",
  },
  {
    icon: Sparkles,
    name: "lucide-react",
    description: "일관된 디자인의 오픈소스 아이콘 라이브러리",
    badge: "아이콘",
    badgeVariant: "outline" as const,
    href: "https://lucide.dev",
  },
  {
    icon: Layers,
    name: "TypeScript",
    description: "전체 타입 안전성, strict 모드, 경로 별칭 @/* 지원",
    badge: "언어",
    badgeVariant: "outline" as const,
    href: "https://www.typescriptlang.org/docs",
  },
  {
    icon: Zap,
    name: "Zustand",
    description: "가볍고 빠른 클라이언트 상태 관리, localStorage 퍼시스트",
    badge: "상태관리",
    badgeVariant: "outline" as const,
    href: "https://zustand.docs.pmnd.rs",
  },
];

const features = [
  "App Router 기반 파일 시스템 라우팅",
  "TailwindCSS v4 CSS-first 설정 (config 파일 없음)",
  "shadcn/ui 10개 컴포넌트 사전 설치",
  "다크모드 지원 (CSS 변수 기반)",
  "TypeScript strict 모드",
  "Turbopack 기본 번들러 (빠른 HMR)",
  "@/* 경로 별칭 설정 완료",
  "ESLint 설정 포함",
];

const installedComponents = [
  "Button", "Card", "Badge", "Avatar",
  "DropdownMenu", "Sheet", "Separator",
  "Skeleton", "Tooltip", "ScrollArea",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 헤더 */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="size-5 text-primary" />
            <span className="font-semibold text-sm">Next.js Starterkit</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono">v1.0.0</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-16">

        {/* 히어로 섹션 */}
        <section className="text-center space-y-6">
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="size-3" />
            빠른 웹 개발을 위한 스타터킷
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Next.js 최신 기술 스택으로
            <br />
            <span className="text-muted-foreground">바로 시작하세요</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Next.js 16, TailwindCSS v4, shadcn/ui, TypeScript가 모두 설정된
            프로덕션 레디 스타터킷입니다. 설정 없이 바로 개발을 시작할 수 있습니다.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button asChild size="lg">
              <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">
                문서 보기
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://ui.shadcn.com/components" target="_blank" rel="noopener noreferrer">
                컴포넌트 탐색
              </a>
            </Button>
          </div>
        </section>

        <Separator />

        {/* 기술 스택 */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">기술 스택</h2>
            <p className="text-muted-foreground mt-1">최신 버전으로 구성된 프로덕션 레디 스택</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <a
                  key={tech.name}
                  href={tech.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <Card className="h-full transition-colors hover:bg-muted/50 cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-muted">
                            <Icon className="size-4 text-foreground" />
                          </div>
                          <CardTitle className="text-base">{tech.name}</CardTitle>
                        </div>
                        <Badge variant={tech.badgeVariant} className="text-xs shrink-0">
                          {tech.badge}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed">
                        {tech.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>
        </section>

        {/* 포함된 기능 & 컴포넌트 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 포함된 기능 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">포함된 기능</h2>
            <ul className="space-y-2.5">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="size-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 설치된 shadcn/ui 컴포넌트 */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">shadcn/ui 컴포넌트</h2>
              <p className="text-sm text-muted-foreground mt-1">사전 설치된 {installedComponents.length}개 컴포넌트</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {installedComponents.map((component) => (
                <Badge key={component} variant="secondary" className="font-mono text-xs">
                  {component}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* 시작하기 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">시작하기</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                icon: Code2,
                title: "app/ 수정",
                description: "app/page.tsx를 원하는 페이지로 교체하세요",
              },
              {
                step: "02",
                icon: Box,
                title: "컴포넌트 추가",
                description: "npx shadcn@latest add [component] 로 추가 설치",
              },
              {
                step: "03",
                icon: BookOpen,
                title: "빌드 & 배포",
                description: "npm run build 후 Vercel에 즉시 배포 가능",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.step}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground">{item.step}</span>
                      <Icon className="size-4 text-primary" />
                    </div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>Next.js Starterkit</span>
          <span className="font-mono text-xs">Next.js 16 · TailwindCSS v4 · shadcn/ui</span>
        </div>
      </footer>
    </div>
  );
}
