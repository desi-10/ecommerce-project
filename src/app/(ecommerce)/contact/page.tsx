"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";
import Wrapper from "@/components/wrapper";

export default function ContactUsSection() {
    return (
        <section className="bg-white border-b">
            <Wrapper>
                <div className="py-8 md:py-10">
                    <div className="border border-neutral-200 bg-white p-6 md:p-10">
                        <p className="text-xs text-blue-600 font-semibold">Contact Us</p>
                        <h1 className="mt-2 text-3xl md:text-4xl font-bold">
                            We’d love to hear from you.
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                            Send a message and our team will respond as soon as possible.
                        </p>

                        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
                            {/* form */}
                            <form className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Input className="rounded-sm" placeholder="Full name" />
                                    <Input className="rounded-sm" placeholder="Email address" />
                                </div>
                                <Input className="rounded-sm" placeholder="Subject" />
                                <Textarea className="rounded-sm min-h-[140px]" placeholder="Your message..." />
                                <Button className="rounded-sm bg-blue-600 hover:bg-blue-700">
                                    Send message
                                </Button>
                            </form>

                            {/* details */}
                            <div className="space-y-3">
                                <div className="border border-neutral-200 p-4 flex gap-3">
                                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <div className="font-semibold text-sm">Address</div>
                                        <div className="text-sm text-muted-foreground">
                                            Your business location
                                        </div>
                                    </div>
                                </div>
                                <div className="border border-neutral-200 p-4 flex gap-3">
                                    <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <div className="font-semibold text-sm">Phone</div>
                                        <div className="text-sm text-muted-foreground">+233 000 000 000</div>
                                    </div>
                                </div>
                                <div className="border border-neutral-200 p-4 flex gap-3">
                                    <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <div className="font-semibold text-sm">Email</div>
                                        <div className="text-sm text-muted-foreground">support@yourstore.com</div>
                                    </div>
                                </div>

                                <div className="border border-neutral-200 p-4">
                                    <div className="font-semibold text-sm">Business hours</div>
                                    <div className="mt-2 text-sm text-muted-foreground">
                                        Mon–Fri: 9:00am – 6:00pm
                                        <br />
                                        Sat: 10:00am – 4:00pm
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Wrapper>
        </section>
    );
}
