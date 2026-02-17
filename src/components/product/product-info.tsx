"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, BarChart3 } from "lucide-react";
import { Input } from "../ui/input";

function Stars({ value = 4 }: { value?: number }) {
    const full = Math.max(0, Math.min(5, Math.floor(value)));
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < full ? "text-yellow-500" : "text-neutral-300"}>
                    ★
                </span>
            ))}
            <span className="ml-2 text-xs text-muted-foreground">(1 review)</span>
        </div>
    );
}

export default function ProductInfo() {
    const [qty, setQty] = useState(1);

    const safeQty = useMemo(() => Math.max(1, Math.min(99, qty)), [qty]);

    return (
        <div className="min-w-0">
            <div className="flex items-center">
                <h1 className="text-xl md:text-2xl font-semibold leading-snug">
                    Sound Intone I65 Earphone White Version
                </h1>

                <Button variant="outline" className="h-10 w-10  grid place-items-center border border-neutral-200 hover:bg-neutral-50">
                    <Heart className="h-4 w-4 text-red-500" />
                </Button>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                <div className="text-muted-foreground">
                    Brand: <span className="text-blue-600 cursor-pointer">No Brand</span>
                </div>
                <Stars value={4} />
            </div>

            <div className="mt-4 text-2xl font-semibold">$21.99</div>

            <div className="mt-3 text-xs text-muted-foreground">
                Sold by: <span className="text-blue-600 cursor-pointer font-medium">NO VENDOR</span>
            </div>

            <ul className="mt-4 space-y-2 text-xs text-muted-foreground list-disc pl-5">
                <li>Unrestrained and portable active stereo speaker</li>
                <li>Free from the confines of wires and chords</li>
                <li>20 hours of portable capabilities</li>
                <li>Double-ended Coil Cord with 3.5mm Stereo Plugs Included</li>
                <li>3/4&quot; Dome Tweeters: 2X and 4&quot; Woofer: 1X</li>
            </ul>

            {/* Quantity + actions */}
            <div className="mt-6">
                <div className="text-xs text-muted-foreground mb-2">Quantity</div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* qty stepper */}
                    <div className="inline-flex items-center border border-neutral-200 bg-white h-10">
                        <Button
                            variant="ghost"
                            className="rounded-none grid place-items-center text-neutral-600 hover:bg-neutral-50"
                            onClick={() => setQty((v) => Math.max(1, v - 1))}
                            aria-label="Decrease quantity"
                        >
                            –
                        </Button>
                        <Input
                            className="border-none w-14 h-10 text-center text-sm outline-none rounded-none"
                            value={safeQty}
                            onChange={(e) => setQty(Number(e.target.value || 1))}
                            type="number"
                            inputMode="numeric"
                        />
                        <Button
                            variant="ghost"
                            className="rounded-none grid place-items-center text-neutral-600 hover:bg-neutral-50"
                            onClick={() => setQty((v) => Math.min(99, v + 1))}
                            aria-label="Increase quantity"
                        >
                            +
                        </Button>
                    </div>

                    {/* buttons like screenshot */}
                    <Button>Add to cart</Button>
                    <Button variant="outline" className="">
                        Buy Now
                    </Button>


                </div>
            </div>

            {/* Meta */}
            {/* <div className="mt-6 text-xs text-muted-foreground space-y-2">
                <div className="underline cursor-pointer w-fit">Report Abuse</div>
                <div>SKU: <span className="text-foreground">SF1133569600-1</span></div>
                <div>Categories: <span className="text-foreground">sofa, technologies, wireless</span></div>
                <div>Tags: <span className="text-foreground">sofa, technologies, wireless</span></div>
            </div> */}

            {/* Social */}
            {/* <div className="mt-5 flex items-center gap-2">
                {["f", "t", "g+", "in"].map((x) => (
                    <button
                        key={x}
                        className="h-9 w-9 border border-neutral-200 text-xs font-semibold text-muted-foreground hover:bg-neutral-50"
                        aria-label={`Share ${x}`}
                    >
                        {x}
                    </button>
                ))}
            </div> */}
        </div>
    );
}
