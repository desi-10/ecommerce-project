"use client";

import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Users, 
  ShoppingCart,
  TrendingUp,
  Package,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight
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
  usePrimaryColor = true
}: {
  icon: any;
  label: string;
  value: string | number;
  trend?: "up" | "down";
  trendValue?: string;
  usePrimaryColor?: boolean;
}) => {
  const trendColorMap = {
    up: "text-emerald-700 bg-emerald-50",
    down: "text-red-700 bg-red-50",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div 
          className="p-3 rounded-xl text-white"
          style={{ backgroundColor: usePrimaryColor ? 'var(--primary-50)' : 'var(--primary-100)', color: 'var(--primary-600)' }}
        >
          <Icon className="h-6 w-6" />
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${trendColorMap[trend]}`}>
            {trend === "up" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {trendValue}
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default function DashboardOverviewPage() {
  const { data, isLoading } = useGetDashboardStats();
  const { data: productsData, isLoading: productsLoading } = useGetProducts();

  const metrics = data?.metrics || [];
  const recentOrders = data?.recentOrders || [];
  const allProducts = productsData?.data?.products || [];

  // Calculate top products
  const topProducts = allProducts
    .sort((a, b) => (b.inventory?.stock ?? 0) - (a.inventory?.stock ?? 0))
    .slice(0, 5);

  // Calculate order status breakdown
  const orderStats = {
    completed: recentOrders.filter((o: any) => o.status === "COMPLETED").length,
    pending: recentOrders.filter((o: any) => o.status === "PENDING").length,
    cancelled: recentOrders.filter((o: any) => o.status === "CANCELLED").length,
  };

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Store Dashboard</h1>
          <p className="text-sm text-gray-600 mt-2">Welcome back! Here&apos;s your store performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl border-gray-300">
            Last 30 days
          </Button>
          <Button 
            className="text-white rounded-xl"
            style={{ backgroundColor: 'var(--primary-600)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-700)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-600)'}
          >
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse rounded-2xl border border-gray-200" />
          ))
        ) : (
          <>
            <MetricCard
              icon={DollarSign}
              label="Total Revenue"
              value={formatGHS(metrics[0]?.value || 0)}
              trend={metrics[0]?.trend === "up" ? "up" : "down"}
              trendValue={metrics[0]?.change || "0%"}
            />
            <MetricCard
              icon={ShoppingCart}
              label="Total Orders"
              value={recentOrders.length}
              trend="up"
              trendValue={metrics[1]?.change || "0%"}
            />
            <MetricCard
              icon={Package}
              label="Total Products"
              value={allProducts.length}
              trend={metrics[2]?.trend === "up" ? "up" : "down"}
              trendValue={metrics[2]?.change || "0%"}
            />
            <MetricCard
              icon={Users}
              label="Active Customers"
              value={metrics[3]?.value || 0}
              trend={metrics[3]?.trend === "up" ? "up" : "down"}
              trendValue={metrics[3]?.change || "0%"}
            />
          </>
        )}
      </div>

      {/* Charts and Orders Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Revenue Chart */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
            <p className="text-sm text-gray-600 mt-1">Monthly revenue trend</p>
          </div>
          <div className="h-80 flex items-end justify-between gap-3">
            {[40, 70, 45, 90, 65, 85, 100, 55, 75, 40, 60, 80].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                  style={{ 
                    height: `${(height / 100) * 100}%`,
                    background: `linear-gradient(to top, var(--primary-600), var(--primary-400))`,
                  }}
                  title={`${height}%`}
                  onMouseEnter={(e) => e.currentTarget.style.background = `linear-gradient(to top, var(--primary-700), var(--primary-500))`}
                  onMouseLeave={(e) => e.currentTarget.style.background = `linear-gradient(to top, var(--primary-600), var(--primary-400))`}
                />
                <span className="text-xs text-gray-500 font-medium">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 flex flex-col hover:shadow-lg transition-shadow">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <p className="text-sm text-gray-600 mt-1">Latest transactions</p>
          </div>
          <div className="flex-1 p-2 overflow-y-auto">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 bg-gray-100 animate-pulse rounded-xl m-2" />
              ))
            ) : recentOrders.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-gray-500">
                <div className="text-center">
                  <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-sm">No orders yet</p>
                </div>
              </div>
            ) : (
              recentOrders.slice(0, 6).map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border-l-4 border-transparent"
                  style={{ '--hover-border': 'var(--primary-500)' } as React.CSSProperties}
                  onMouseEnter={(e) => e.currentTarget.style.borderLeftColor = 'var(--primary-500)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderLeftColor = 'transparent'}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {order.user?.name || "Guest"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-gray-900 text-sm">
                      {formatGHS(order.total, false)}
                    </p>
                    <span
                      className={`inline-block text-xs font-bold mt-1 px-2.5 py-1 rounded-full ${
                        order.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-700"
                          : order.status === "PENDING"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          {recentOrders.length > 0 && (
            <div className="border-t border-gray-100 p-4">
              <Button 
                variant="ghost" 
                className="w-full transition-colors"
                style={{ color: 'var(--primary-600)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-50)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                View all orders
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Order Status & Top Products Grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Order Status */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Order Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-emerald-900">Completed</p>
                  <p className="text-xs text-emerald-700">{orderStats.completed} orders</p>
                </div>
              </div>
              <span className="text-lg font-bold text-emerald-600">{orderStats.completed}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">Pending</p>
                  <p className="text-xs text-blue-700">{orderStats.pending} orders</p>
                </div>
              </div>
              <span className="text-lg font-bold text-blue-600">{orderStats.pending}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-semibold text-red-900">Cancelled</p>
                  <p className="text-xs text-red-700">{orderStats.cancelled} orders</p>
                </div>
              </div>
              <span className="text-lg font-bold text-red-600">{orderStats.cancelled}</span>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Top Products</h2>
          {productsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : topProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-8 w-8 mx-auto text-gray-300 mb-2" />
              <p className="text-sm">No products yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product: any, idx) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border border-gray-100"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div 
                      className="flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm flex-shrink-0 text-white"
                      style={{ backgroundColor: 'var(--primary-600)' }}
                    >
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {product.inventory?.stock ?? 0} in stock
                      </p>
                    </div>
                  </div>
                  <TrendingUp className="h-4 w-4 text-emerald-600 flex-shrink-0 ml-2" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

