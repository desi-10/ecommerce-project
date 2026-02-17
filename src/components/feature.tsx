import { Truck, RotateCcw, CreditCard, Headphones } from "lucide-react";
import Wrapper from "./wrapper";

const items = [
    { icon: Truck, title: "Free Delivery", desc: "For all orders over $50" },
    { icon: RotateCcw, title: "90 Days Return", desc: "If goods have problems" },
    { icon: CreditCard, title: "Secure Payment", desc: "100% secure payment" },
    { icon: Headphones, title: "24/7 Support", desc: "Dedicated support" },
];

export default function FeatureRow() {
    return (
        <section className="mt-5">
            <Wrapper>
                <div className="bg-white grid grid-cols-1 md:grid-cols-4 gap-4 rounded-sm border divide-y lg:divide-x lg:divide-y-0">
                    {items.map((i) => (
                        <div key={i.title} className="flex items-start justify-center gap-3 px-4 py-6">
                            <i.icon className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                                <div className="text-sm font-semibold">{i.title}</div>
                                <div className="text-xs text-muted-foreground">{i.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </Wrapper>
        </section>
    );
}
