"use client";

import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";
import { Button } from "./ui/button";

const items = Array.from({ length: 10 }).map((_, idx) => ({
    id: idx + 1,
    brand: "YOUNG SHOP",
    name: "Apple iPhone 7 Plus 128 GB – Red Color",
    price: "$90.99",
}));

export default function ProductSection({
    title,
    tabs,
}: {
    title: string;
    tabs: string[];
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
                            <Image src="/martfury/product.png" alt={p.name} fill className="object-contain" />
                        </div>
                        <div className="mt-2 text-[11px] text-muted-foreground">{p.brand}</div>
                        <Link href="/product/1" className="mt-1 text-xs font-medium line-clamp-2">{p.name}</Link>
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
                                        <Image src="/martfury/product.png" alt={p.name} fill className="object-contain" />
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
