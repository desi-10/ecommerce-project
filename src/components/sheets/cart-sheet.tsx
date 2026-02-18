"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetFooter } from "../ui/sheet";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

type CartItem = {
    id: string;
    name: string;
    price: number;
    image?: string;
    qty: number;
};

export default function CartSheet({ open, setOpen }: Props) {
    // ✅ Demo cart state (replace with your store later)
    const [items, setItems] = useState<CartItem[]>([
        {
            id: "1",
            name: "Sound Intone I65 Earphone White Version",
            price: 21.99,
            image: "/martfury/product.png",
            qty: 1,
        },
        {
            id: "2sdellf",
            name: "Apple Macbook Air Retina 13-inch",
            price: 81.99,
            image: "/martfury/product.png",
            qty: 2,
        },
        {
            id: "dvfvqqss2df",
            name: "Apple Macbook Air Retina 13-inch",
            price: 81.99,
            image: "/martfury/product.png",
            qty: 2,
        },
        {
            id: "2df",
            name: "Apple Macbook Air Retina 13-inch",
            price: 81.99,
            image: "/martfury/product.png",
            qty: 2,
        },
        {
            id: "2sdfsdfdsz",
            name: "Apple Macbook Air Retina 13-inch",
            price: 81.99,
            image: "/martfury/product.png",
            qty: 2,
        },
        {
            id: "2sdsdffx",
            name: "Asdpple Macbook Air Retina 13-inch",
            price: 81.99,
            image: "/martfury/product.png",
            qty: 2,
        },
        {
            id: "2sdsdf",
            name: "Apple Macbook Air Retina 13-inch",
            price: 81.99,
            image: "/martfury/product.png",
            qty: 2,
        },
    ]);

    const subtotal = useMemo(
        () => items.reduce((acc, item) => acc + item.price * item.qty, 0),
        [items]
    );

    // If you want shipping/tax later, compute total differently
    const total = subtotal;

    const inc = (id: string) => {
        setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, qty: Math.min(99, i.qty + 1) } : i))
        );
    };

    const dec = (id: string) => {
        setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))
        );
    };

    const remove = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="right" showCloseButton={false} className="w-full h-full sm:max-w-md p-0">
                {/* Header */}
                <div className="px-4 py-4 border-b flex items-center justify-between">
                    <div>
                        <div className="text-sm font-semibold">Shopping Cart</div>
                        <div className="text-xs text-muted-foreground">
                            {items.length} item{items.length === 1 ? "" : "s"}
                        </div>
                    </div>

                    <button
                        onClick={() => setOpen(false)}
                        className="h-9 w-9 grid place-items-center border rounded-sm hover:bg-neutral-50"
                        aria-label="Close cart"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-4 py-4 space-y-4 max-h-[65vh] overflow-auto">
                    {items.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="mx-auto w-36">
                                <Image width={100} height={100} src="https://img.icons8.com/carbon-copy/100/shopping-cart.png" alt="shopping-cart" />
                            </div>
                            <div className="text-sm font-semibold">Your cart is empty</div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Add items to your cart to see them here.
                            </p>
                            <Button
                                className="mt-4 rounded-sm bg-blue-600 hover:bg-blue-700"
                                onClick={() => setOpen(false)}
                            >
                                Continue shopping
                            </Button>
                        </div>
                    ) : (
                        items.map((item) => {
                            const itemSubtotal = item.price * item.qty;

                            return (
                                <div
                                    key={item.id}
                                    className="border rounded-sm p-3 bg-white"
                                >
                                    <div className="flex gap-3">
                                        <div className="relative h-16 w-16 border bg-white rounded-sm overflow-hidden">
                                            <Image
                                                src={item.image || "/martfury/product.png"}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-2"
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <div className="text-sm font-medium line-clamp-2">
                                                        {item.name}
                                                    </div>
                                                    <div className="mt-1 text-xs text-muted-foreground">
                                                        ${item.price.toFixed(2)} each
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => remove(item.id)}
                                                    className="h-8 w-8 grid place-items-center border rounded-sm hover:bg-neutral-50"
                                                    aria-label="Remove item"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>

                                            {/* Qty + Subtotal */}
                                            <div className="mt-3 flex items-center justify-between">
                                                <div className="inline-flex items-center border rounded-sm bg-white">
                                                    <button
                                                        onClick={() => dec(item.id)}
                                                        className="h-9 w-9 grid place-items-center hover:bg-neutral-50"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <div className="h-9 w-10 grid place-items-center text-sm">
                                                        {item.qty}
                                                    </div>
                                                    <button
                                                        onClick={() => inc(item.id)}
                                                        className="h-9 w-9 grid place-items-center hover:bg-neutral-50"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                <div className="text-sm font-semibold">
                                                    ${itemSubtotal.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer totals + actions */}
                {items.length > 0 && (
                    <div className="border-t px-4 py-4 bg-white align-bottom">
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span className="text-foreground font-medium">
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-muted-foreground">
                                <span>Shipping</span>
                                <span className="text-foreground font-medium">—</span>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <span className="font-semibold">Total</span>
                                <span className="font-semibold">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-2">
                            <Button
                                asChild
                            >
                                <Link href="/checkout" onClick={() => setOpen(false)}>
                                    Proceed to checkout
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                className="rounded-sm"
                                onClick={() => setOpen(false)}
                            >
                                Continue shopping
                            </Button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
