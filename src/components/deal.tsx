"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "./ui/button";

const products = [
    {
        id: 1,
        category: "Gaming",
        name: "Xbox Wireless Controller – Carbon Black",
        price: "$59.99",
        image:
            "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 2,
        category: "Audio",
        name: "Wireless Bluetooth Over-Ear Headphones",
        price: "$89.99",
        image:
            "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 3,
        category: "Laptops",
        name: "Ultra-Slim Chromebook 13-inch",
        price: "$299.99",
        image:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 4,
        category: "Computers",
        name: "Apple MacBook Air M2 – 13-inch",
        price: "$1099.99",
        image:
            "https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 5,
        category: "Mobile Phones",
        name: "Samsung Galaxy Smartphone – 128GB",
        price: "$499.99",
        image:
            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 6,
        category: "Smart Home",
        name: "Smart LED Light Starter Kit",
        price: "$39.99",
        image:
            "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    },
];


export default function DealOfDay() {
    return (
        <section className="mt-6 bg-white border rounded-sm">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="mozilla-text text-xl lg:text-2xl font-bold">Deal of the day</div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground hidden sm:inline">End in:</span>
                    <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded">
                        11:19:30:59
                    </span>
                    <Button variant="link" className="p-0 text-sm text-muted-foreground hover:text-foreground">View all</Button>
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
                                    <div className="relative h-48">
                                        <Image
                                            src={p.image}
                                            alt={p.name}
                                            width={1000}
                                            height={1000}
                                            className="object-contain h-full w-full"
                                        />
                                    </div>
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

