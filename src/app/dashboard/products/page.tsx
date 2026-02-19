"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DashboardDataTable } from "../_components/dashboard-data-table";
import { DashboardShell } from "../_components/dashboard-shell";
import { SummaryCards } from "../_components/summary-cards";

type ProductRow = {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: "ACTIVE" | "INACTIVE";
};

const productRows: ProductRow[] = [
  {
    id: "prod_001",
    name: "Wireless Earbuds Pro",
    category: "Audio",
    price: "$89.00",
    stock: 112,
    status: "ACTIVE",
  },
  {
    id: "prod_002",
    name: "Everyday Hoodie",
    category: "Fashion",
    price: "$42.00",
    stock: 8,
    status: "ACTIVE",
  },
  {
    id: "prod_003",
    name: "Desk Lamp Mini",
    category: "Home",
    price: "$29.00",
    stock: 0,
    status: "INACTIVE",
  },
  {
    id: "prod_004",
    name: "Gaming Mouse X2",
    category: "Accessories",
    price: "$55.00",
    stock: 54,
    status: "ACTIVE",
  },
];

const columns: ColumnDef<ProductRow>[] = [
  { accessorKey: "name", header: "Product" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "price", header: "Price" },
  { accessorKey: "stock", header: "Stock" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) =>
      row.original.status === "ACTIVE" ? (
        <Badge variant="secondary">ACTIVE</Badge>
      ) : (
        <Badge variant="outline">INACTIVE</Badge>
      ),
  },
];

export default function ProductsDashboardPage() {
  const activeCount = productRows.filter((row) => row.status === "ACTIVE").length;
  const lowStockCount = productRows.filter(
    (row) => row.stock > 0 && row.stock < 10,
  ).length;

  return (
    <DashboardShell
      title="Products"
      description="Track product availability, category distribution, and status."
    >
      <SummaryCards
        cards={[
          { title: "Total Products", value: String(productRows.length) },
          { title: "Active", value: String(activeCount) },
          { title: "Low Stock", value: String(lowStockCount) },
          { title: "Out of Stock", value: "1" },
        ]}
      />

      <section className="rounded-xl border p-4">
        <h2 className="text-base font-medium">Product List</h2>
        <DashboardDataTable columns={columns} rows={productRows} />
      </section>
    </DashboardShell>
  );
}
