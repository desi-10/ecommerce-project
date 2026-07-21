"use client";

import Link from "next/link";
import Wrapper from "../wrapper";
import { ReactNode } from "react";
import { useSession } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, Package, ShieldCheck, LogOut, ChevronRight } from "lucide-react";

export default function AccountLayout({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const pathname = usePathname();

    const menuItems = [
        {
            title: "Profile",
            href: "/account/profile",
            icon: User,
        },
        {
            title: "Orders",
            href: "/account/orders",
            icon: Package,
        },
        {
            title: "Security",
            href: "/account/security",
            icon: ShieldCheck,
        },
    ];

    return (
        <section className="bg-neutral-50/50 min-h-screen">
            <Wrapper>
                <div className="py-8 md:py-12">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
                        
                        {/* Sidebar */}
                        <aside className="w-full md:w-72 shrink-0">
                            <div className="bg-white rounded-md border border-neutral-200 overflow-hidden shadow-sm">
                                {/* User Header */}
                                <div className="p-6 border-b border-neutral-100 bg-neutral-50/50">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden border border-white shadow-sm shrink-0">
                                            {session?.user?.image ? (
                                                <img 
                                                    src={session.user.image} 
                                                    alt={session.user.name} 
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <User className="h-6 w-6 text-neutral-400" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-neutral-900 truncate">
                                                {session?.user?.name || "Welcome Back"}
                                            </p>
                                            <p className="text-xs text-neutral-500 truncate">
                                                {session?.user?.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu */}
                                <nav className="p-2">
                                    {menuItems.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center justify-between group px-4 py-3 rounded-md text-sm font-medium transition-all duration-200",
                                                    isActive 
                                                        ? "bg-blue-50 text-blue-600 border border-blue-100" 
                                                        : "text-neutral-600 hover:bg-neutral-50"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon className={cn(
                                                        "h-4 w-4 transition-colors",
                                                        isActive ? "text-blue-600" : "text-neutral-400 group-hover:text-neutral-600"
                                                    )} />
                                                    {item.title}
                                                </div>
                                                <ChevronRight className={cn(
                                                    "h-3 w-3 opacity-0 group-hover:opacity-100 transition-all",
                                                    isActive ? "opacity-100" : "translate-x-[-4px] group-hover:translate-x-0"
                                                )} />
                                            </Link>
                                        );
                                    })}
                                    
                                    <div className="mt-4 pt-4 border-t border-neutral-100">
                                        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </button>
                                    </div>
                                </nav>
                            </div>
                        </aside>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="bg-white rounded-md border border-neutral-200 shadow-sm overflow-hidden">
                                <div className="p-6 md:p-8">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Wrapper>
        </section>
    );
}
