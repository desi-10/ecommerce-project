"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const images = [
    "/martfury/p/earphone-1.png",
    "/martfury/p/earphone-2.png",
    "/martfury/p/earphone-3.png",
    "/martfury/p/earphone-4.png",
];

export default function ProductGallery() {
    const [active, setActive] = useState(0);
    const activeSrc = useMemo(() => images[active] ?? images[0], [active]);

    return (
        <div className="flex gap-4">
            {/* Desktop thumbs (vertical) */}
            <div className="hidden md:flex w-16 flex-col gap-3">
                {images.map((src, idx) => (
                    <button
                        key={src}
                        onClick={() => setActive(idx)}
                        className={[
                            "relative h-14 w-14 border bg-white",
                            idx === active ? "border-yellow-500" : "border-neutral-200",
                        ].join(" ")}
                        aria-label={`Thumbnail ${idx + 1}`}
                    >
                        <Image src={src} alt="" fill className="object-contain p-1" />
                    </button>
                ))}
            </div>

            {/* Main image */}
            <div className="flex-1">
                <div className="relative w-full bg-white border border-neutral-200">
                    <div className="relative aspect-square w-full">
                        <Image src={activeSrc} alt="Product image" fill className="object-contain p-6" priority />
                    </div>
                </div>

                {/* Mobile thumbs (horizontal slider) */}
                <div className="md:hidden mt-3">
                    <Carousel opts={{ align: "start" }}>
                        <CarouselContent className="-ml-3">
                            {images.map((src, idx) => (
                                <CarouselItem key={src} className="pl-3 basis-1/4">
                                    <button
                                        onClick={() => setActive(idx)}
                                        className={[
                                            "relative h-16 w-full border bg-white",
                                            idx === active ? "border-yellow-500" : "border-neutral-200",
                                        ].join(" ")}
                                    >
                                        <Image src={src} alt="" fill className="object-contain p-1" />
                                    </button>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
        </div>
    );
}
