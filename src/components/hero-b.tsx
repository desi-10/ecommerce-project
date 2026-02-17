import Image from "next/image";
import Link from "next/link";
import Wrapper from "./wrapper";

export function HeroBannerPlusPromos() {
    return (
        <section className="border-b">
            <Wrapper>
                <div className="py-6 md:py-8 grid gap-4 md:grid-cols-[1fr_320px]">
                    {/* Big banner */}
                    <div className="bg-white border border-neutral-200 bg-[linear-gradient(120deg,#f7f7f8,transparent)] overflow-hidden">
                        <div className="grid md:grid-cols-2 items-center gap-6 p-5 md:p-10">
                            <div>
                                <p className="text-xs text-blue-600 font-semibold">
                                    New Season Deals
                                </p>
                                <h2 className="mt-2 text-3xl md:text-4xl font-bold leading-tight">
                                    Smart Gadgets <br /> Up to 50% Off
                                </h2>
                                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                                    Upgrade your setup with top-rated tech at better prices. Limited
                                    offers while stock lasts.
                                </p>
                                <div className="mt-5 flex items-center gap-3">
                                    <Link
                                        href="/shop"
                                        className="inline-flex rounded-sm bg-blue-600 px-5 py-2.5 text-white font-semibold hover:bg-blue-700"
                                    >
                                        Shop Now
                                    </Link>
                                    <Link
                                        href="/shop"
                                        className="text-sm font-semibold text-blue-600 hover:underline"
                                    >
                                        View deals
                                    </Link>
                                </div>
                            </div>

                            <div className="relative h-44 md:h-56">
                                <Image
                                    src="/martfury/drone.png"
                                    alt="Banner product"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right promos */}
                    <div className="grid gap-4">
                        <div className="border border-neutral-200 bg-white p-5 flex items-center gap-4">
                            <div className="min-w-0">
                                <div className="text-xs text-muted-foreground">Today only</div>
                                <div className="mt-1 font-semibold leading-snug">
                                    Accessories <br /> from $9.99
                                </div>
                                <Link
                                    href="/shop"
                                    className="inline-flex mt-3 text-sm font-semibold text-blue-600 hover:underline"
                                >
                                    Shop accessories
                                </Link>
                            </div>
                            <div className="relative h-20 w-24 ml-auto">
                                <Image
                                    src="/martfury/product.png"
                                    alt="Promo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        <div className="border border-neutral-200 bg-white p-5 flex items-center gap-4">
                            <div className="min-w-0">
                                <div className="text-xs text-muted-foreground">Hot pick</div>
                                <div className="mt-1 font-semibold leading-snug">
                                    Wireless Audio <br /> save 25%
                                </div>
                                <Link
                                    href="/shop"
                                    className="inline-flex mt-3 text-sm font-semibold text-blue-600 hover:underline"
                                >
                                    Shop audio
                                </Link>
                            </div>
                            <div className="relative h-20 w-24 ml-auto">
                                <Image
                                    src="/martfury/product.png"
                                    alt="Promo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Wrapper>
        </section>
    );
}
