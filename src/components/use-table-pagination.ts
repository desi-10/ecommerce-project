import { create } from "zustand";

interface TablePaginationState {
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export const useTablePagination = create<TablePaginationState>((set) => ({
  page: 1,
  limit: 30,
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
}));
