"use client";

import { Home, LayoutGrid, Search, ShoppingCart, User } from "lucide-react";

export default function MobileBottomNav() {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
            <div className="grid grid-cols-5">
                <button className="py-3 flex flex-col items-center gap-1 text-[10px] text-muted-foreground">
                    <Home className="h-5 w-5" />
                    Home
                </button>
                <button className="py-3 flex flex-col items-center gap-1 text-[10px] text-muted-foreground">
                    <LayoutGrid className="h-5 w-5" />
                    Categories
                </button>
                <button className="py-3 flex flex-col items-center gap-1 text-[10px] text-muted-foreground">
                    <Search className="h-5 w-5" />
                    Search
                </button>
                <button className="py-3 flex flex-col items-center gap-1 text-[10px] text-muted-foreground">
                    <ShoppingCart className="h-5 w-5" />
                    Cart
                </button>
                <button className="py-3 flex flex-col items-center gap-1 text-[10px] text-muted-foreground">
                    <User className="h-5 w-5" />
                    Account
                </button>
            </div>
        </nav>
    );
}
