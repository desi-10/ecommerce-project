import Image from "next/image";
import { Button } from "@/components/ui/button";
import Wrapper from "./wrapper";

export default function Hero() {
    return (
        <section className="bg-white border-b">
            <Wrapper>
                <div className="py-8 md:py-10">
                    <div className="rounded-sm overflow-hidden">
                        <div className="grid md:grid-cols-2 items-center gap-6 py-10 md:py-20">
                            <div>
                                <p className="text-xs text-blue-600 font-semibold">Weekend Promotions</p>
                                <h1 className="mt-2 text-3xl md:text-4xl font-bold leading-tight">
                                    Mini Helicopter <br /> Mini Helicopter
                                </h1>
                                <p className="mt-2 text-lg text-green-600 font-semibold">sale 40% Off</p>
                                <Button className="mt-5 bg-blue-600 hover:bg-blue-700">Shop Now</Button>
                            </div>

                            <div className="relative h-44 md:h-56">
                                {/* Replace with your real hero image */}
                                <Image
                                    src="/martfury/drone.png"
                                    alt="Hero product"
                                    fill
                                    className="object-contain  border"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Wrapper>
        </section>
    );
}
