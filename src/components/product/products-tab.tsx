"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

export default function ProductTabs() {
    return (
        <section className="border-t border-neutral-200">
            <Tabs defaultValue="description">
                <div className="p-4 border-b">
                    <TabsList className="bg-transparent flex flex-wrap gap-6 border-neutral-200">
                        {[
                            ["description", "Description"],
                            ["spec", "Specification"],
                            ["vendor", "Vendor"],
                            ["reviews", "Reviews (1)"],
                            ["qa", "Questions and Answers"],
                        ].map(([v, label]) => (
                            <TabsTrigger
                                key={v}
                                value={v}
                                className="p-5"
                            >
                                {label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <TabsContent value="description" className="pt-6">
                    <div className="prose prose-sm max-w-none">
                        <h4>Embodying the Raw, Wayward Spirit of Rock ’N’ Roll</h4>
                        <p>
                            Portable active stereo speaker takes the unmistakable look and sound of Marshall,
                            unplug the chords, and take the show on the road.
                        </p>
                        <p>
                            Weighing in under 7 pounds, it is a lightweight piece of vintage styled engineering…
                            (replace with real content later)
                        </p>
                        <div className="mt-6 border border-neutral-200">
                            <Image
                                src="/martfury/p/description-banner.png"
                                alt="Description banner"
                                className="w-full h-20"
                                width={100}
                                height={100}
                            />
                        </div>

                        <h4 className="mt-8">What do you get</h4>
                        <p>Sound of Marshall, unplugs the chords, and takes the show on the road.</p>

                        <h4 className="mt-8">Perfectly Done</h4>
                        <ul>
                            <li>No FM radio (except for T-Mobile units in the US, so far)</li>
                            <li>No IR blaster</li>
                            <li>No stereo speakers</li>
                        </ul>
                    </div>
                </TabsContent>

                <TabsContent value="spec" className="pt-6">
                    <div className="text-sm text-muted-foreground">
                        Specification table goes here (you can render a proper table).
                    </div>
                </TabsContent>

                <TabsContent value="vendor" className="pt-6">
                    <div className="text-sm text-muted-foreground">Vendor details go here.</div>
                </TabsContent>

                <TabsContent value="reviews" className="pt-6">
                    <div className="text-sm text-muted-foreground">Reviews UI goes here.</div>
                </TabsContent>

                <TabsContent value="qa" className="pt-6">
                    <div className="text-sm text-muted-foreground">Q&A goes here.</div>
                </TabsContent>
            </Tabs>
        </section>
    );
}
