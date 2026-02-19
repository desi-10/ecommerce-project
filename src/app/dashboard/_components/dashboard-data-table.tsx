"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

interface DashboardDataTableProps<TData extends { id?: string }> {
  columns: ColumnDef<TData, unknown>[];
  rows: TData[];
}

export function DashboardDataTable<TData extends { id?: string }>({
  columns,
  rows,
}: DashboardDataTableProps<TData>) {
  return <DataTable columns={columns} data={{ items: rows }} />;
}
