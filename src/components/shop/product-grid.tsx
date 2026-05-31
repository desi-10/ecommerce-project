"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Check, BarChart3 } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";
import type { Product } from "@/types/product";

function pickDisplayVariant(p: Product) {
  if (!p.variants?.length) return null;

  // Prefer a variant with sale price > 0, else first
  const withSale = p.variants.find((v) => Number(v.salePrice) > 0);
  return withSale ?? p.variants[0];
}

export default function ProductGridCard({ p }: { p: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  const toggleWish = useWishlistStore((s) => s.toggle);

  const v = pickDisplayVariant(p);

  // Use variantId as the unique cart/wish key (best practice)
  const keyId = v?.id ? String(v.id) : String(p.id);

  const inCart = useCartStore((s) => s.has(keyId));
  const inWish = useWishlistStore((s) => s.has(keyId));

  const price = v ? Number(v.salePrice || v.price || 0) : 0;
  const oldPrice = v && Number(v.salePrice) > 0 ? Number(v.price || 0) : null;

  const stock = v?.inventory?.stock ?? 0;
  const disabled = !v || stock <= 0;

  // Resolve product image from API data
  const imageSrc =
    p.image ??
    p.images?.[0]?.url ??
    "/martfury/product.png";
  const brand = ""; // or p.brand ?? "" if you add later
  const reviews = 0;

  const productHref = `/shop/${p.id}`;

  return (
    <div className="group border border-neutral-200 bg-white p-3 transition hover:shadow-sm">
      {/* Image + hover overlay */}
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={p.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-4 transition-transform duration-200 group-hover:scale-[1.02]"
        />

        {/* Hover actions */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="pointer-events-auto translate-y-2 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white/90 p-2 shadow-sm">
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9"
                onClick={() =>
                  toggleWish({
                    id: keyId,
                    name: p.name,
                    price,
                    image: imageSrc,
                    brand,
                  })
                }
                aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={`h-4 w-4 ${
                    inWish ? "fill-red-500 text-red-500" : "text-neutral-700"
                  }`}
                />
              </Button>

              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9"
                disabled={disabled}
                onClick={() => {
                  if (!inCart && v) {
                    addItem({
                      id: keyId, // store by variant id
                      name: p.name,
                      price,
                      image: imageSrc,
                      // optional extras
                      // productId: p.id,
                      // variantId: v.id,
                      // sku: v.sku,
                    });
                  }
                }}
                aria-label={inCart ? "Already in cart" : "Add to cart"}
              >
                {inCart ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
              </Button>

              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9"
                onClick={() => console.log("compare", p.id)}
                aria-label="Compare"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sale badge */}
        {oldPrice !== null && oldPrice > price ? (
          <div className="absolute left-2 top-2 rounded bg-red-500 px-2 py-1 text-[10px] font-semibold text-white">
            Sale
          </div>
        ) : null}
      </div>

      {/* Text content */}
      {brand ? (
        <div className="mt-2 text-[11px] text-muted-foreground">{brand}</div>
      ) : null}

      <Link
        href={productHref}
        className="mt-1 line-clamp-2 cursor-pointer text-xs font-medium text-blue-600 hover:underline"
      >
        {p.name}
      </Link>

      <div className="mt-1 text-xs text-yellow-500">
        {"★★★★☆"} <span className="text-muted-foreground">({reviews})</span>
      </div>

      <div className="mt-1 flex items-center gap-2">
        <div className="text-sm font-semibold">${price.toFixed(2)}</div>
        {oldPrice !== null && oldPrice > price ? (
          <div className="text-xs text-muted-foreground line-through">
            ${oldPrice.toFixed(2)}
          </div>
        ) : null}
      </div>

      {/* Bottom button */}
      <div className="mt-3">
        <Button
          className="w-full"
          variant={inCart ? "outline" : "default"}
          disabled={disabled}
          onClick={() => {
            if (!inCart && v) {
              addItem({ id: keyId, name: p.name, price, image: imageSrc });
            }
          }}
        >
          {disabled ? "Out of stock" : inCart ? "In cart ✓" : "Add to cart"}
        </Button>
      </div>
    </div>
  );
}
