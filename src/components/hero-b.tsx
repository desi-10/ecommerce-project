import Image from "next/image";
import Link from "next/link";
import Wrapper from "./wrapper";

export function HeroBannerPlusPromos() {
    return (
        <section className="">
            <Wrapper>
                <div className="py-6 md:py-8 grid gap-4 md:grid-cols-[1fr_320px]">

                    {/* 🔥 Big Banner – Drone */}
                    <div className="relative h-[360px] overflow-hidden border border-neutral-200">

                        <Image
                            src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1600&q=80"
                            alt="Drone Smart Gadget"
                            fill
                            className="object-cover"
                            priority
                        />

                        <div className="absolute inset-0 bg-black/40" />

                        <div className="relative z-10 h-full flex flex-col justify-center p-6 md:p-10 text-white">
                            <p className="text-xs text-blue-300 font-semibold">
                                New Season Deals
                            </p>

                            <h2 className="mt-2 text-3xl md:text-4xl font-bold leading-tight">
                                Smart Gadgets <br /> Up to 50% Off
                            </h2>

                            <p className="mt-3 text-sm opacity-90 max-w-md">
                                Upgrade your setup with top-rated tech at better prices.
                                Limited offers while stock lasts.
                            </p>

                            <div className="mt-6 flex items-center gap-4">
                                <Link
                                    href="/shop"
                                    className="inline-flex rounded-sm bg-blue-600 px-5 py-2.5 text-white font-semibold hover:bg-blue-700"
                                >
                                    Shop Now
                                </Link>

                                <Link
                                    href="/shop"
                                    className="text-sm font-semibold text-white hover:underline"
                                >
                                    View deals
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* 🔥 Right Promos */}
                    <div className="grid gap-4">

                        {/* Accessories Promo */}
                        <div className="relative h-[170px] overflow-hidden border border-neutral-200">
                            <Image
                                src="https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=1000&q=80"
                                alt="Tech Accessories"
                                fill
                                className="object-cover"
                            />

                            <div className="absolute inset-0 bg-black/40" />

                            <div className="relative z-10 h-full p-5 flex flex-col justify-center text-white">
                                <div className="text-xs opacity-80">Today only</div>
                                <div className="mt-1 font-semibold leading-snug">
                                    Accessories <br /> from $9.99
                                </div>

                                <Link
                                    href="/shop"
                                    className="inline-flex mt-3 text-sm font-semibold text-blue-300 hover:underline"
                                >
                                    Shop accessories
                                </Link>
                            </div>
                        </div>

                        {/* Wireless Audio Promo */}
                        <div className="relative h-[170px] overflow-hidden border border-neutral-200">
                            <Image
                                src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80"
                                alt="Wireless Headphones"
                                fill
                                className="object-cover"
                            />

                            <div className="absolute inset-0 bg-black/40" />

                            <div className="relative z-10 h-full p-5 flex flex-col justify-center text-white">
                                <div className="text-xs opacity-80">Hot pick</div>
                                <div className="mt-1 font-semibold leading-snug">
                                    Wireless Audio <br /> Save 25%
                                </div>

                                <Link
                                    href="/shop"
                                    className="inline-flex mt-3 text-sm font-semibold text-blue-300 hover:underline"
                                >
                                    Shop audio
                                </Link>
                            </div>
                        </div>

                    </div>

                </div>
            </Wrapper>
        </section>
    );
}
