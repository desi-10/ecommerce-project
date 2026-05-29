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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useSession, signOut } from "@/lib/auth-client";

// lucide icons
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tags,
  BadgePercent,
  CreditCard,
  Settings,
  MessageSquare,
  LogOut,
  Home,
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
  { title: "Coupons", url: "/dashboard/coupons", icon: BadgePercent },
  { title: "Payments", url: "/dashboard/payments", icon: CreditCard },
  { title: "Reviews", url: "/dashboard/reviews", icon: MessageSquare },
  { title: "Contacts", url: "/dashboard/contacts", icon: MessageSquare },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // safer active check
  const isActive = (url: string) =>
    url === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(url);

  return (
    <Sidebar className="border-r-0 bg-white" {...props}>
      <SidebarHeader className="px-6 py-6 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="grid h-10 w-10 place-items-center rounded-xl text-white shadow-sm" style={{ backgroundColor: 'var(--primary-600)' }}>
            <Settings className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-bold text-gray-900 tracking-tight">
              mart<span className="text-blue-600">fury</span>
            </div>
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
                          ? "text-gray-700 hover:text-gray-900" 
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      style={active ? { backgroundColor: 'var(--primary-50)' } : {}}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 w-full"
                      >
                        <Icon 
                          className="h-5 w-5 transition-colors"
                          style={active ? { color: 'var(--primary-600)' } : {}}
                        />
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
      <SidebarFooter className="border-t border-gray-100 p-4 space-y-3">
        <Link 
          href="/" 
          className="flex items-center gap-3 w-full h-10 px-3 rounded-xl transition-all font-medium text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50"
        >
          <Home className="h-4 w-4" />
          <span>Back to Store</span>
        </Link>

        {session?.user && (
          <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
            <div className="h-8 w-8 rounded-full text-white flex items-center justify-center font-semibold text-xs shrink-0" style={{ backgroundColor: 'var(--primary-600)' }}>
              {session.user.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session.user.email}
              </p>
            </div>
            <button 
              onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = '/'; } } })}
              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
