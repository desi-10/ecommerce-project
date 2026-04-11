"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

type ProductImage =
  | string
  | {
      url?: string;
      src?: string;
      image?: string;
    };

type ProductGalleryProps = {
  // pass product images here (strings or objects)
  images?: ProductImage[];
  // main product image (first/primary)
  mainImage?: string | null;
  // optional: if you want to reset gallery when variant changes
  variantId?: string;
  // fallback image if product has none
  fallbackImages?: string[];
};

const DEFAULT_FALLBACK = [
  "/martfury/product.png",
];

function normalizeImages(input?: ProductImage[]) {
  const out = input
    ?.map((img) => {
      if (!img) return null;
      if (typeof img === "string") return img;
      return img.url || img.src || img.image || null;
    })
    .filter(Boolean) as string[] | undefined;

  return out && out.length ? out : undefined;
}

export default function ProductGallery({
  images,
  mainImage,
  variantId,
  fallbackImages = DEFAULT_FALLBACK,
}: ProductGalleryProps) {
  const resolvedImages = useMemo(() => {
    const normalized = normalizeImages(images);
    if (normalized && normalized.length > 0) {
      // If mainImage exists and isn't already in the array, prepend it
      if (mainImage && !normalized.includes(mainImage)) {
        return [mainImage, ...normalized];
      }
      return normalized;
    }
    // No images array — use mainImage if available, else fallback
    if (mainImage) return [mainImage];
    return fallbackImages;
  }, [images, mainImage, fallbackImages]);

  const [active, setActive] = useState(0);

  // ✅ Reset when product images change or variant changes
  useEffect(() => {
    setActive(0);
  }, [variantId, resolvedImages.join("|")]);

  const activeSrc = useMemo(
    () => resolvedImages[active] ?? resolvedImages[0],
    [active, resolvedImages],
  );

  return (
    <div className="flex gap-4">
      {/* Desktop thumbs (vertical) */}
      <div className="hidden md:flex w-16 flex-col gap-3">
        {resolvedImages.map((src, idx) => (
          <button
            key={`${src}-${idx}`}
            onClick={() => setActive(idx)}
            className={[
              "relative h-14 w-14 border bg-white",
              idx === active ? "border-yellow-500" : "border-neutral-200",
            ].join(" ")}
            aria-label={`Thumbnail ${idx + 1}`}
            type="button"
          >
            <Image src={src} alt="" fill className="object-contain p-1" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1">
        <div className="relative w-full bg-white border border-neutral-200">
          <div className="relative aspect-square w-full">
            <Image
              src={activeSrc}
              alt="Product image"
              fill
              className="object-contain p-6"
              priority
            />
          </div>
        </div>

        {/* Mobile thumbs (horizontal slider) */}
        <div className="md:hidden mt-3">
          <Carousel opts={{ align: "start" }}>
            <CarouselContent className="-ml-3">
              {resolvedImages.map((src, idx) => (
                <CarouselItem key={`${src}-${idx}`} className="pl-3 basis-1/4">
                  <button
                    onClick={() => setActive(idx)}
                    className={[
                      "relative h-16 w-full border bg-white",
                      idx === active
                        ? "border-yellow-500"
                        : "border-neutral-200",
                    ].join(" ")}
                    type="button"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-contain p-1"
                    />
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
