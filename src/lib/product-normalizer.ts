import type { Product } from "@/types/product";

/**
 * Normalizes API product data to ensure consistent field mapping
 * across the frontend (dashboard and storefront).
 */
export function normalizeProduct(rawProduct: any): Product {
  return {
    id: String(rawProduct.id),
    brand: rawProduct.brand ?? "",
    name: rawProduct.name ?? "Unnamed Product",
    description: rawProduct.description ?? "",
    image: rawProduct.image ?? rawProduct.images?.[0]?.url ?? rawProduct.images?.[0] ?? "/default-product.png",
    images: rawProduct.images ?? [rawProduct.image].filter(Boolean),
    
    // Pricing - use sale price as primary if available
    price: rawProduct.salePrice ? Number(rawProduct.salePrice) : Number(rawProduct.price ?? 0),
    oldPrice: rawProduct.salePrice ? Number(rawProduct.price ?? 0) : null,
    
    // Alternative pricing fields
    salePrice: rawProduct.salePrice ? Number(rawProduct.salePrice) : undefined,
    
    // Stock and inventory
    stock: rawProduct.inventory?.stock ?? rawProduct.stock ?? 0,
    inventory: rawProduct.inventory,
    
    // Variants
    variants: rawProduct.variants ?? [],
    
    // Additional metadata
    rating: rawProduct.rating ?? 4,
    reviews: rawProduct.reviews ?? 0,
    status: rawProduct.status ?? "ACTIVE",
    createdAt: rawProduct.createdAt,
    updatedAt: rawProduct.updatedAt,
    
    // Keep original data for reference
    ...rawProduct,
  };
}

/**
 * Normalizes an array of products
 */
export function normalizeProducts(rawProducts: any[]): Product[] {
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
