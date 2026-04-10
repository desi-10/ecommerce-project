"use client";

import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Users, 
  CreditCard, 
  Activity,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetDashboardStats } from "@/hooks/use-dashboard";

const getIcon = (name: string) => {
  switch (name) {
    case "DollarSign": return DollarSign;
    case "Users": return Users;
    case "CreditCard": return CreditCard;
    case "Activity": return Activity;
    default: return Activity;
  }
};

export default function DashboardOverviewPage() {
  const { data, isLoading } = useGetDashboardStats();

  const metrics = data?.metrics || [];
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white border-gray-200 shadow-sm rounded-xl h-10 px-4 text-sm font-medium">
            Export Report
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm rounded-xl h-10 px-4 text-sm font-medium">
            View Analytics
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl border border-gray-100" />
          ))
        ) : (
          metrics.map((metric: any) => {
            const Icon = getIcon(metric.icon);
            return (
              <div key={metric.title} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-indigo-50 p-3 rounded-xl">
                    <Icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                    metric.trend === 'up' ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                  }`}>
                    {metric.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {metric.change}
                  </div>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">{metric.title}</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-1 tracking-tight">{metric.value}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Revenue Overview</h2>
              <p className="text-sm text-gray-500">Monthly revenue breakdown.</p>
            </div>
          </div>
          {/* Mock Chart Area */}
          <div className="h-[300px] w-full flex items-end justify-between gap-2 md:gap-4 mt-6">
            {[40, 70, 45, 90, 65, 85, 100, 55, 75, 40, 60, 80].map((height, i) => (
              <div key={i} className="w-full relative group flex flex-col justify-end h-full">
                <div 
                  className="w-full bg-indigo-100 rounded-t-md hover:bg-indigo-600 transition-colors cursor-pointer"
                  style={{ height: `${height}%` }}
                ></div>
                <div className="mt-2 text-xs text-center text-gray-400 font-medium">
                  {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Recent Orders</h2>
              <p className="text-sm text-gray-500">Latest transactions in the store.</p>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 p-2">
            {isLoading ? (
               Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-xl m-2" />
              ))
            ) : recentOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-500 italic text-sm">No orders yet.</div>
            ) : (
              recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm truncate max-w-[150px]">{order.user?.name || "Guest User"}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{order.id} • {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">${Number(order.total).toFixed(2)}</p>
                    <p className={`text-[10px] font-medium mt-0.5 ${
                      order.status === 'PAID' ? 'text-emerald-600' :
                      order.status === 'PENDING' ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

