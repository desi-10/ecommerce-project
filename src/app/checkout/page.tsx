"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingBag, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useCartStore } from "@/stores/cart.store";
import axios from "axios";
import { useValidateCoupon } from "@/hooks/use-coupon";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

const checkoutSchema = z.object({
  email: z.string().email("Enter a valid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  discount: z.string().optional(),
  phone: z.string().min(6, "Phone is required"),
  company: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  suburb: z.string().optional(),
  postcode: z.string().optional(),
});

type CheckoutType = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const cartItems = useCartStore((state) => state.items);
  const cartSubtotal = useCartStore((state) => state.getTotal());
  const [gateway, setGateway] = useState("stripe");
  
  const [coupon, setCoupon] = useState<{ id: string; code: string; type: string; value: number } | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const { mutate: validateCoupon, isPending: isValidating } = useValidateCoupon();
  const { data: session } = useSession();
  const user = session?.user;

  // Demo shipping/tax
  const shipping = 0;
  const shippingText = shipping === 0 ? "Free" : `$${shipping}`;
  const tax = 0;

  const discountAmount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.type === "PERCENT") {
      return (cartSubtotal * coupon.value) / 100;
    }
    return Math.min(cartSubtotal, coupon.value);
  }, [cartSubtotal, coupon]);

  const total = cartSubtotal - discountAmount + shipping + tax;

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutType>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: "Ghana",
    },
  });

  useEffect(() => {
    if (user) {
      if (!getValues("email")) setValue("email", user.email);
      if (user.name) {
        const parts = user.name.split(" ");
        if (!getValues("firstName")) setValue("firstName", parts[0] || "");
        if (!getValues("lastName")) setValue("lastName", parts.slice(1).join(" ") || "");
      }
    }
  }, [user, setValue, getValues]);

  const onSubmit = async (data: CheckoutType) => {
    try {
      const res = await axios.post("/api/order-payment", {
        email: data.email,
        amount: total,
        gateway,
        couponCode: coupon?.code,
        items: cartItems.map((item) => ({
          variantId: item.id,
          quantity: item.qty,
        })),
        metadata: JSON.stringify({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phone: data.phone,
          country: data.country,
          state: data.state,
        }),
      });

      const url =
        res.data?.data?.authorizationUrl || res.data?.authorizationUrl;

      if (!url) {
        throw new Error("No authorization URL returned");
      }

      // ✅ Redirect properly
      window.location.href = url;
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong while processing payment.");
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-[1100px] px-4"
      >
        <div className="pt-10 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Example Shopify Store
          </h1>
          <div className="flex items-center space-x-3">
            <ShoppingBag />
            <p>Checkout</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-14 py-10">
          {/* LEFT */}
          <section className="min-w-0">
            <div className="rounded-md border border-neutral-200 py-6 px-4">
              {/* Contact info */}
              <div className="flex items-center justify-between gap-4 mb-2">
                <h2 className="text-lg font-semibold text-neutral-900">
                  Contact information
                </h2>
                {!user && (
                  <p className="text-sm text-neutral-600">
                    Already have an account?{" "}
                    <Link
                      href="/auth/sign-in"
                      className="text-blue-600 hover:underline"
                    >
                      Log in
                    </Link>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <label className="sr-only">Email</label>
                  <input
                    {...register("email")}
                    placeholder="Email"
                    className="h-11 w-full rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                  />
                  {errors.email && (
                    <p className="mt-1 text-[11px] text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <Checkbox />
                  Email me with news and offers
                </label>
              </div>

              {/* Shipping address */}
              <h2 className="text-lg font-semibold text-neutral-900 mt-8 mb-3">
                Shipping address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    {...register("firstName")}
                    placeholder="First name"
                    className="h-11 w-full rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-[11px] text-red-600">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    {...register("lastName")}
                    placeholder="Last name"
                    className="h-11 w-full rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-[11px] text-red-600">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <input
                {...register("company")}
                placeholder="Company (optional)"
                className="mt-3 h-11 w-full rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
              />

              <div className="mt-3">
                <input
                  {...register("address")}
                  placeholder="Address"
                  className="h-11 w-full rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                />
                {errors.address && (
                  <p className="mt-1 text-[11px] text-red-600">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <input
                {...register("suburb")}
                placeholder="Suburb"
                className="mt-3 h-11 w-full rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
              />

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-[1.2fr_1fr_0.9fr] gap-3">
                <div>
                  <div className="relative">
                    <select
                      {...register("country")}
                      className="h-11 w-full appearance-none rounded-md border border-neutral-200 bg-white px-3 pr-9 text-sm outline-none focus:border-neutral-400"
                    >
                      <option value="Ghana">Ghana</option>
                      <option value="Australia">Australia</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                      ▾
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Country/region
                  </p>
                  {errors.country && (
                    <p className="mt-1 text-[11px] text-red-600">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <select
                      {...register("state")}
                      className="h-11 w-full appearance-none rounded-md border border-neutral-200 bg-white px-3 pr-9 text-sm outline-none focus:border-neutral-400"
                    >
                      <option value="">State/territory</option>
                      <option value="Greater Accra">Greater Accra</option>
                      <option value="Ashanti">Ashanti</option>
                      <option value="Eastern">Eastern</option>
                      <option value="Central">Central</option>
                      <option value="Western">Western</option>
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                      ▾
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    State/territory
                  </p>
                  {errors.state && (
                    <p className="mt-1 text-[11px] text-red-600">
                      {errors.state.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    {...register("postcode")}
                    placeholder="Postcode"
                    className="h-11 w-full rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                  />
                  <p className="mt-1 text-[11px] text-neutral-500">Postcode</p>
                </div>
              </div>

              <div className="mt-3">
                <input
                  {...register("phone")}
                  placeholder="Phone"
                  className="h-11 w-full rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                />
                {errors.phone && (
                  <p className="mt-1 text-[11px] text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Bottom actions */}
              <div className="mt-8 flex items-center justify-between gap-4">
                <Link
                  href="/shop"
                  className="text-sm text-blue-600 hover:underline"
                >
                  ‹ Return to shop
                </Link>

                {/* <Button type="submit" disabled={isSubmitting || cartItems.length === 0}>
                                    {cartItems.length === 0 ? "Cart is empty" : "Continue to payment"}
                                </Button> */}
              </div>
            </div>

            {/* Footer links */}
            <div className="mt-10 border-t border-neutral-200 pt-4 text-xs text-neutral-500 flex flex-wrap gap-x-4 gap-y-2">
              <Link className="hover:underline" href="/refund-policy">
                Refund policy
              </Link>
              <Link className="hover:underline" href="/privacy-policy">
                Privacy policy
              </Link>
              <Link className="hover:underline" href="/terms">
                Terms of service
              </Link>
            </div>
          </section>

          {/* RIGHT (Order Summary) */}
          <aside className="lg:sticky lg:top-6 h-fit bg-white">
            <div className="p-5 rounded-md border border-neutral-200">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="relative h-14 w-14 shrink-0 rounded-md border border-neutral-200 bg-neutral-50 overflow-hidden">
                      <Image
                        src={
                          item.image ||
                          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200"
                        }
                        alt={item.name}
                        width={50}
                        height={50}
                        quality={80}
                        className="object-cover"
                      />
                      <span className="absolute -right-2 -top-2 h-5 min-w-5 rounded-full bg-neutral-600 px-1 text-[11px] text-white flex items-center justify-center">
                        {item.qty}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-neutral-900 truncate">
                        {item.name}
                      </div>
                    </div>

                    <div className="text-sm text-neutral-900">
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="my-5 border-t border-neutral-200" />

              {/* Discount */}
              <div className="flex gap-3">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Gift card or discount code"
                  className="h-11 flex-1 rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400 font-mono"
                />
                <button
                  type="button"
                  disabled={isValidating || !couponInput}
                  onClick={() => {
                    validateCoupon(
                      { code: couponInput, subtotal: cartSubtotal },
                      {
                        onSuccess: (res) => {
                          setCoupon({
                            id: res.data.coupon.id,
                            code: res.data.coupon.code,
                            type: res.data.coupon.type,
                            value: Number(res.data.coupon.value),
                          });
                          toast.success("Coupon applied!");
                        },
                        onError: (err: any) => {
                          toast.error(err.response?.data?.message || "Invalid coupon");
                          setCoupon(null);
                        },
                      }
                    );
                  }}
                  className="h-11 rounded-md bg-neutral-900 px-5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50 transition-all"
                >
                  {isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                </button>
              </div>

              {coupon && (
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase font-mono tracking-wider">{coupon.code}</span>
                        <button onClick={() => { setCoupon(null); setCouponInput(""); }} className="text-xs text-neutral-400 hover:text-red-500 underline">Remove</button>
                    </div>
                    <span className="text-sm font-medium text-emerald-600">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="my-5 border-t border-neutral-200" />

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-neutral-700 font-medium">
                  <span>Subtotal</span>
                  <span>${cartSubtotal.toFixed(2)}</span>
                </div>

                {coupon && (
                    <div className="flex items-center justify-between text-emerald-600">
                        <span>Discount ({coupon.code})</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                )}

                <div className="flex items-center justify-between text-neutral-700">
                  <span>Shipping</span>
                  <span className="text-neutral-500 text-xs">
                    {shippingText}
                  </span>
                </div>

                <div className="my-3 border-t border-neutral-200" />

                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-base font-semibold text-neutral-900">
                      Total
                    </div>
                    <div className="text-xs text-neutral-500">
                      Including ${tax.toFixed(2)} in taxes
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-neutral-500">GHS</div>
                    <div className="text-2xl font-semibold text-neutral-900">
                      ${total.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment gateway choice */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-5">
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  onClick={() => setGateway("stripe")}
                  disabled={isSubmitting}
                  className={[
                    "flex flex-col items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer",
                    gateway === "stripe"
                      ? "border-neutral-500 ring-1 ring-neutral-200"
                      : "border-neutral-200 hover:border-neutral-300",
                  ].join(" ")}
                  aria-pressed={gateway === "stripe"}
                >
                  <Image
                    width={40}
                    height={40}
                    src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/96/external-stripe-to-make-and-receive-payments-over-the-internet-logo-color-tal-revivo.png"
                    alt="Stripe"
                  />
                  <span className="text-muted-foreground">
                    Checkout with Stripe
                  </span>
                </button>

                <button
                  type="submit"
                  onClick={() => setGateway("paystack")}
                  disabled={isSubmitting}
                  className={[
                    "flex flex-col items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer",
                    gateway === "paystack"
                      ? "border-neutral-900 ring-1 ring-neutral-900"
                      : "border-neutral-200 hover:border-neutral-300",
                  ].join(" ")}
                  aria-pressed={gateway === "paystack"}
                >
                  <Image
                    src="https://raw.githubusercontent.com/PaystackHQ/paystack-identity/master/assets/images/paystack-badge-green.png"
                    alt="Paystack"
                    width={40}
                    height={40}
                  />
                  <span className="text-muted-foreground">
                    Checkout with Paystack
                  </span>
                </button>
              </div>

              <input type="hidden" name="gateway" value={gateway} />
            </div>
          </aside>
        </div>
      </form>
    </main>
  );
}
