"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";

const products = [
    { id: 1, name: "Xbox One Wireless Controller Black Color", price: "$59.99" },
    { id: 2, name: "Sound Intone I65 Earphone White Version", price: "$21.99" },
    { id: 3, name: "Asus Chromebook Flip – 10.2 inch", price: "$70.99" },
    { id: 4, name: "Apple Macbook Air Retina 13-inch", price: "$81.99" },
    { id: 5, name: "Samsung Galaxy A10 4GB RAM", price: "$86.99" },
    { id: 6, name: "Another Deal Product", price: "$33.99" },
];

export default function DealOfDay() {
    return (
        <section className="mt-6 bg-white border rounded-sm">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="font-bold">Deal of the day</div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground hidden sm:inline">End in:</span>
                    <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded">
                        11:19:30:59
                    </span>
                    <button className="text-xs text-muted-foreground hover:text-foreground">View all</button>
                </div>
            </div>
            <Separator />

            <div className="p-4">
                <Carousel opts={{ align: "start", loop: true }}>
                    <CarouselContent className="-ml-3">
                        {products.map((p) => (
                            <CarouselItem
                                key={p.id}
                                className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/5"
                            >
                                <div className="border rounded-sm p-3 hover:shadow-sm transition bg-white">
                                    <div className="relative h-24">
                                        <Image
                                            src="/martfury/product.png"
                                            alt={p.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="mt-2 text-[11px] text-muted-foreground">YOUNG SHOP</div>
                                    <div className="mt-1 text-xs font-medium line-clamp-2">{p.name}</div>
                                    <div className="mt-2 text-sm font-bold text-green-600">{p.price}</div>

                                    {/* rating-ish bar (like screenshot) */}
                                    <div className="mt-2 h-1 rounded bg-gray-200 overflow-hidden">
                                        <div className="h-full w-2/3 bg-yellow-400" />
                                    </div>
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

