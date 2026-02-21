
"use client"

import { useState } from "react";
import Wrapper from "./wrapper";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/sheets/bottom-sheet";
import SearchSheetContent from "@/components/sheets/search-sheet";

const links = [
    { label: "Home", href: "/", url: "https://img.icons8.com/ios/50/home--v1.png", alt: "home--v1" },
    { label: "Shop", href: "/shop", url: "https://img.icons8.com/dotty/80/shop.png", alt: "shop" },
    { label: "About Us", href: "/about", url: "https://img.icons8.com/ios/50/info--v1.png", alt: "info--v1" },
    { label: "Blog", href: "/blog", url: "https://img.icons8.com/ink/48/newspaper-.png", alt: "newspaper-" },
    { label: "Contact", href: "/contact", url: "https://img.icons8.com/ios/50/phone--v1.png", alt: "phone--v1" },
    { label: "Dashboard", href: "/dashboard", url: "https://img.icons8.com/laces/64/web-design.png", alt: "web-design" },
];

export default function Navbar() {
    const [searchOpen, setSearchOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            <div className="hidden md:block bg-primary text-white border-b sticky top-0 z-40">
                <Wrapper>
                    <nav className="flex items-center justify-between gap-8 font-semibold">
                        <div className="flex items-center justify-center gap-8">
                            {links.map((l) => (
                                <div key={l.label}>
                                    <Link
                                        href={l.href}
                                        className="flex items-center justify-center gap-2 hover:opacity-90 transition p-4"
                                    >
                                        <Image src={l.url} alt={l.alt} width={100} height={100} className="h-5 w-5 brightness-150 invert" />
                                        {l.label}
                                    </Link>
                                    {l.href === pathname && <div className="h-1 w-full bg-white" />}
                                </div>
                            ))}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSearchOpen(true)}
                            className="text-white hover:bg-primary-foreground/10"
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                    </nav>
                </Wrapper>
            </div>

            <BottomSheet
                open={searchOpen}
                onOpenChange={setSearchOpen}
                title="Search Products"
            >
                <SearchSheetContent />
            </BottomSheet>
        </>
    );
}
