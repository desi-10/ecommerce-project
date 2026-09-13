import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireDashboardServerSession } from "@/lib/auth-guards";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import DashboardHeader from "@/components/dashboard-header";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  // Admins get the full dashboard; vendors get a role scoped down to their
  // own products/inventory/orders (see AppSidebar for the menu-item
  // filtering and each service's vendorId scoping). Anyone else is bounced
  // to sign-in — this was previously commented out, leaving /dashboard
  // open to any visitor.
  let role: string | null = null;
  try {
    const session = await requireDashboardServerSession();
    role = session.user.role ?? null;
  } catch {
    redirect("/auth/sign-in");
  }

  return (
    <SidebarProvider>
      <div className="print:hidden">
        <AppSidebar userRole={role} />
      </div>
      <SidebarInset className="bg-slate-50 min-h-screen">
        <DashboardHeader />

        <main className="flex flex-1 flex-col gap-6 p-6 lg:p-8 print:p-0 print:gap-0 print:bg-white">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
