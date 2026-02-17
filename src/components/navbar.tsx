
"use client"

import {
    Home,
    ShoppingBag,
    Info,
    Newspaper,
    Phone,
} from "lucide-react";
import Wrapper from "./wrapper";
import { usePathname } from "next/navigation";
import Link from "next/link";

const links = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/shop", icon: ShoppingBag },
    { label: "About Us", href: "/about", icon: Info },
    { label: "Blog", href: "/blog", icon: Newspaper },
    { label: "Contact", href: "/contact", icon: Phone },
];

export default function Navbar() {

    const pathname = usePathname()

    return (
        <div className="hidden md:block bg-white text-primary border-b sticky top-0">
            <Wrapper>
                <nav className="flex items-center justify-center gap-8 py-4 font-semibold">
                    {links.map((l) => (
                        <div key={l.label}>
                            <Link
                                href={l.href}
                                className="flex items-center gap-2 hover:opacity-90 transition"
                            >
                                <l.icon className="h-4 w-4" />
                                {l.label}
                            </Link>
                            {l.href === pathname && <div className="h-px w-full bg-primary" />}
                        </div>
                    ))}
                </nav>
            </Wrapper>
        </div>
    );
}
