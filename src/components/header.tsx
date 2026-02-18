"use client";

import { Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Wrapper from "./wrapper";
import Navbar from "./navbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import Image from "next/image";
import Link from "next/link";
import CartSheet from "./sheets/cart-sheet";
import WishlistSheet from "./sheets/wishlist-sheet";

export default function Header() {
    const [open, setOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false)
    const [wishlistOpen, setWishlistOpen] = useState(false);

    return (
        <div className="bg-white lg:sticky top-0 z-20">
            <CartSheet open={cartOpen} setOpen={setCartOpen} />
            <WishlistSheet open={wishlistOpen} setOpen={setWishlistOpen} />

            <header >
                <div className="border-b">
                    <Wrapper>
                        <div className="py-6 flex items-center gap-4">
                            <button className="md:hidden" onClick={() => setOpen((v) => !v)}>
                                <Menu className="h-5 w-5" />
                            </button>

                            <div className="text-2xl font-extrabold tracking-tight">
                                mart<span className="text-blue-600">fury</span>
                            </div>

                            {/* Desktop search */}
                            <div className="hidden md:flex flex-1 items-center">
                                <div className="flex w-full">

                                    {/* Category Select */}
                                    <Select defaultValue="all">
                                        <SelectTrigger className="w-40 rounded-r-none border-r-0 text-xs min-h-11">
                                            <SelectValue placeholder="All" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="electronics">Electronics</SelectItem>
                                            <SelectItem value="fashion">Fashion</SelectItem>
                                            <SelectItem value="computers">Computers</SelectItem>
                                            <SelectItem value="beauty">Health & Beauty</SelectItem>
                                            <SelectItem value="home">Home & Garden</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* Search Input */}
                                    <Input
                                        className="rounded-none border-l-0 border-r-0 h-11"
                                        placeholder="I'm shopping for..."
                                    />

                                    {/* Search Button */}
                                    <Button className="rounded-l-none bg-primary h-11">
                                        {/* <Search className="h-4 w-4 mr-2" /> */}
                                        Search
                                    </Button>
                                </div>
                            </div>

                            {/* Icons */}
                            <div className="ml-auto flex items-center gap-6">

                                {/* Wishlist */}
                                <button onClick={() => setWishlistOpen(true)} className="relative size-10 cursor-pointer">
                                    <Image
                                        width={100}
                                        height={100}
                                        src="https://img.icons8.com/ios/50/like--v1.png"
                                        alt="wishlist"
                                        className="w-full h-full"
                                    />

                                    {/* Badge */}
                                    <span className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center">
                                        2
                                    </span>
                                </button>

                                {/* Cart */}
                                <button onClick={() => setCartOpen(true)} className="relative size-10 cursor-pointer">
                                    <Image
                                        width={100}
                                        height={100}
                                        src="https://img.icons8.com/comic/100/shopping-bag.png"
                                        alt="shopping-bag"
                                        className="w-full h-full"
                                    />

                                    {/* Badge */}
                                    <span className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center">
                                        10
                                    </span>
                                </button>

                                {/* Auth */}
                                <button className="hidden md:inline-flex items-center gap-2 text-sm">
                                    <div className="w-10">
                                        <Image
                                            width={100}
                                            height={100}
                                            src="https://img.icons8.com/parakeet-line/48/user.png"
                                            alt="user"
                                            className="w-full h-full"
                                        />
                                    </div>
                                    <span className="text-left">
                                        <Link href="/auth/sign-in">
                                            <span className="block text-sm text-muted-foreground hover:text-primary">
                                                Login
                                            </span>
                                        </Link>
                                        <Link href="/auth/sign-up">
                                            <span className="block font-medium hover:text-primary">
                                                Register
                                            </span>
                                        </Link>
                                    </span>
                                </button>
                            </div>

                        </div>
                    </Wrapper>

                </div>
                <Navbar />

                {/* Mobile search like screenshot */}
                <div className="md:hidden px-4 pb-4">
                    <div className="flex">
                        <Input className="rounded-r-none" placeholder="Search something..." />
                        <Button className="rounded-l-none bg-blue-600 hover:bg-blue-700 px-4">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Optional mobile drawer placeholder */}
                {open && (
                    <div className="md:hidden px-4 pb-4 text-sm text-muted-foreground">
                        Menu (wire your links here)
                    </div>
                )}
            </header>
        </div>
    );
}
