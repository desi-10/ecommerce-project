/**
 * Currency formatting utilities for Ghana Cedis (GHS)
 */

/**
 * Format amount as Ghana Cedis
 * @param amount - The amount to format
 * @param showCode - Whether to show "GHS" code (default: true)
 * @returns Formatted string like "₵1,234.50" or "₵1,234.50 GHS"
 */
export function formatGHS(amount: number | string, showCode: boolean = true): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return '₵0.00';
  }

  // Format with comma separators and 2 decimal places
  const formatted = numAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return showCode ? `₵${formatted} GHS` : `₵${formatted}`;
}

/**
 * Format amount as currency with custom symbol
 * @param amount - The amount to format
 * @param symbol - Currency symbol (default: "₵")
 * @param showCode - Whether to show currency code
 * @returns Formatted string
 */
export function formatCurrency(
  amount: number | string,
  symbol: string = '₵',
  showCode?: string
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return `${symbol}0.00`;
  }

  const formatted = numAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return showCode ? `${symbol}${formatted} ${showCode}` : `${symbol}${formatted}`;
}

/**
 * Parse currency string to number
 * @param currencyString - String like "₵1,234.50" or "1,234.50"
 * @returns Parsed number
 */
export function parseCurrency(currencyString: string): number {
  // Remove currency symbols, spaces, and parse
  const cleaned = currencyString
    .replace(/[₵$€£¥]/g, '')
    .replace(/\s/g, '')
    .replace(/GHS|USD|EUR|GBP|JPY/gi, '')
    .replace(/,/g, '');
  
  return parseFloat(cleaned) || 0;
}

/**
 * Get discount value from percentage
 * @param originalPrice - Original price
 * @param discountPercent - Discount percentage (0-100)
 * @returns Discount amount
 */
export function getDiscountAmount(
  originalPrice: number,
  discountPercent: number
): number {
  return (originalPrice * discountPercent) / 100;
}

/**
 * Get final price after discount
 * @param originalPrice - Original price
 * @param discountPercent - Discount percentage (0-100)
 * @returns Final price after discount
 */
export function getPriceAfterDiscount(
  originalPrice: number,
  discountPercent: number
): number {
  return originalPrice - getDiscountAmount(originalPrice, discountPercent);
}

/**
 * Calculate discount percentage from original and sale price
 * @param originalPrice - Original price
 * @param salePrice - Sale price
 * @returns Discount percentage
 */
export function getDiscountPercent(
  originalPrice: number,
  salePrice: number
): number {
  if (originalPrice === 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}
