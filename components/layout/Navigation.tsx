"use client";

/**
 * 네비게이션 컴포넌트
 * 대시보드와 거래 내역 페이지 간 탭 네비게이션
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navigation() {
  const pathname = usePathname();

  // 현재 경로에 따른 활성화 상태 판단
  const isDashboard = pathname === "/" || pathname === "/(dashboard)";
  const isTransactions = pathname?.startsWith("/transactions");

  const navItems = [
    {
      label: "대시보드",
      href: "/",
      isActive: isDashboard,
      icon: "📊",
    },
    {
      label: "거래 내역",
      href: "/transactions",
      isActive: isTransactions,
      icon: "📋",
    },
  ];

  return (
    <nav className="border-b bg-background">
      <div className="container flex h-12 items-center px-4">
        <div className="flex gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
                "hover:text-foreground/80",
                item.isActive
                  ? "border-b-2 border-primary text-primary"
                  : "border-b-2 border-transparent text-muted-foreground"
              )}
            >
              <span>{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
              <span className="inline sm:hidden">{item.label.charAt(0)}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
