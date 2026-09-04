"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import Image from "next/image";
import CartSheet from "./sheets/cart-sheet";
import WishlistSheet from "./sheets/wishlist-sheet";
import { useLanguage } from "@/context/language-context";

export default function MobileBottomNav() {
    const { t } = useLanguage();
    const [searchOpen, setSearchOpen] = useState(false);
    const [wishlistOpen, setWishlistOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);

    return (
        <>
            <CartSheet open={cartOpen} setOpen={setCartOpen} />
            <WishlistSheet open={wishlistOpen} setOpen={setWishlistOpen} />

            {/* Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
                <div className="grid grid-cols-5">
                    <Link
                        href="/"
                        className="py-3 flex flex-col items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                    >
                        <div className="size-6">
                            <Image src={"https://img.icons8.com/ios/50/home--v1.png"} alt="home" width={1000} height={1000} />
                        </div>
                        {t("nav.home", "Home")}
                    </Link>

                    <button
                        onClick={() => setSearchOpen(true)}
                        className="py-3 flex flex-col items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                    >
                        <Search className="h-6 w-6 text-black" />
                        {t("search.button", "Search")}
                    </button>

                    <button
                        onClick={() => setWishlistOpen(true)}
                        className="py-3 flex flex-col items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                    >
                        <div className="size-6">
                            <Image src="https://img.icons8.com/ios/50/like--v1.png" alt="wishlist" width={1000} height={1000} />
                        </div>
                        {t("wishlist.title", "Wishlist")}
                    </button>

                    <button
                        onClick={() => setCartOpen(true)}
                        className="py-3 flex flex-col items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                    >
                        <div className="size-6">
                            <Image src="https://img.icons8.com/comic/100/shopping-bag.png" alt="cart" width={1000} height={1000} />
                        </div>
                        {t("cart.title", "Cart")}
                    </button>

                    <Link 
                        href="/account"
                        className="py-3 flex flex-col items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                    >
                        <div className="size-6">
                            <Image src="https://img.icons8.com/parakeet-line/48/user.png" alt="account" width={1000} height={1000} />
                        </div>
                        {t("account.title", "Account")}
                    </Link>
                </div>
            </nav>
        </>
    );
}
