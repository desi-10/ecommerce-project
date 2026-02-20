// app/checkout/page.tsx
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const checkoutSchema = z.object({
    email: z.email(),
    firstName: z.string(),
    lastName: z.string(),
    country: z.string(),
    state: z.string(),
    discount: z.string().optional(),
    phone: z.string(),
    company: z.string().optional(),
    address: z.string(),
    suburb: z.string().optional(),
    postcode: z.string().optional()
})
type CheckoutType = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {

    const { register, handleSubmit } = useForm<CheckoutType>({
        resolver: zodResolver(checkoutSchema)
    })

    const [gateway, setGateway] = useState<"stripe" | "paystack">("stripe");

    const onSubmit = async (data: CheckoutType) => {
        if (gateway === "stripe") {
            console.log(data);
            return
        }
        console.log(data);
    }

    return (
        <main className="min-h-screen bg-white">
            <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-[1100px] px-4">
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
                        {/* Brand */}

                        {/* Breadcrumbs
                        <nav className="text-sm text-neutral-500 mb-6">
                            <ol className="flex flex-wrap items-center gap-2">
                                <li>
                                    <Link className="text-blue-600 hover:underline" href="/cart">
                                        Cart
                                    </Link>
                                </li>
                                <li className="text-neutral-400">›</li>
                                <li className="text-neutral-900">Information</li>
                                <li className="text-neutral-400">›</li>
                                <li>Shipping</li>
                                <li className="text-neutral-400">›</li>
                                <li>Payment</li>
                            </ol>
                        </nav> */}

                        {/* Express checkout */}
                        <div className="rounded-md border border-neutral-200 py-6 px-4">
                            {/* Contact info */}
                            <div className="flex items-center justify-between gap-4 mb-2">
                                <h2 className="text-lg font-semibold text-neutral-900">
                                    Contact information
                                </h2>
                                <p className="text-sm text-neutral-600">
                                    Already have an account?{" "}
                                    <Link href="/auth/sign-in" className="text-blue-600 hover:underline">
                                        Log in
                                    </Link>
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="sr-only">Email</label>
                                    <input
                                        {...register}
                                        placeholder="Email"
                                        className="h-11 w-full rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                                    />
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
                                <input
                                    {...register("firstName")}
                                    placeholder="First name"
                                    className="h-11 rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                                />
                                <input
                                    {...register("lastName")}
                                    placeholder="Last name"
                                    className="h-11 rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                                />
                            </div>

                            <input
                                {...register("company")}
                                placeholder="Company (optional)"
                                className="mt-3 h-11 w-full rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                            />

                            <input
                                {...register("address")}
                                placeholder="Address"
                                className="mt-3 h-11 w-full rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                            />

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
                                            <option>Australia</option>
                                            <option>Ghana</option>
                                            <option>United States</option>
                                            <option>United Kingdom</option>
                                            <option>Canada</option>
                                        </select>
                                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                                            ▾
                                        </span>
                                    </div>
                                    <p className="mt-1 text-[11px] text-neutral-500">Country/region</p>
                                </div>

                                <div>
                                    <div className="relative">
                                        <select
                                            {...register("state")}
                                            className="h-11 w-full appearance-none rounded-md border border-neutral-200 bg-white px-3 pr-9 text-sm outline-none focus:border-neutral-400"
                                        >
                                            <option value="">State/territory</option>
                                            <option>NSW</option>
                                            <option>VIC</option>
                                            <option>QLD</option>
                                            <option>WA</option>
                                            <option>SA</option>
                                            <option>TAS</option>
                                            <option>ACT</option>
                                            <option>NT</option>
                                        </select>
                                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                                            ▾
                                        </span>
                                    </div>
                                    <p className="mt-1 text-[11px] text-neutral-500">State/territory</p>
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

                            <input
                                {...register("phone")}
                                placeholder="Phone"
                                className="mt-3 h-11 w-full rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                            />

                            {/* Bottom actions */}
                            <div className="mt-8 flex items-center justify-between gap-4">
                                <Link
                                    href="/cart"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    ‹ Return to cart
                                </Link>
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
                    <aside className="lg:sticky lg:top-6 h-fit  bg-white">
                        <div className="p-5 rounded-md border border-neutral-200">
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-start gap-3">
                                        <div className="relative h-14 w-14 shrink-0 rounded-md border border-neutral-200 bg-neutral-50 overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
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
                                            {item.variant ? (
                                                <div className="text-xs text-neutral-500">
                                                    {item.variant}
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className="text-sm text-neutral-900">
                                            ${item.price.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="my-5 border-t border-neutral-200" />

                            {/* Discount */}
                            <div className="flex gap-3">
                                <input
                                    {...register("discount")}
                                    placeholder="Gift card or discount code"
                                    className="h-11 flex-1 rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                                />
                                <button
                                    onClick={() => alert("Apply discount (demo)")}
                                    className="h-11 rounded-md bg-neutral-300 px-5 text-sm font-semibold text-neutral-700 hover:brightness-95"
                                >
                                    Apply
                                </button>
                            </div>

                            <div className="my-5 border-t border-neutral-200" />

                            {/* Totals */}
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between text-neutral-700">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex items-center justify-between text-neutral-700">
                                    <span>Shipping</span>
                                    <span className="text-neutral-500 text-xs">{shippingText}</span>
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
                                        <div className="text-xs text-neutral-500">AUD</div>
                                        <div className="text-2xl font-semibold text-neutral-900">
                                            ${total.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-5">

                            {/* options */}
                            <div className="flex items-center gap-3">
                                {/* Stripe */}
                                <button
                                    type="button"
                                    onClick={() => setGateway("stripe")}
                                    className={[
                                        "flex flex-col items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm",
                                        gateway === "stripe"
                                            ? "border-neutral-500 ring-1 ring-neutral-200"
                                            : "border-neutral-200 hover:border-neutral-300",
                                    ].join(" ")}
                                    aria-pressed={gateway === "stripe"}
                                >
                                    <Image width="80" height="80" src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/96/external-stripe-to-make-and-receive-payments-over-the-internet-logo-color-tal-revivo.png" alt="external-stripe-to-make-and-receive-payments-over-the-internet-logo-color-tal-revivo" />
                                    <span className="text-muted-foreground">Checkout with Stripe</span>
                                </button>

                                {/* Paystack */}
                                <button
                                    type="button"
                                    onClick={() => setGateway("paystack")}
                                    className={[
                                        "flex flex-col items-center gap-2 rounded-md border px-3 py-2 text-sm",
                                        gateway === "paystack"
                                            ? "border-neutral-900 ring-1 ring-neutral-900"
                                            : "border-neutral-200 hover:border-neutral-300",
                                    ].join(" ")}
                                    aria-pressed={gateway === "paystack"}
                                >
                                    {/* put logo at: /public/payments/paystack.png */}
                                    <Image
                                        src="/payments/paystack.png"
                                        alt="Paystack"
                                        width={18}
                                        height={18}
                                    />
                                    <span className="text-muted-foreground">Checkout with Paystack</span>
                                </button>
                            </div>

                            {/* hidden input if you want to submit in a form */}
                            <input type="hidden" name="gateway" value={gateway} />
                        </div>

                    </aside>


                </div>
            </form>
        </main>
    );
}
