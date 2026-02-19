import Wrapper from "@/components/wrapper";
import Image from "next/image";

export default function AboutUsSection() {
    return (
        <section className="bg-white border-b">
            <Wrapper>
                <div className="py-8 md:py-10">
                    <div className="border border-neutral-200 bg-white">
                        <div className="grid gap-6 md:grid-cols-2 p-6 md:p-10 items-center">
                            <div>
                                <p className="text-xs text-blue-600 font-semibold">About Us</p>
                                <h1 className="mt-2 text-3xl md:text-4xl font-bold leading-tight">
                                    Built to make shopping simple, fast, and trusted.
                                </h1>
                                <p className="mt-3 text-sm text-muted-foreground max-w-xl">
                                    We’re focused on delivering a clean shopping experience with
                                    great products, transparent pricing, and reliable support.
                                </p>

                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div className="border border-neutral-200 p-4">
                                        <div className="text-2xl font-bold">10k+</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            Customers served
                                        </div>
                                    </div>
                                    <div className="border border-neutral-200 p-4">
                                        <div className="text-2xl font-bold">24/7</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            Support availability
                                        </div>
                                    </div>
                                    <div className="border border-neutral-200 p-4">
                                        <div className="text-2xl font-bold">500+</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            Products curated
                                        </div>
                                    </div>
                                    <div className="border border-neutral-200 p-4">
                                        <div className="text-2xl font-bold">Fast</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            Delivery options
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative h-64 md:h-[360px] border border-neutral-200 bg-[linear-gradient(120deg,#f7f7f8,transparent)]">
                                <Image
                                    src="/martfury/drone.png"
                                    alt="About image"
                                    fill
                                    className="object-contain p-6"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {[
                            {
                                title: "Our mission",
                                text: "Make shopping effortless with a store that’s fast, clean, and reliable.",
                            },
                            {
                                title: "Our promise",
                                text: "Clear product info, secure checkout, and support that actually responds.",
                            },
                            {
                                title: "Our standard",
                                text: "Only quality items — tested, curated, and priced fairly.",
                            },
                        ].map((x) => (
                            <div key={x.title} className="border border-neutral-200 bg-white p-6">
                                <div className="font-semibold">{x.title}</div>
                                <p className="mt-2 text-sm text-muted-foreground">{x.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Wrapper>
        </section>
    );
}
