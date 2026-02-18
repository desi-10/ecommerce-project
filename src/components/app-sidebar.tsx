"use client"
import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Products",
          url: "/dashboard/products",
        },
        {
          title: "Orders",
          url: "/dashboard/orders",
        },
        {
          title: "Categories",
          url: "/dashboard/categories",
        },
        {
          title: "Discount",
          url: "/dashboard/discount",
        },
        {
          title: "Payments",
          url: "/dashboard/payments",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathName = usePathname()
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div>
          something here
        </div>
      </SidebarHeader>
      <SidebarContent >
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title} className="px-2 py-2">
                    <SidebarMenuButton asChild isActive={item.url.startsWith(pathName)}>
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
