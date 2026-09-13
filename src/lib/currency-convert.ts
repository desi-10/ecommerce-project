/**
 * GHS -> USD conversion for Stripe checkout.
 *
 * The storefront prices everything in Ghanaian cedis (GH₵), but Stripe is
 * used here for USD-settling accounts (Paystack already handles GHS
 * natively — see src/cofigs/voltex.ts — so Stripe is the "pay in dollars"
 * option, not a second GHS gateway). The bug this fixes: the GHS amount
 * was being sent to Stripe unconverted with `currency: "usd"`, so a
 * GH₵500 cart was charged as $500.00 — roughly 13-15x the real price.
 *
 * Deliberately NOT a live FX API call: an earlier version of this fetched
 * a rate from a third-party API on every Stripe checkout, which is exactly
 * the kind of dependency that has no business being in the critical path
 * of taking someone's payment — a slow or unreachable host there means a
 * slow or broken checkout (this is what caused a real ~35s hang /
 * `POST /api/order-payment 500` in testing). A rate that changes slowly
 * and doesn't need to be exact to the minute is a config value, not a
 * runtime network call.
 *
 * Set GHS_TO_USD_RATE in .env to update it; falls back to the constant
 * below if unset or invalid. Update periodically — this WILL drift out of
 * date otherwise.
 */

const DEFAULT_GHS_TO_USD_RATE = 0.065; // ~ GH₵15.4 per $1 — approximate, update periodically

function getGhsToUsdRate(): number {
  const fromEnv = Number(process.env.GHS_TO_USD_RATE);
  if (Number.isFinite(fromEnv) && fromEnv > 0) return fromEnv;
  return DEFAULT_GHS_TO_USD_RATE;
}

/** Converts a GH₵ amount to USD, rounded to cents. */
export function convertGhsToUsd(amountGhs: number): number {
  const rate = getGhsToUsdRate();
  return Math.round(amountGhs * rate * 100) / 100;
}
