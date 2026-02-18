
"use client"

import Wrapper from "./wrapper";
import { usePathname } from "next/navigation";
import Link from "next/link";

const links = [
    { label: "Home", href: "/", url: "https://img.icons8.com/ios/50/home--v1.png", alt: "home--v1" },
    { label: "Shop", href: "/shop", url: "https://img.icons8.com/dotty/80/shop.png", alt: "shop" },
    { label: "About Us", href: "/about", url: "https://img.icons8.com/ios/50/info--v1.png", alt: "info--v1" },
    { label: "Blog", href: "/blog", url: "https://img.icons8.com/ink/48/newspaper-.png", alt: "newspaper-" },
    { label: "Contact", href: "/contact", url: "https://img.icons8.com/ios/50/phone--v1.png", alt: "phone--v1" },
];

{/* <a target="_blank" href="https://icons8.com/icon/77/info">Info</a> icon by < a target = "_blank" href = "https://icons8.com" > Icons8</ > */ }

export default function Navbar() {

    const pathname = usePathname()

    return (
        <div className="hidden md:block bg-primary text-white border-b sticky top-0">
            <Wrapper>
                <nav className="flex items-center justify-center gap-8 font-semibold">
                    {links.map((l) => (
                        <div key={l.label}>
                            <Link
                                href={l.href}
                                className="flex items-center justify-center gap-2 hover:opacity-90 transition p-4"
                            >
                                <img src={l.url} alt={l.alt} className="h-5 w-5 brightness-150 invert" />
                                {l.label}
                            </Link>
                            {l.href === pathname && <div className="h-1 w-full bg-primary" />}
                        </div>
                    ))}
                </nav>
            </Wrapper>
        </div>
    );
}
