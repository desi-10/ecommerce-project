import Wrapper from "@/components/wrapper";
import Image from "next/image";
import Link from "next/link";

const posts = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    title: [
        "How to choose the right headphones",
        "Top gadgets worth buying this month",
        "Simple ways to protect your phone",
        "Laptop buying checklist for 2026",
        "How to spot quality accessories",
        "Best budget tech picks",
        "Tips for safe online shopping",
        "What to look for in a smart speaker",
    ][i],
    excerpt:
        "A short preview goes here. Keep it clean and readable like the Martfury style layout.",
    date: "Feb 2026",
    category: "Technology",
}));

export default function BlogPageSection() {
    return (
        <section className="bg-white">
            <Wrapper>
                <div className="py-8 md:py-10">
                    <div className=" border-neutral-200 bg-white p-6 md:p-10">
                        <p className="text-xs text-blue-600 font-semibold">Blog</p>
                        <h1 className="mt-2 text-3xl md:text-4xl font-bold">Latest articles</h1>
                        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                            Updates, guides, and tips. Keep your customers informed and engaged.
                        </p>

                        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
                            {/* posts */}
                            <div className="space-y-4">
                                {posts.map((p) => (
                                    <article key={p.id} className="border border-neutral-200 p-4 md:p-5">
                                        <div className="grid gap-4 md:grid-cols-[200px_1fr] items-start">
                                            <div className="relative h-36 w-full border border-neutral-200 bg-[linear-gradient(120deg,#f7f7f8,transparent)]">
                                                <Image
                                                    src="/martfury/product.png"
                                                    alt=""
                                                    fill
                                                    className="object-contain p-6"
                                                />
                                            </div>

                                            <div>
                                                <div className="text-xs text-muted-foreground">
                                                    {p.category} • {p.date}
                                                </div>
                                                <Link
                                                    href={`/blog/${p.id}`}
                                                    className="mt-1 block text-lg font-semibold text-blue-600 hover:underline"
                                                >
                                                    {p.title}
                                                </Link>
                                                <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
                                                <Link
                                                    href={`/blog/${p.id}`}
                                                    className="inline-flex mt-3 text-sm font-semibold text-blue-600 hover:underline"
                                                >
                                                    Read more
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* sidebar */}
                            <aside className="space-y-4">
                                <div className="border border-neutral-200 p-5">
                                    <div className="font-semibold">Categories</div>
                                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                                        {["Technology", "Accessories", "Guides", "Deals"].map((c) => (
                                            <li key={c} className="hover:text-foreground cursor-pointer">{c}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="border border-neutral-200 p-5">
                                    <div className="font-semibold">Popular posts</div>
                                    <ul className="mt-3 space-y-3 text-sm">
                                        {posts.slice(0, 4).map((p) => (
                                            <li key={p.id}>
                                                <Link href={`/blog/${p.id}`} className="text-blue-600 hover:underline">
                                                    {p.title}
                                                </Link>
                                                <div className="text-xs text-muted-foreground">{p.date}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="border border-neutral-200 p-5 bg-[linear-gradient(120deg,#f7f7f8,transparent)]">
                                    <div className="font-semibold">Subscribe</div>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Get updates directly to your inbox.
                                    </p>
                                    <div className="mt-3 flex">
                                        <input
                                            className="w-full border border-neutral-200 px-3 py-2 text-sm outline-none"
                                            placeholder="Email address"
                                        />
                                        <button className="px-4 border border-neutral-200 bg-blue-600 text-white text-sm font-semibold">
                                            Join
                                        </button>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </Wrapper>
        </section>
    );
}
