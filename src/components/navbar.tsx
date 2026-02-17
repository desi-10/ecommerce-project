"use client";

import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="text-2xl font-bold text-blue-600">
                    mart<span className="text-black">fury</span>
                </div>

                {/* Search (Desktop) */}
                <div className="hidden md:flex flex-1 mx-8">
                    <input
                        placeholder="I'm shopping for..."
                        className="w-full border px-4 py-2 rounded-l-md outline-none"
                    />
                    <button className="bg-blue-600 px-5 text-white rounded-r-md">
                        Search
                    </button>
                </div>

                {/* Icons */}
                <div className="flex items-center gap-4">
                    <ShoppingCart size={20} />
                    <User size={20} />
                    <button
                        className="md:hidden"
                        onClick={() => setOpen(!open)}
                    >
                        <Menu />
                    </button>
                </div>
            </div>

            {/* Mobile Search */}
            {open && (
                <div className="md:hidden px-4 pb-4">
                    <div className="flex">
                        <input
                            className="w-full border px-3 py-2 rounded-l-md"
                            placeholder="Search..."
                        />
                        <button className="bg-blue-600 text-white px-4 rounded-r-md">
                            <Search size={18} />
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
