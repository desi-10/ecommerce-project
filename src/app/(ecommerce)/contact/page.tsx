"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";
import Wrapper from "@/components/wrapper";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactUsSection() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

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
                toast.error("Error", {
                    description: data.message || "Failed to send message",
                });
                return;
            }

            toast.success("Success", {
                description: "Your message has been sent successfully",
            });

            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error) {
            toast.error("Error", {
                description: "Failed to send message",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-white border-b">
            <Wrapper>
                <div className="py-8 md:py-12 space-y-8">
                    <div className="border border-neutral-200 bg-white p-6 md:p-10 rounded-md shadow-sm">
                        <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Contact Us</p>
                        <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
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
                                        className="rounded-md border-gray-200"
                                        placeholder="Full name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        className="rounded-md border-gray-200"
                                        placeholder="Email address"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <Input
                                    className="rounded-md border-gray-200"
                                    placeholder="Subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                                <Textarea
                                    className="rounded-md border-gray-200 min-h-[140px]"
                                    placeholder="Your message..."
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                                <Button
                                    className="rounded-md bg-blue-600 hover:bg-blue-700 shadow-sm px-6"
                                    disabled={loading}
                                    type="submit"
                                >
                                    {loading ? "Sending..." : "Send message"}
                                </Button>
                            </form>

                            {/* details */}
                            <div className="space-y-3">
                                <div className="border border-neutral-200 p-4 flex gap-3 rounded-md shadow-sm bg-neutral-50/50">
                                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                                    <div>
                                        <div className="font-semibold text-sm text-gray-900">Address</div>
                                        <div className="text-sm text-muted-foreground">
                                            123 Commercial Street, Accra, Ghana
                                        </div>
                                    </div>
                                </div>
                                <div className="border border-neutral-200 p-4 flex gap-3 rounded-md shadow-sm bg-neutral-50/50">
                                    <Phone className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                                    <div>
                                        <div className="font-semibold text-sm text-gray-900">Phone</div>
                                        <div className="text-sm text-muted-foreground">+233 000 000 000</div>
                                    </div>
                                </div>
                                <div className="border border-neutral-200 p-4 flex gap-3 rounded-md shadow-sm bg-neutral-50/50">
                                    <Mail className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                                    <div>
                                        <div className="font-semibold text-sm text-gray-900">Email</div>
                                        <div className="text-sm text-muted-foreground">support@yourstore.com</div>
                                    </div>
                                </div>

                                <div className="border border-neutral-200 p-4 rounded-md shadow-sm bg-neutral-50/50">
                                    <div className="font-semibold text-sm text-gray-900">Business hours</div>
                                    <div className="mt-2 text-sm text-muted-foreground">
                                        Mon–Fri: 9:00am – 6:00pm
                                        <br />
                                        Sat: 10:00am – 4:00pm
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Google Map Section */}
                    <div className="border border-neutral-200 bg-white rounded-md shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-blue-600" />
                                Our Location
                            </h2>
                            <span className="text-xs text-muted-foreground font-medium">Accra Central Office</span>
                        </div>
                        <div className="h-[350px] w-full bg-neutral-100 relative">
                            <iframe
                                title="Store Location Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.92548231267!2d-0.1869644!3d5.55602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzMnMjEuNyJOIDDCsDExJzEzLjEiVw!5e0!3m2!1sen!2sgh!4v1650000000000!5m2!1sen!2sgh"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full grayscale-[20%] contrast-[105%]"
                            />
                        </div>
                    </div>
                </div>
            </Wrapper>
        </section>
    );
}
