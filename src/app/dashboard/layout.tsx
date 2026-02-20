import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireAdminServerSession } from "@/lib/auth-guards";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  try {
    await requireAdminServerSession();
  } catch {
    redirect("/auth/sign-in");
  }

  return <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <BreadcrumbEllipsis>
          <BreadcrumbList>
            <BreadcrumbItem>
              {/* {isOverview ? (
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                )} */}
            </BreadcrumbItem>
            {/* {!isOverview && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )} */}
          </BreadcrumbList>
        </BreadcrumbEllipsis>
      </header>

      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {children}
      </main>
    </SidebarInset>
  </SidebarProvider>
}
