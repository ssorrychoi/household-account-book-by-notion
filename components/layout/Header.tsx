"use client";

/**
 * 대시보드 헤더 컴포넌트
 * 로고와 타이틀을 표시하는 헤더
 */

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* 좌측: 로고 + 타이틀 */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold">
            💰
          </div>
          <div className="flex flex-col gap-0.5">
            <h1 className="text-lg font-bold text-foreground">Notion 가계부</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              당신의 재정을 시각화하세요
            </p>
          </div>
        </div>

        {/* 우측: 추가 컨텐츠 (선택사항) */}
        <div className="flex items-center gap-4">
          {/* MonthSelector는 레이아웃에서 별도로 배치 */}
        </div>
      </div>
    </header>
  );
}
