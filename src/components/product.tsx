"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";
import { Button } from "./ui/button";

const items = [
    {
        id: 1,
        brand: "APPLE",
        name: "Apple iPhone 14 Pro – Space Black",
        price: "$999.99",
        image:
            "https://images.unsplash.com/photo-1664478546384-1b1c4a829af9?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 2,
        brand: "SONY",
        name: "Sony Wireless Noise Cancelling Headphones",
        price: "$249.99",
        image:
            "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 3,
        brand: "SAMSUNG",
        name: "Samsung 4K Ultra HD Smart TV",
        price: "$799.99",
        image:
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 4,
        brand: "CANON",
        name: "Canon EOS Mirrorless Camera",
        price: "$649.99",
        image:
            "https://images.unsplash.com/photo-1519183071298-a2962eadc94e?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 5,
        brand: "NIKE",
        name: "Nike Air Running Sneakers",
        price: "$129.99",
        image:
            "https://images.unsplash.com/photo-1528701800489-20be3c59f67a?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 6,
        brand: "MACBOOK",
        name: "MacBook Pro 16-inch M2",
        price: "$2199.99",
        image:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 7,
        brand: "FITBIT",
        name: "Smart Fitness Watch",
        price: "$199.99",
        image:
            "https://images.unsplash.com/photo-1511732351661-6b39d3d30f2b?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 8,
        brand: "JBL",
        name: "Portable Bluetooth Speaker",
        price: "$89.99",
        image:
            "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 9,
        brand: "ASUS",
        name: "Gaming Laptop RGB Edition",
        price: "$1399.99",
        image:
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 10,
        brand: "DYSON",
        name: "Dyson Cordless Vacuum Cleaner",
        price: "$399.99",
        image:
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
    },
];

export default function ProductSection({
    title,
}: {
    title: string;
}) {
    return (
        <section className="mt-8 bg-white border rounded-sm">
            <div className="p-4 flex items-center justify-between gap-4">
                <div className="mozilla-text text-xl lg:text-2xl font-bold">{title}</div>
                <Button variant="link" className="p-0 text-sm text-muted-foreground hover:text-foreground">
                    View All
                </Button>
            </div>

            {/* <div className="px-4 pb-3 pt-3">
                <Tabs defaultValue={tabs[0]}>
                    <TabsList className="h-8 bg-transparent p-0 gap-2 flex flex-wrap justify-end md:justify-start">
                        {tabs.map((t) => (
                            <TabsTrigger
                                key={t}
                                value={t}
                                className="h-8 rounded-sm border bg-white data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
                            >
                                {t}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div> */}

            {/* Desktop grid (like screenshot rows) */}
            <div className="hidden md:grid grid-cols-5 gap-0 border-t">
                {items.slice(0, 10).map((p) => (
                    <div key={p.id} className="p-4 border-r last:border-r-0 border-b">
                        <div className="relative h-48">
                            <Image
                                src={p.image}
                                alt={p.name}
                                className="w-full h-full object-contain"
                                width={1000}
                                height={1000}
                            />
                        </div>
                        <div className="mt-2 text-[11px] text-muted-foreground">{p.brand}</div>
                        <Link href="/shop/1" className="mt-1 text-xs font-medium line-clamp-2">{p.name}</Link>
                        <div className="mt-2 text-sm font-bold text-green-600">{p.price}</div>
                        {/* <div className="mt-2 h-1 rounded bg-gray-200 overflow-hidden">
                            <div className="h-full w-2/3 bg-yellow-400" />
                        </div> */}
                    </div>
                ))}
            </div>

            {/* Mobile slider (real carousel) */}
            <div className="md:hidden border-t p-4">
                <Carousel opts={{ align: "start", loop: true }}>
                    <CarouselContent className="-ml-3">
                        {items.slice(0, 10).map((p) => (
                            <CarouselItem key={p.id} className="pl-3 basis-1/2">
                                <div className="border rounded-sm p-3">
                                    <div className="relative h-h-48">
                                        <Image
                                            src={p.image}
                                            alt={p.name}
                                            width={1000}
                                            height={1000}
                                            className="object-contain w-full h-full"
                                        />
                                    </div>
                                    <div className="mt-2 text-[11px] text-muted-foreground">{p.brand}</div>
                                    <Link href="/product/1" className="mt-1 text-xs font-medium line-clamp-2">
                                        <Button variant="link" className="p-0 text-gray-800 hover:text-primary">
                                            {p.name}
                                        </Button>
                                    </Link>
                                    <div className="mt-2 text-sm font-bold text-green-600">{p.price}</div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex" />
                </Carousel>
            </div>
        </section>
    );
}
