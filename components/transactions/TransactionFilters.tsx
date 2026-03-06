"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransactionStore } from "@/store/transactionStore";

interface TransactionFiltersProps {
  categories: string[];
}

export function TransactionFilters({ categories }: TransactionFiltersProps) {
  const { filters, setType, setSearch, setCategories } = useTransactionStore();

  const typeOptions = [
    { value: "all", label: "전체" },
    { value: "income", label: "수입" },
    { value: "expense", label: "지출" },
    { value: "savings", label: "저축" },
  ] as const;

  return (
    <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
      {/* 유형 필터 */}
      <div className="flex gap-1">
        {typeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setType(option.value)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filters.type === option.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* 카테고리 드롭다운 */}
      <Select
        value={filters.categories[0] ?? "all"}
        onValueChange={(value) =>
          setCategories(value === "all" ? [] : [value])
        }
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="전체 카테고리" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 카테고리</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 항목 검색 */}
      <div className="relative flex-1 max-w-xs">
        <Input
          placeholder="항목 검색..."
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-3"
          aria-label="거래 항목 검색"
        />
      </div>
    </div>
  );
}
