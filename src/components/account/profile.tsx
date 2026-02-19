// app/account/profile/page.tsx
"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string>("/martfury/product.png"); // default
    const [name, setName] = useState("Desmond");
    const [email] = useState("user@example.com");

    function onPick() {
        fileRef.current?.click();
    }

    function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // preview
        const url = URL.createObjectURL(file);
        setAvatarUrl(url);

        // later: upload file to your server / cloudinary here
        // const form = new FormData(); form.append("file", file) ...
    }

    function onSave() {
        alert("Saved (demo). Hook this to your API.");
    }

    return (
        <main className="min-h-screen bg-white">
            <div className="mx-auto max-w-4xl px-4 py-10">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-900">
                            Account / Profile
                        </h1>
                        <p className="text-sm text-neutral-600">
                            Update your avatar and personal details.
                        </p>
                    </div>

                    <Link
                        href="/account/orders"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        View orders →
                    </Link>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-[220px_1fr]">
                    {/* Avatar card */}
                    <div className="rounded-lg border border-neutral-200 p-5">
                        <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border border-neutral-200 bg-neutral-50">
                            <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                        </div>

                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onFileChange}
                        />

                        <button
                            onClick={onPick}
                            className="mt-4 w-full h-10 rounded-md bg-neutral-900 text-white text-sm font-semibold hover:brightness-110"
                        >
                            Upload avatar
                        </button>

                        <p className="mt-2 text-xs text-neutral-500">
                            PNG/JPG recommended.
                        </p>
                    </div>

                    {/* Details */}
                    <div className="rounded-lg border border-neutral-200 p-5">
                        <h2 className="text-lg font-semibold text-neutral-900">
                            Personal details
                        </h2>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div>
                                <label className="text-xs text-neutral-600">Name</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 h-11 w-full rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-neutral-600">Email</label>
                                <input
                                    value={email}
                                    disabled
                                    className="mt-1 h-11 w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-600"
                                />
                            </div>
                        </div>

                        <div className="mt-6 border-t border-neutral-200 pt-5">
                            <h3 className="text-sm font-semibold text-neutral-900">
                                Update password
                            </h3>

                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                <input
                                    type="password"
                                    placeholder="New password"
                                    className="h-11 rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm password"
                                    className="h-11 rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                                />
                            </div>

                            <button
                                onClick={onSave}
                                className="mt-5 h-11 rounded-md bg-[#1773b0] px-6 text-sm font-semibold text-white hover:brightness-95"
                            >
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
