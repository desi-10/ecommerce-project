"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DashboardDataTable } from "../_components/dashboard-data-table";
import { DashboardShell } from "../_components/dashboard-shell";
import { SummaryCards } from "../_components/summary-cards";

type InventoryRow = {
  id: string;
  sku: string;
  product: string;
  warehouse: string;
  inStock: number;
  reorderLevel: number;
};

const inventoryRows: InventoryRow[] = [
  {
    id: "inv_001",
    sku: "SKU-8922",
    product: "Wireless Earbuds Pro",
    warehouse: "Accra Main",
    inStock: 112,
    reorderLevel: 30,
  },
  {
    id: "inv_002",
    sku: "SKU-4478",
    product: "Everyday Hoodie",
    warehouse: "Kumasi Hub",
    inStock: 8,
    reorderLevel: 20,
  },
  {
    id: "inv_003",
    sku: "SKU-1941",
    product: "Desk Lamp Mini",
    warehouse: "Accra Main",
    inStock: 0,
    reorderLevel: 15,
  },
  {
    id: "inv_004",
    sku: "SKU-7819",
    product: "Gaming Mouse X2",
    warehouse: "Tema Annex",
    inStock: 54,
    reorderLevel: 18,
  },
];

const columns: ColumnDef<InventoryRow>[] = [
  { accessorKey: "sku", header: "SKU" },
  { accessorKey: "product", header: "Product" },
  { accessorKey: "warehouse", header: "Warehouse" },
  { accessorKey: "inStock", header: "In Stock" },
  { accessorKey: "reorderLevel", header: "Reorder Level" },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const { inStock, reorderLevel } = row.original;
      if (inStock === 0) return <Badge variant="destructive">Out</Badge>;
      if (inStock <= reorderLevel) return <Badge variant="outline">Low</Badge>;
      return <Badge variant="secondary">Healthy</Badge>;
    },
  },
];

export default function InventoryDashboardPage() {
  const totalUnits = inventoryRows.reduce((sum, row) => sum + row.inStock, 0);
  const lowStockCount = inventoryRows.filter(
    (row) => row.inStock > 0 && row.inStock <= row.reorderLevel,
  ).length;
  const outOfStockCount = inventoryRows.filter((row) => row.inStock === 0).length;

  return (
    <DashboardShell
      title="Inventory"
      description="See stock position across warehouses and reorder thresholds."
    >
      <SummaryCards
        cards={[
          { title: "Total Units", value: String(totalUnits) },
          { title: "SKUs Tracked", value: String(inventoryRows.length) },
          { title: "Low Stock", value: String(lowStockCount) },
          { title: "Out of Stock", value: String(outOfStockCount) },
        ]}
      />

      <section className="rounded-xl border p-4">
        <h2 className="text-base font-medium">Stock Ledger</h2>
        <DashboardDataTable columns={columns} rows={inventoryRows} />
      </section>
    </DashboardShell>
  );
}
