"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { ChevronRight, Home, LogOut, Settings, User as UserIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "@/lib/auth-client";

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Overview",
  products: "Products",
  orders: "Orders",
  customers: "Customers",
  categories: "Categories",
  inventory: "Inventory",
  coupons: "Coupons",
  payments: "Payments",
  reviews: "Reviews",
  contacts: "Contacts",
  discounts: "Discounts",
  new: "New",
};

function useBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean); // ["dashboard", "products", "abc123"]

  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label =
      SEGMENT_LABELS[segment] ??
      // Anything not in the map (a dynamic [id]) reads as a truncated id
      // rather than a raw cuid dump.
      (segment.length > 12 ? `${segment.slice(0, 6)}…` : segment);
    return { href, label, isLast: index === segments.length - 1 };
  });
}

/**
 * Dashboard topbar: sidebar toggle, a real breadcrumb (was empty space
 * before — the header had a commented-out notification button and nothing
 * else), and a user menu (previously sign-out only lived in the sidebar
 * footer, with no way to get there from a scrolled-down page).
 */
export default function DashboardHeader() {
  const crumbs = useBreadcrumb();
  const { data: session } = useSession();
  const user = session?.user;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 z-10 w-full print:hidden">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <SidebarTrigger className="-ml-2 hover:bg-gray-100 p-2 rounded-md transition-colors" />

        <nav className="flex items-center gap-1.5 text-sm min-w-0 overflow-hidden">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 shrink-0">
            <Home className="h-3.5 w-3.5" />
          </Link>
          {crumbs.map((crumb) => (
            <Fragment key={crumb.href}>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />
              {crumb.isLast ? (
                <span className="font-semibold text-gray-900 truncate">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-gray-500 hover:text-gray-800 truncate"
                >
                  {crumb.label}
                </Link>
              )}
            </Fragment>
          ))}
        </nav>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-gray-50 transition-colors">
            <div
              className="h-8 w-8 rounded-full text-white flex items-center justify-center font-semibold text-xs shrink-0"
              style={{ backgroundColor: "var(--primary-600)" }}
            >
              {initials}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-35 truncate">
              {user?.name ?? "Account"}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/account/profile" className="cursor-pointer">
              <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
              My account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/" className="cursor-pointer">
              <Home className="h-4 w-4 mr-2 text-gray-400" />
              Back to store
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } })
            }
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
