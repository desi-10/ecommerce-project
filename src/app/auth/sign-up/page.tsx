"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/wrapper";

export default function SignUpSection() {
    return (
        <section className="bg-white border-b">
            <Wrapper>
                <div className="py-8 md:py-12">
                    <div className="mx-auto max-w-md border border-neutral-200 bg-white p-6 md:p-8">
                        <p className="text-xs text-blue-600 font-semibold">Account</p>
                        <h1 className="mt-2 text-2xl font-bold">Sign up</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Create an account to start shopping.
                        </p>

                        <form className="mt-6 space-y-4">
                            <Input className="rounded-sm" placeholder="Full name" />
                            <Input className="rounded-sm" placeholder="Email address" type="email" />
                            <Input className="rounded-sm" placeholder="Password" type="password" />

                            <Button className="w-full rounded-sm bg-blue-600 hover:bg-blue-700">
                                Create account
                            </Button>

                            <div className="text-sm text-muted-foreground text-center">
                                Already have an account?{" "}
                                <Link href="/auth/sign-in" className="text-blue-600 hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </Wrapper>
        </section>
    );
}
