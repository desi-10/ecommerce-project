"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";
import Wrapper from "@/components/wrapper";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ContactUsSection() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const { toast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: data.message || "Failed to send message",
                });
                return;
            }

            toast({
                title: "Success",
                description: "Your message has been sent successfully",
            });

            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to send message",
            });
        } finally {
            setLoading(false);
        }
    };

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
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Input
                                        className="rounded-sm"
                                        placeholder="Full name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        className="rounded-sm"
                                        placeholder="Email address"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <Input
                                    className="rounded-sm"
                                    placeholder="Subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                                <Textarea
                                    className="rounded-sm min-h-[140px]"
                                    placeholder="Your message..."
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                                <Button
                                    className="rounded-sm bg-blue-600 hover:bg-blue-700"
                                    disabled={loading}
                                    type="submit"
                                >
                                    {loading ? "Sending..." : "Send message"}
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
