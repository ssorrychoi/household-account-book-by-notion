import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * 404 Not Found 페이지
 * Next.js App Router의 not-found.tsx 규약
 */
export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <p className="text-6xl font-bold text-muted-foreground/30">404</p>
        <h1 className="text-2xl font-bold text-foreground">페이지를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground text-sm">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <Button asChild variant="outline">
          <Link href="/">대시보드로 돌아가기</Link>
        </Button>
      </div>
    </main>
  );
}
