"use client";

import { useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatKRW } from "@/lib/utils/currency";
import { useTransactionStore } from "@/store/transactionStore";
import type { Transaction } from "@/types/transaction";

const PAGE_SIZE = 20;

interface TransactionTableProps {
  transactions: Transaction[];
}

function SortIcon({
  column,
  activeColumn,
  direction,
}: {
  column: "date" | "amount";
  activeColumn: "date" | "amount";
  direction: "asc" | "desc";
}) {
  if (column !== activeColumn) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />;
  return direction === "asc"
    ? <ArrowUp className="ml-1 h-3 w-3" />
    : <ArrowDown className="ml-1 h-3 w-3" />;
}

function formatDate(dateStr: string): string {
  return dateStr.replace(/-/g, ".");
}

const TYPE_LABEL: Record<Transaction["type"], string> = {
  income: "수입",
  expense: "지출",
  savings: "저축",
};

const TYPE_VARIANT: Record<
  Transaction["type"],
  "default" | "destructive" | "secondary"
> = {
  income: "default",
  expense: "destructive",
  savings: "secondary",
};

export function TransactionTable({ transactions }: TransactionTableProps) {
  const { filters, setSortColumn, setSortDirection, setPage } =
    useTransactionStore();
  const { type, categories, search, sortColumn, sortDirection, page } = filters;

  // 필터 적용
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (type !== "all" && t.type !== type) return false;
      if (categories.length > 0 && !categories.includes(t.category)) return false;
      if (search && !t.title.includes(search)) return false;
      return true;
    });
  }, [transactions, type, categories, search]);

  // 정렬 적용
  const sorted = useMemo(() => {
    const dir = sortDirection === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sortColumn === "date") {
        return a.date.localeCompare(b.date) * dir;
      }
      return (a.amount - b.amount) * dir;
    });
  }, [filtered, sortColumn, sortDirection]);

  // 페이지네이션
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // 합계
  const totalIncome = filtered
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  // 정렬 헤더 클릭 핸들러
  function handleSort(col: "date" | "amount") {
    if (sortColumn === col) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(col);
      setSortDirection("desc");
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        거래 내역이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  className="flex items-center hover:text-foreground transition-colors"
                  onClick={() => handleSort("date")}
                >
                  날짜
                  <SortIcon column="date" activeColumn={sortColumn} direction={sortDirection} />
                </button>
              </TableHead>
              <TableHead>항목</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>유형</TableHead>
              <TableHead className="text-right">
                <button
                  className="flex items-center ml-auto hover:text-foreground transition-colors"
                  onClick={() => handleSort("amount")}
                >
                  금액
                  <SortIcon column="amount" activeColumn={sortColumn} direction={sortDirection} />
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              paged.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {formatDate(t.date)}
                  </TableCell>
                  <TableCell className="max-w-[160px] truncate">{t.title}</TableCell>
                  <TableCell>
                    {t.category && (
                      <Badge variant="secondary" className="text-xs">
                        {t.category}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={TYPE_VARIANT[t.type]} className="text-xs">
                      {TYPE_LABEL[t.type]}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium whitespace-nowrap ${
                      t.type === "income" ? "text-emerald-600" : "text-destructive"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {formatKRW(t.amount)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

          {/* 합계 행 */}
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="text-sm text-muted-foreground">
                총 {filtered.length}건
              </TableCell>
              <TableCell className="text-right text-sm space-y-0.5">
                <div className="text-emerald-600">수입 {formatKRW(totalIncome)}</div>
                <div className="text-destructive">지출 {formatKRW(totalExpense)}</div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(safePage - 1)}
            disabled={safePage <= 1}
          >
            이전
          </Button>
          <span className="text-sm text-muted-foreground">
            {safePage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(safePage + 1)}
            disabled={safePage >= totalPages}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
