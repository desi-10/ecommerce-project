"use client";

import Image from "next/image";
import Wrapper from "./wrapper";
import { useLanguage } from "@/context/language-context";

export default function FeatureRow() {
    const { t } = useLanguage();

    const items = [
        { 
            url: "https://img.icons8.com/wired/64/in-transit.png", 
            alt: "in-transit", 
            title: t("feature.free_delivery.title", "Free Delivery"), 
            desc: t("feature.free_delivery.desc", "For all orders over $50") 
        },
        { 
            url: "https://img.icons8.com/ios/50/rotate--v1.png", 
            alt: "rotate--v1", 
            title: t("feature.return.title", "90 Days Return"), 
            desc: t("feature.return.desc", "If goods have problems") 
        },
        { 
            url: "https://img.icons8.com/dotty/80/bank-card-back-side.png", 
            alt: "bank-card-back-side", 
            title: t("feature.payment.title", "Secure Payment"), 
            desc: t("feature.payment.desc", "100% secure payment") 
        },
        { 
            url: "https://img.icons8.com/wired/64/online-support--v1.png", 
            alt: "online-support--v1", 
            title: t("feature.support.title", "24/7 Support"), 
            desc: t("feature.support.desc", "Dedicated support") 
        },
    ];

    return (
        <section className="mt-5">
            <Wrapper>
                <div className="bg-white grid grid-cols-1 md:grid-cols-4 gap-4 rounded-sm border divide-y lg:divide-x lg:divide-y-0">
                    {items.map((i) => (
                        <div key={i.alt} className="flex items-center justify-center gap-3 px-4 py-6">
                            <Image src={i.url} alt={i.alt} className="h-10 w-10 text-blue-600 mt-0.5" width={1000}
                                height={1000} />
                            <div>
                                <div className="text-lg lg:text-xl font-semibold">{i.title}</div>
                                <div className="text-xs text-muted-foreground">{i.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </Wrapper>
        </section>
    );
}
