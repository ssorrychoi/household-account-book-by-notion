"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 전역 에러 바운더리 (클라이언트 컴포넌트 필수)
 * Next.js App Router의 error.tsx 규약
 */
export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">문제가 발생했습니다</h1>
        <p className="text-muted-foreground text-sm">
          페이지를 불러오는 중 오류가 발생했습니다.
        </p>
        {error.message && (
          <p className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2 font-mono">
            {error.message}
          </p>
        )}
        <Button onClick={reset} variant="outline">
          다시 시도
        </Button>
      </div>
    </main>
  );
}
