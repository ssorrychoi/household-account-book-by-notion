"use client";

import { create } from "zustand";

/** 거래 내역 필터/정렬 상태 */
interface TransactionFilters {
  type: "all" | "income" | "expense" | "savings";
  categories: string[]; // 선택된 카테고리 목록 (빈 배열 = 전체)
  search: string;
  sortColumn: "date" | "amount";
  sortDirection: "asc" | "desc";
  page: number;
}

interface TransactionStore {
  filters: TransactionFilters;
  setType: (type: TransactionFilters["type"]) => void;
  setCategories: (categories: string[]) => void;
  setSearch: (search: string) => void;
  setSortColumn: (column: TransactionFilters["sortColumn"]) => void;
  setSortDirection: (direction: TransactionFilters["sortDirection"]) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

const defaultFilters: TransactionFilters = {
  type: "all",
  categories: [],
  search: "",
  sortColumn: "date",
  sortDirection: "desc",
  page: 1,
};

export const useTransactionStore = create<TransactionStore>((set) => ({
  filters: defaultFilters,
  setType: (type) =>
    set((state) => ({ filters: { ...state.filters, type, page: 1 } })),
  setCategories: (categories) =>
    set((state) => ({ filters: { ...state.filters, categories, page: 1 } })),
  setSearch: (search) =>
    set((state) => ({ filters: { ...state.filters, search, page: 1 } })),
  setSortColumn: (sortColumn) =>
    set((state) => ({ filters: { ...state.filters, sortColumn } })),
  setSortDirection: (sortDirection) =>
    set((state) => ({ filters: { ...state.filters, sortDirection } })),
  setPage: (page) => set((state) => ({ filters: { ...state.filters, page } })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
