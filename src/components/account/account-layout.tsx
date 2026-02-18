"use client";

import Link from "next/link";
import Wrapper from "../wrapper";
import { ReactNode } from "react";

export default function AccountLayout({ children }: { children: ReactNode }) {
    return (
        <section className="bg-white border-b">
            <Wrapper>
                <div className="py-8 md:py-10">
                    <div className="border border-neutral-200 bg-white">
                        <div className="grid md:grid-cols-[240px_1fr]">

                            {/* Sidebar */}
                            <aside className="border-r border-neutral-200 space-y-2">
                                <div className="text-sm font-semibold mb-3 p-4 border-b">My Account</div>
                                <div className="divide-y">
                                    <Link
                                        href="/account/profile"
                                        className="block text-sm hover:bg-neutral-50"
                                    >
                                        <p className="px-3 py-2">Profile</p>
                                    </Link>

                                    <Link
                                        href="/account/orders"
                                        className="block text-sm hover:bg-neutral-50"
                                    >
                                        <p className="px-3 py-2">Orders</p>
                                    </Link>

                                    <Link
                                        href="/account/security"
                                        className="block text-sm hover:bg-neutral-50"
                                    >
                                        <p className="px-3 py-2"> Security</p>
                                    </Link>

                                    {/* <button className="block w-full text-sm px-3 py-2 rounded-sm hover:bg-neutral-50 text-red-600">
                                        Logout
                                    </button> */}
                                </div>
                            </aside>

                            {/* Content */}
                            <div className="p-6 md:p-8">{children}</div>
                        </div>
                    </div>
                </div>
            </Wrapper>
        </section>
    );
}
