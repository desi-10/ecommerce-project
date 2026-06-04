import Wrapper from "@/components/wrapper";
import Image from "next/image";
import { ArrowUpRight, Shield, Zap, Star } from "lucide-react";

const stats = [
    { value: "10k+", label: "Customers served" },
    { value: "24/7", label: "Support availability" },
    { value: "500+", label: "Products curated" },
    { value: "Fast", label: "Delivery options" },
];

const pillars = [
    {
        icon: Zap,
        title: "Our Mission",
        text: "Make shopping effortless with a store that's fast, clean, and reliable for everyone.",
    },
    {
        icon: Shield,
        title: "Our Promise",
        text: "Clear product info, secure checkout, and support that actually responds when you need it.",
    },
    {
        icon: Star,
        title: "Our Standard",
        text: "Only quality items — tested, curated, and priced fairly with no surprises.",
    },
];

export default function AboutUsSection() {
    return (
        <section className="bg-background border-b overflow-hidden">
            <Wrapper>
                <div className="py-16 md:py-24 space-y-16">

                    {/* Hero row */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left — copy */}
                        <div className="space-y-8">
                            <div>
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.18em] uppercase text-primary border border-primary/30 bg-primary/5 px-3 py-1 rounded-full">
                                    About Us
                                </span>
                                <h1 className="mt-5 text-4xl md:text-5xl font-extrabold leading-[1.08] tracking-tight text-foreground">
                                    Built to make shopping{" "}
                                    <span className="relative inline-block">
                                        <span className="relative z-10">simple.</span>
                                        <span
                                            aria-hidden
                                            className="absolute bottom-1 left-0 w-full h-3 bg-primary/15 -z-0 skew-x-[-3deg]"
                                        />
                                    </span>
                                </h1>
                                <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-md">
                                    {`We're focused on delivering a clean shopping experience with great products,
                                    transparent pricing, and reliable support — every single time.`}
                                </p>
                            </div>

                            {/* Stats grid */}
                            <div className="grid grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border">
                                {stats.map((s) => (
                                    <div
                                        key={s.label}
                                        className="bg-background px-6 py-5 group hover:bg-primary/5 transition-colors duration-200"
                                    >
                                        <div className="text-2xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors">
                                            {s.value}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1 font-medium">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — image */}
                        <div className="relative">
                            {/* Decorative background blob */}
                            <div
                                aria-hidden
                                className="absolute inset-0 -m-6 rounded-3xl bg-gradient-to-br from-primary/8 via-primary/4 to-transparent"
                            />
                            {/* Accent corner lines */}
                            <div aria-hidden className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/30 rounded-tr-2xl" />
                            <div aria-hidden className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-primary/30 rounded-bl-2xl" />

                            <div className="relative h-72 md:h-[400px] rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-muted/60 to-muted/20">
                                <Image
                                    src="/martfury/drone.png"
                                    alt="About our store"
                                    fill
                                    className="object-contain p-10 drop-shadow-xl"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pillars row */}
                    <div className="grid gap-6 md:grid-cols-3">
                        {pillars.map((p, i) => (
                            <div
                                key={p.title}
                                className="group relative bg-background border border-border rounded-2xl p-7 hover:border-primary/40 hover:shadow-md transition-all duration-200 overflow-hidden"
                            >
                                {/* Subtle number watermark */}
                                <span
                                    aria-hidden
                                    className="absolute top-4 right-5 text-6xl font-black text-muted/20 select-none leading-none"
                                >
                                    {String(i + 1).padStart(2, "0")}
                                </span>

                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                                    <p.icon className="w-5 h-5 text-primary" />
                                </div>

                                <div className="font-bold text-base text-foreground mb-2">{p.title}</div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>

                                <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                                    Learn more <ArrowUpRight className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </Wrapper>
        </section>
    );
}