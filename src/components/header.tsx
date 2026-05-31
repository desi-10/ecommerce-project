"use client";

import { Search, Menu, X, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Wrapper from "./wrapper";
import Navbar from "./navbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import Image from "next/image";
import Link from "next/link";
import CartSheet from "./sheets/cart-sheet";
import WishlistSheet from "./sheets/wishlist-sheet";
import { useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";
import { useSession } from "@/lib/auth-client";
import { UserAvatar } from "./user/user-avatar";
import { useGetCategories } from "@/hooks/use-category";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
];

export default function Header() {
    const router = useRouter();
    const { data: session } = useSession();
    const { data: categoryData } = useGetCategories();
    const categories = categoryData?.data?.categories ?? [];

    const [open, setOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [wishlistOpen, setWishlistOpen] = useState(false);

    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");

    const cartCount = useCartStore((s) => s.getCount());
    const wishlistCount = useWishlistStore((s) => s.items.length);

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        const trimmed = query.trim().toLowerCase();
        if (trimmed === "assistant" || trimmed === "martfury" || trimmed === "chat" || trimmed === "ai") {
            window.dispatchEvent(new CustomEvent("open-ai-assistant"));
            setQuery("");
            return;
        }

        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (category !== "all") params.set("category", category);
        
        router.push(`/shop?${params.toString()}`);
    };

    return (
        <div className="bg-white lg:sticky top-0 z-20">
            <CartSheet open={cartOpen} setOpen={setCartOpen} />
            <WishlistSheet open={wishlistOpen} setOpen={setWishlistOpen} />

            <header>
                <div className="border-b">
                    <Wrapper>
                        <div className="py-6 flex items-center gap-4">
                            <button 
                                className="md:hidden p-2 -ml-2" 
                                onClick={() => setOpen((v) => !v)} 
                                aria-label="Open menu"
                            >
                                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>

                            <Link href="/" className="text-2xl font-extrabold tracking-tight shrink-0">
                                mart<span className="text-blue-600">fury</span>
                            </Link>

                            {/* Desktop search */}
                            <div className="hidden md:flex flex-1 items-center max-w-2xl mx-auto">
                                <form onSubmit={handleSearch} className="flex w-full">
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger className="w-40 rounded-r-none border-r-0 text-xs min-h-11">
                                            <SelectValue placeholder="All Categories" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            {categories.map((c) => (
                                                <SelectItem key={c.id} value={c.slug}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Input 
                                        className="rounded-none border-l-0 border-r-0 h-11" 
                                        placeholder="I'm shopping for..." 
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                    />

                                    <Button 
                                        type="submit"
                                        className="rounded-l-none bg-primary h-11 px-8"
                                    >
                                        Search
                                    </Button>
                                </form>
                            </div>

                            {/* Icons */}
                            <div className="ml-auto flex items-center gap-4 lg:gap-6">
                                {/* Wishlist */}
                                <button onClick={() => setWishlistOpen(true)} className="relative size-7 lg:size-8 cursor-pointer" aria-label="Open wishlist">
                                    <Image
                                        width={100}
                                        height={100}
                                        src="https://img.icons8.com/ios/50/like--v1.png"
                                        alt="wishlist"
                                        className="w-full h-full"
                                    />

                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                </button>

                                {/* Cart */}
                                <button onClick={() => setCartOpen(true)} className="relative size-7 lg:size-8 cursor-pointer" aria-label="Open cart">
                                    <Image
                                        width={100}
                                        height={100}
                                        src="https://img.icons8.com/comic/100/shopping-bag.png"
                                        alt="shopping-bag"
                                        className="w-full h-full"
                                    />

                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                </button>

                                {/* Auth */}
                                <div className="hidden md:block">
                                    {session ? (
                                        <UserAvatar />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="size-8 lg:size-10">
                                                <Image
                                                    width={100}
                                                    height={100}
                                                    src="https://img.icons8.com/parakeet-line/48/user.png"
                                                    alt="user"
                                                    className="w-full h-full"
                                                />
                                            </div>

                                            <div className="text-left leading-tight">
                                                <Link href="/auth/sign-in" className="block text-xs text-muted-foreground hover:text-primary transition">
                                                    Login
                                                </Link>
                                                <Link href="/auth/sign-up" className="block text-xs font-semibold hover:text-primary transition">
                                                    Register
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Wrapper>
                </div>

                <Navbar />

                {/* Mobile search */}
                <div className="md:hidden px-4 pb-4">
                    <form onSubmit={handleSearch} className="flex">
                        <Input 
                            className="rounded-r-none h-10" 
                            placeholder="Search something..." 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <Button 
                            type="submit"
                            className="rounded-l-none bg-blue-600 hover:bg-blue-700 px-4 h-10" 
                            aria-label="Search"
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>
                </div>

                {/* Mobile Menu Content */}
                {open && (
                    <div className="md:hidden fixed inset-0 top-[76px] bg-white z-50 overflow-y-auto border-t">
                        <div className="p-4 space-y-2">
                            {/* Auth Mobile */}
                            <div className="pb-4 mb-4 border-b">
                                {session ? (
                                    <div className="flex items-center gap-3">
                                        <UserAvatar />
                                        <div>
                                            <p className="font-semibold text-sm">{session.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{session.user.email}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button asChild variant="outline" className="rounded-sm h-10">
                                            <Link href="/auth/sign-in">Login</Link>
                                        </Button>
                                        <Button asChild className="rounded-sm h-10">
                                            <Link href="/auth/sign-up">Register</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase pb-2">Navigation</p>
                            <nav className="space-y-1">
                                {navLinks.map((link) => (
                                    <Link 
                                        key={link.label}
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className="flex items-center justify-between p-3 rounded-sm hover:bg-neutral-50 transition border border-transparent hover:border-neutral-100"
                                    >
                                        <span className="text-sm font-medium">{link.label}</span>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    </Link>
                                ))}
                                {session?.user?.role === "admin" && (
                                    <Link 
                                        href="/dashboard"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center justify-between p-3 rounded-sm bg-blue-50 text-blue-700 transition"
                                    >
                                        <span className="text-sm font-bold">Admin Dashboard</span>
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                )}
                            </nav>
                        </div>
                    </div>
                )}
            </header>
        </div>
    );
}
