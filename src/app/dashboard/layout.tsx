import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireAdminServerSession } from "@/lib/auth-guards";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  try {
    await requireAdminServerSession();
  } catch {
    redirect("/auth/sign-in");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-slate-50 min-h-screen">
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 shadow-sm z-10 w-full transition-all">
          <div className="flex items-center gap-4 flex-1">
            <SidebarTrigger className="-ml-2 hover:bg-slate-100 p-2 rounded-lg transition-colors" />
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                type="search" 
                placeholder="Search everywhere..." 
                className="w-full pl-9 bg-slate-50 border-transparent shadow-none focus-visible:ring-1 focus-visible:ring-indigo-500 rounded-xl h-10"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 pl-4 border-l border-gray-100 ml-4">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            
            <div className="flex items-center gap-3 cursor-pointer p-1 pr-2 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-gray-100">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium shadow-sm">
                A
              </div>
              <div className="hidden sm:block text-sm">
                <p className="font-semibold text-gray-900 leading-none">Admin User</p>
                <p className="text-gray-500 text-xs mt-1">admin@store.com</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
