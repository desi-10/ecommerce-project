"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Home, LayoutGrid, Search, ShoppingCart, User } from "lucide-react";
import { BottomSheet } from "./sheets/bottom-sheet";
import SearchSheetContent from "./sheets/search-sheet";
import WishlistSheetContent from "./sheets/wishlist-sheet";
import AccountSheetContent from "./sheets/account-sheep";
import Image from "next/image";
import CartSheet from "./sheets/cart-sheet";
import WishlistSheet from "./sheets/wishlist-sheet";


export default function MobileBottomNav() {
    const [searchOpen, setSearchOpen] = useState(false);
    const [wishlistOpen, setWishlistOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);


    return (
        <>
            <CartSheet open={cartOpen} setOpen={setCartOpen} />
            <WishlistSheet open={wishlistOpen} setOpen={setWishlistOpen} />

            {/* Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
                <div className="grid grid-cols-5">
                    <Link
                        href="/"
                        className="py-3 flex flex-col items-center gap-1 text-xs  text-muted-foreground"
                    >
                        <div className="size-7">
                            <Image src={"https://img.icons8.com/ios/50/home--v1.png"} alt="home--v1" width={1000} height={1000} />
                        </div>
                        Home
                    </Link>

                    <button
                        onClick={() => setSearchOpen(true)}
                        className="py-3 flex flex-col items-center gap-1 text-[10px] text-muted-foreground"
                    >
                        <Search className="h-7 w-7 text-black" />
                        Search
                    </button>

                    <button
                        onClick={() => setWishlistOpen(true)}
                        className="py-3 flex flex-col items-center gap-1 text-[10px] text-muted-foreground"
                    >
                        <div className="size-7">
                            <Image src="https://img.icons8.com/ios/50/like--v1.png" alt="wishlist" width={1000} height={1000} />
                        </div>
                        Wishlist
                    </button>

                    <button
                        onClick={() => setCartOpen(true)}
                        className="py-3 flex flex-col items-center gap-1 text-[10px] text-muted-foreground"
                    >

                        <div className="size-7">
                            <Image src="https://img.icons8.com/comic/100/shopping-bag.png" alt="cart" width={1000} height={1000} />
                        </div>
                        Cart
                    </button>

                    <Link href="/auth/login">
                        <button
                            className="py-3 flex flex-col items-center gap-1 text-[10px] text-muted-foreground"
                        >

                            <div className="size-7">
                                <Image src="https://img.icons8.com/parakeet-line/48/user.png" alt="cart" width={1000} height={1000} />
                            </div>
                            Account
                        </button>
                    </Link>
                </div>
            </nav>
        </>
    );
}
