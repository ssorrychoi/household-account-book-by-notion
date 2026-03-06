/**
 * 대시보드 섹션 레이아웃
 * 헤더, 네비게이션, 콘텐츠를 포함하는 공통 레이아웃
 */

import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* 헤더 */}
      <Header />

      {/* 네비게이션 */}
      <Navigation />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 container px-4 py-6 mx-auto max-w-7xl">
        {children}
      </main>

      {/* 푸터 */}
      <footer className="border-t bg-muted/30 py-4 text-center text-sm text-muted-foreground">
        <p>&copy; 2026 Notion 가계부 대시보드. All rights reserved.</p>
      </footer>
    </div>
  );
}
