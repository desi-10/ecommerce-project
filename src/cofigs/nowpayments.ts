import axios from "axios";
import crypto from "crypto";

// Free-to-sign-up hosted crypto checkout — no monthly fee, no buyer-side
// KYC, small per-transaction fee. REST API only (no official maintained
// SDK to pin), same shape as src/cofigs/stripe.ts / voltex.ts.
//
// Sandbox: sign up separately at https://account-sandbox.nowpayments.io
// (a completely different account from the live dashboard) to get a
// sandbox API key + sandbox IPN secret — these do NOT work against the
// live API or vice versa. Flip NOWPAYMENTS_SANDBOX=true in .env to switch
// both the API base URL and which key/secret pair gets used; no need to
// swap the live values out.
const isSandbox = process.env.NOWPAYMENTS_SANDBOX === "true";

const NOWPAYMENTS_API_BASE = isSandbox
  ? "https://api-sandbox.nowpayments.io/v1"
  : "https://api.nowpayments.io/v1";

const apiKey = isSandbox
  ? process.env.NOWPAYMENTS_SANDBOX_API_KEY
  : process.env.NOWPAYMENTS_API_KEY;

const ipnSecret = isSandbox
  ? process.env.NOWPAYMENTS_SANDBOX_IPN_SECRET
  : process.env.NOWPAYMENTS_IPN_SECRET;

if (!apiKey) {
  console.warn(
    `${isSandbox ? "NOWPAYMENTS_SANDBOX_API_KEY" : "NOWPAYMENTS_API_KEY"} is missing. Crypto checkout will not work.`,
  );
}

const client = axios.create({
  baseURL: NOWPAYMENTS_API_BASE,
  headers: {
    "x-api-key": apiKey || "",
    "Content-Type": "application/json",
  },
});

export type NowPaymentsInvoice = {
  id: string;
  invoice_url: string;
};

export async function createNowPaymentsInvoice(params: {
  amount: number;
  orderId: string;
  successUrl: string;
  cancelUrl: string;
  ipnCallbackUrl: string;
}): Promise<NowPaymentsInvoice> {
  const { data } = await client.post<NowPaymentsInvoice>("/invoice", {
    price_amount: params.amount,
    price_currency: "usd",
    order_id: params.orderId,
    order_description: `Order ${params.orderId}`,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    ipn_callback_url: params.ipnCallbackUrl,
  });

  return data;
}

/**
 * NOWPayments signs IPN callbacks with an `x-nowpayments-sig` header:
 * HMAC-SHA512 over the JSON body, with keys sorted recursively, keyed by
 * NOWPAYMENTS_IPN_SECRET (a separate secret from the API key, set in the
 * NOWPayments dashboard). https://documenter.getpostman.com/view/7907941/S1a32n38
 */
export function verifyNowPaymentsSignature(body: unknown, signature: string | null): boolean {
  if (!signature || !ipnSecret) return false;

  const sorted = sortKeysDeep(body);
  const hmac = crypto.createHmac("sha512", ipnSecret).update(JSON.stringify(sorted)).digest("hex");

  return hmac === signature;
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = sortKeysDeep((value as Record<string, unknown>)[key]);
          return acc;
        },
        {} as Record<string, unknown>,
      );
  }
  return value;
}
