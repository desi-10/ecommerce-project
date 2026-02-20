"use client";

import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart } from "lucide-react";
import { Sheet, SheetContent } from "../ui/sheet";
import { Button } from "../ui/button";
import { useWishlistStore } from "@/stores/wishlist.store";
import { useCartStore } from "@/stores/cart.store";


type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function WishlistSheet({ open, setOpen }: Props) {
    const items = useWishlistStore((s) => s.items);
    const remove = useWishlistStore((s) => s.remove);

    const addItemWithQty = useCartStore((s) => s.addItemWithQty);

    const moveToCart = (id: string) => {
        const item = items.find((i) => i.id === id);
        if (!item) return;

        addItemWithQty(
            {
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
            },
            1,
        );

        remove(id);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="right" showCloseButton={false} className="w-full sm:max-w-md p-0">
                {/* Header */}
                <div className="px-4 py-4 border-b flex items-center justify-between">
                    <div>
                        <div className="text-sm font-semibold">Wishlist</div>
                        <div className="text-xs text-muted-foreground">
                            {items.length} item{items.length === 1 ? "" : "s"}
                        </div>
                    </div>

                    <button
                        onClick={() => setOpen(false)}
                        className="h-9 w-9 grid place-items-center border rounded-sm hover:bg-neutral-50"
                        aria-label="Close wishlist"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-4 py-4 space-y-4 max-h-[70vh] overflow-auto">
                    {items.length === 0 ? (
                        <div className="py-10 text-center">
                            <div className="mx-auto w-36">
                                <Image
                                    width={100}
                                    height={100}
                                    src="https://img.icons8.com/carbon-copy/100/like--v1.png"
                                    alt="wishlist"
                                />
                            </div>

                            <div className="text-sm font-semibold mt-2">Your wishlist is empty</div>
                            <p className="mt-2 text-sm text-muted-foreground">Save items you love for later.</p>

                            <Button onClick={() => setOpen(false)}>Continue shopping</Button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="border rounded-sm p-3 bg-white">
                                <div className="flex gap-3">
                                    {/* Image */}
                                    <div className="relative h-16 w-16 border bg-white rounded-sm overflow-hidden">
                                        <Image
                                            src={item.image || "/martfury/product.png"}
                                            alt={item.name}
                                            fill
                                            className="object-contain p-2"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <Link
                                                    href={`/shop/${item.id}`}
                                                    className="text-sm font-medium line-clamp-2 hover:text-blue-600"
                                                    onClick={() => setOpen(false)}
                                                >
                                                    {item.name}
                                                </Link>

                                                <div className="mt-1 text-sm font-semibold">
                                                    ${Number(item.price).toFixed(2)}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => remove(item.id)}
                                                className="h-8 w-8 grid place-items-center border rounded-sm hover:bg-neutral-50"
                                                aria-label="Remove from wishlist"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-3 flex gap-2">
                                            <Button onClick={() => moveToCart(item.id)}>
                                                <ShoppingCart className="h-4 w-4 mr-1" />
                                                Add to cart
                                            </Button>

                                            <Button size="sm" variant="outline" className="rounded-sm" asChild>
                                                <Link href={`/shop/${item.id}`} onClick={() => setOpen(false)}>
                                                    View
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
