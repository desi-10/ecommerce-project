"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// lucide icons
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tags,
  BadgePercent,
  CreditCard,
  Settings,
} from "lucide-react";

type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Products", url: "/dashboard/products", icon: Package },
  { title: "Orders", url: "/dashboard/orders", icon: ShoppingBag },
  { title: "Categories", url: "/dashboard/categories", icon: Tags },
  { title: "Inventory", url: "/dashboard/inventory", icon: Package },
  { title: "Discounts", url: "/dashboard/discounts", icon: BadgePercent },
  { title: "Payments", url: "/dashboard/payments", icon: CreditCard },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // safer active check
  const isActive = (url: string) =>
    url === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(url);

  return (
    <Sidebar className="border-r-0 bg-white" {...props}>
      <SidebarHeader className="px-6 py-6 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <Settings className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-bold text-gray-900 tracking-tight">Makola UI</div>
            <div className="text-xs font-medium text-gray-400">Admin Platform</div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 mt-4">
            Menu
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={active}
                      className={`h-11 px-3 py-2 rounded-xl transition-all font-medium text-sm ${
                        active 
                          ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800" 
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 w-full"
                      >
                        <Icon className={`h-5 w-5 ${active ? "text-indigo-600" : "text-gray-400"}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
