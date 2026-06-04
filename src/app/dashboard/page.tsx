"use client";

import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetDashboardStats } from "@/hooks/use-dashboard";
import { useGetProducts } from "@/hooks/use-product";
import { formatGHS } from "@/lib/currency";

const MetricCard = ({
  icon: Icon,
  label,
  value,
  trend,
  trendValue,
  usePrimaryColor = true,
}: {
  icon: any;
  label: string;
  value: string | number;
  trend?: "up" | "down";
  trendValue?: string;
  usePrimaryColor?: boolean;
}) => (
  <div className="bg-card rounded-2xl border border-border/60 p-5 hover:shadow-sm hover:border-border transition-all duration-200 group">
    <div className="flex items-start justify-between mb-5">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      {trend && trendValue && (
        <span
          className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-1 rounded-lg ${trend === "up"
              ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400"
            }`}
        >
          {trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {trendValue}
        </span>
      )}
    </div>
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
    <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
  </div>
);

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const barHeights = [40, 70, 45, 90, 65, 85, 100, 55, 75, 40, 60, 80];

export default function DashboardOverviewPage() {
  const { data, isLoading } = useGetDashboardStats();
  const { data: productsData, isLoading: productsLoading } = useGetProducts();

  const metrics = data?.metrics || [];
  const recentOrders = data?.recentOrders || [];
  const allProducts = productsData?.data?.products || [];

  const getProductStock = (p: any) =>
    p.variants?.reduce((sum: number, v: any) => sum + (v.inventory?.stock ?? 0), 0) ?? 0;

  const topProducts = allProducts
    .sort((a: any, b: any) => getProductStock(b) - getProductStock(a))
    .slice(0, 5);

  const orderStats = {
    completed: data?.totalSales || 0,
    pending: data?.pendingOrders || 0,
    cancelled: data?.cancelledOrders || 0,
  };

  const statusConfig = {
    FULFILLED: { label: "Fulfilled", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
    SHIPPED: { label: "Shipped", cls: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400" },
    PAID: { label: "Paid", cls: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" },
    PENDING: { label: "Pending", cls: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" },
    CANCELLED: { label: "Cancelled", cls: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400" },
  } as Record<string, { label: string; cls: string }>;

  return (
    <div className="space-y-7 animate-in fade-in-0 duration-500">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Store Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Welcome back — here's how your store is doing.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-xl text-xs h-9">
            Last 30 days
          </Button>
          <Button size="sm" className="rounded-xl text-xs h-9">
            Generate Report
          </Button>
        </div>
      </div>

      {/* ── Metric cards ── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[120px] bg-muted/40 animate-pulse rounded-2xl border border-border/40" />
          ))
          : <>
            <MetricCard icon={DollarSign} label="Total Revenue" value={formatGHS(data?.totalRevenue || 0)} trend={metrics[0]?.trend} trendValue={metrics[0]?.change || "0%"} />
            <MetricCard icon={ShoppingCart} label="Total Orders" value={data?.totalOrders || 0} trend={metrics[2]?.trend} trendValue={metrics[2]?.change || "0%"} />
            <MetricCard icon={Package} label="Total Products" value={allProducts.length} />
            <MetricCard icon={Users} label="Active Customers" value={data?.activeUsers || 0} trend={metrics[1]?.trend} trendValue={metrics[1]?.change || "0%"} />
          </>
        }
      </div>

      {/* ── Revenue chart + Recent orders ── */}
      <div className="grid gap-5 lg:grid-cols-7">

        {/* Revenue chart */}
        <div className="lg:col-span-4 bg-card rounded-2xl border border-border/60 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Revenue Overview</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly revenue trend</p>
            </div>
            <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="h-64 flex items-end gap-1.5">
            {barHeights.map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
                <div
                  className="w-full rounded-t-md bg-primary/20 hover:bg-primary transition-all duration-200 cursor-pointer"
                  style={{ height: `${(height / 100) * 100}%` }}
                  title={`${months[i]}: ${height}%`}
                />
                <span className="text-[10px] text-muted-foreground font-medium">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="lg:col-span-3 bg-card rounded-2xl border border-border/60 flex flex-col">
          <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Recent Orders</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Latest transactions</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/40">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-[60px] mx-4 my-1 bg-muted/40 animate-pulse rounded-xl" />
              ))
              : recentOrders.length === 0
                ? (
                  <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2">
                    <ShoppingCart className="h-9 w-9 text-muted-foreground/30" />
                    <p className="text-sm">No orders yet</p>
                  </div>
                )
                : recentOrders.slice(0, 6).map((order: any) => {
                  const s = statusConfig[order.status] ?? { label: order.status, cls: "bg-muted text-muted-foreground" };
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                          {(order.user?.name || "G")[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate leading-none">
                            {order.user?.name || "Guest"}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right ml-3 shrink-0">
                        <p className="text-sm font-semibold text-foreground leading-none">
                          {formatGHS(order.total, false)}
                        </p>
                        <span className={`inline-block text-[10px] font-semibold mt-1 px-2 py-0.5 rounded-md ${s.cls}`}>
                          {s.label}
                        </span>
                      </div>
                    </div>
                  );
                })
            }
          </div>

          {recentOrders.length > 0 && (
            <div className="border-t border-border/50 p-3">
              <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-foreground rounded-xl h-8">
                View all orders
                <ChevronRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Order status + Top products ── */}
      <div className="grid gap-5 lg:grid-cols-5">

        {/* Order status */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border/60 p-6">
          <h2 className="text-sm font-semibold text-foreground mb-5">Order Status</h2>
          <div className="space-y-3">
            {[
              { icon: CheckCircle2, label: "Completed", count: orderStats.completed, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/30" },
              { icon: Clock, label: "Pending", count: orderStats.pending, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200/60 dark:border-blue-800/30" },
              { icon: AlertCircle, label: "Cancelled", count: orderStats.cancelled, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/30 border-red-200/60 dark:border-red-800/30" },
            ].map(({ icon: StatusIcon, label, count, color, bg }) => (
              <div key={label} className={`flex items-center justify-between px-4 py-3.5 rounded-xl border ${bg}`}>
                <div className="flex items-center gap-3">
                  <StatusIcon className={`h-4 w-4 ${color}`} />
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </div>
                <span className={`text-sm font-bold ${color}`}>{count}</span>
              </div>
            ))}
          </div>

          {/* Mini donut-style bar */}
          {(orderStats.completed + orderStats.pending + orderStats.cancelled) > 0 && (
            <div className="mt-5">
              <div className="flex h-2 rounded-full overflow-hidden gap-px bg-muted">
                {(() => {
                  const total = orderStats.completed + orderStats.pending + orderStats.cancelled || 1;
                  return [
                    { pct: (orderStats.completed / total) * 100, cls: "bg-emerald-500" },
                    { pct: (orderStats.pending / total) * 100, cls: "bg-blue-500" },
                    { pct: (orderStats.cancelled / total) * 100, cls: "bg-red-400" },
                  ].map((seg, i) => (
                    <div key={i} className={`${seg.cls} h-full transition-all duration-500`} style={{ width: `${seg.pct}%` }} />
                  ));
                })()}
              </div>
              <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                <span>Completed</span><span>Pending</span><span>Cancelled</span>
              </div>
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="lg:col-span-3 bg-card rounded-2xl border border-border/60 p-6">
          <h2 className="text-sm font-semibold text-foreground mb-5">Top Products by Stock</h2>
          {productsLoading ? (
            <div className="space-y-2.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-11 bg-muted/40 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : topProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
              <Package className="h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm">No products yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {topProducts.map((product: any, idx: number) => {
                const stock = getProductStock(product);
                const maxStock = getProductStock(topProducts[0]);
                const barPct = maxStock > 0 ? (stock / maxStock) * 100 : 0;
                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer group"
                  >
                    <span className="w-5 text-xs font-bold text-muted-foreground text-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-medium text-foreground truncate pr-2">{product.name}</p>
                        <span className="text-xs font-semibold text-muted-foreground shrink-0">{stock} units</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary/60 group-hover:bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${barPct}%` }}
                        />
                      </div>
                    </div>
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}