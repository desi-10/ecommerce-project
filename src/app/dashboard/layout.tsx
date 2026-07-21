import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireAdminServerSession } from "@/lib/auth-guards";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  // try {
  //   await requireAdminServerSession();
  // } catch {
  //   redirect("/auth/sign-in");
  // }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-slate-50 min-h-screen">
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 shadow-sm z-10 w-full transition-all">
          <div className="flex items-center gap-4 flex-1">
            <SidebarTrigger className="-ml-2 hover:bg-gray-100 p-2 rounded-lg transition-colors" />

          </div>

          <div className="flex items-center gap-4 pl-4 border-l border-gray-100 ml-4">
            {/* <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
              style={{ '--tw-text-opacity': '1', color: 'var(--primary-600)' } as React.CSSProperties}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-700)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary-600)'}
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button> */}

            
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
