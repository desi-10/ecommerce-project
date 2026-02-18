"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/wrapper";

export default function SignInSection() {
    return (
        <section className="bg-white border-b">
            <Wrapper>
                <div className="py-8 md:py-12">
                    <div className="mx-auto max-w-md border border-neutral-200 bg-white p-6 md:p-8">
                        <p className="text-xs text-blue-600 font-semibold">Account</p>
                        <h1 className="mt-2 text-2xl font-bold">Sign in</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Welcome back. Enter your details to continue.
                        </p>

                        <form className="mt-6 space-y-4">
                            <Input className="rounded-sm" placeholder="Email address" type="email" />
                            <Input className="rounded-sm" placeholder="Password" type="password" />

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-muted-foreground">
                                    <input type="checkbox" />
                                    Remember me
                                </label>
                                <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>

                            <Button className="w-full rounded-sm bg-blue-600 hover:bg-blue-700">
                                Sign in
                            </Button>

                            <div className="text-sm text-muted-foreground text-center">
                                Don’t have an account?{" "}
                                <Link href="/auth/sign-up" className="text-blue-600 hover:underline">
                                    Sign up
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </Wrapper>
        </section>
    );
}
