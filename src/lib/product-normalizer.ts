import type { Product, ProductImage, ProductStatus, Variant } from "@/types/product";
import type { Review } from "@/types/reviews";

export type RawProductImage = {
  id?: string;
  url: string;
  publicId?: string;
  alt?: string | null;
  position?: number;
};

export type RawProductVariant = {
  id?: string;
  name?: string;
  sku?: string | null;
  price?: number | string;
  salePrice?: number | string;
  options?: unknown;
  inventory?: {
    id?: string;
    stock: number;
  };
};

export type RawProductData = {
  id?: string | number;
  brand?: string | null;
  name?: string;
  description?: string;
  image?: string;
  images?: Array<RawProductImage | string>;
  price?: number | string;
  salePrice?: number | string;
  stock?: number;
  inventory?: {
    id?: string;
    stock: number;
  };
  variants?: RawProductVariant[];
  rating?: number;
  reviews?: Review[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

function parseOptions(options: unknown): Record<string, string> {
  if (options && typeof options === "object" && !Array.isArray(options)) {
    const record: Record<string, string> = {};
    for (const [key, val] of Object.entries(options as Record<string, unknown>)) {
      record[key] = String(val ?? "");
    }
    return record;
  }
  if (typeof options === "string") {
    try {
      const parsed = JSON.parse(options);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const record: Record<string, string> = {};
        for (const [key, val] of Object.entries(parsed)) {
          record[key] = String(val ?? "");
        }
        return record;
      }
    } catch (_) {}
  }
  return {};
}

/**
 * Normalizes API product data to ensure consistent field mapping
 * across the frontend (dashboard and storefront).
 */
export function normalizeProduct(rawProduct: RawProductData): Product {
  const firstVariant = rawProduct.variants?.[0];
  const priceVal = Number(firstVariant?.price ?? rawProduct.price ?? 0);
  const salePriceVal = firstVariant?.salePrice ? Number(firstVariant.salePrice) : (rawProduct.salePrice ? Number(rawProduct.salePrice) : undefined);
  const stockVal = firstVariant?.inventory?.stock ?? rawProduct.inventory?.stock ?? rawProduct.stock ?? 0;

  const firstImage = rawProduct.images?.[0];
  const firstImageUrl = typeof firstImage === "string"
    ? firstImage
    : (firstImage && typeof firstImage === "object" && "url" in firstImage ? firstImage.url : undefined);

  const normalizedImages: ProductImage[] = rawProduct.images?.length
    ? rawProduct.images.map((img, index) => {
        if (typeof img === "string") {
          return {
            id: `img-${index}`,
            url: img,
            publicId: `img-${index}`,
          };
        }
        return {
          id: img.id ?? `img-${index}`,
          url: img.url,
          publicId: img.publicId ?? `img-${index}`,
          alt: img.alt ?? null,
          position: img.position ?? index,
        };
      })
    : (rawProduct.image 
        ? [{ id: "default", url: rawProduct.image, publicId: "default" }] 
        : []);

  const normalizedVariants: Variant[] = (rawProduct.variants ?? []).map((v, index) => {
    return {
      id: v.id ?? `v-${index}`,
      name: v.name ?? `Variant ${index + 1}`,
      sku: v.sku ?? null,
      price: String(v.price ?? 0),
      salePrice: String(v.salePrice ?? v.price ?? 0),
      options: parseOptions(v.options),
      inventory: {
        id: v.inventory?.id ?? `inv-${index}`,
        stock: Number(v.inventory?.stock ?? 0),
      },
    };
  });

  const reviewsArr = Array.isArray(rawProduct.reviews) ? rawProduct.reviews : [];
  const calculatedRating = reviewsArr.length
    ? reviewsArr.reduce((sum: number, r: Review) => sum + (Number(r.rating) || 0), 0) / reviewsArr.length
    : 0;

  return {
    // Keep original data for reference
    ...rawProduct,

    id: String(rawProduct.id),
    brand: rawProduct.brand ?? "",
    name: rawProduct.name ?? "Unnamed Product",
    description: rawProduct.description ?? "",
    image: rawProduct.image ?? firstImageUrl ?? "/martfury/product.png",
    images: normalizedImages,
    
    // Pricing
    price: salePriceVal ? salePriceVal : priceVal,
    oldPrice: salePriceVal ? priceVal : null,
    
    // Alternative pricing fields
    salePrice: salePriceVal,
    
    // Stock and inventory
    stock: stockVal,
    
    // Variants
    variants: normalizedVariants,
    
    // Additional metadata
    rating: typeof rawProduct.rating === 'number' ? rawProduct.rating : calculatedRating,
    reviews: reviewsArr,
    status: (rawProduct.status === "INACTIVE" ? "INACTIVE" : "ACTIVE") as ProductStatus,
    createdAt: rawProduct.createdAt ?? new Date().toISOString(),
    updatedAt: rawProduct.updatedAt ?? new Date().toISOString(),
  };
}

/**
 * Normalizes an array of products
 */
export function normalizeProducts(rawProducts: RawProductData[]): Product[] {
  return rawProducts.map(normalizeProduct);
}

/**
 * Formats price for display with currency symbol
 */
export function formatPrice(price: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(price);
}

/**
 * Gets discount percentage between original and sale price
 */
export function getDiscountPercentage(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Checks if a product is on sale
 */
export function isOnSale(product: Product): boolean {
  return !!(product.salePrice && product.price && product.salePrice < product.price);
}

/**
 * Gets the primary image URL for a product
 */
export function getProductImageUrl(product: Product): string {
  if (typeof product.image === "string") {
    return product.image;
  }
  if (Array.isArray(product.images) && product.images.length > 0) {
    const firstImage = product.images[0];
    return typeof firstImage === "string" ? firstImage : firstImage?.url ?? "/default-product.png";
  }
  return "/default-product.png";
}
