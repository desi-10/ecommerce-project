"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/wrapper";
import { signIn } from "@/lib/auth-client";

const signInSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInSection() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const onSubmit = async (data: SignInValues) => {
    setServerError(null);

    const result = await signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: "/",
    });

    if (result.error) {
      setServerError(result.error?.message || "Unable to sign in");
      return;
    }

  };

  return (
    <section className="bg-white border-b">
      <Wrapper>
        <div className="py-8 md:py-12">
          <div className="mx-auto max-w-md border border-neutral-200 bg-white p-6 md:p-8">
            <p className="text-xs font-semibold text-blue-600">Account</p>
            <h1 className="mt-2 text-2xl font-bold">Sign in</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Welcome back. Enter your details to continue.
            </p>

            {serverError ? (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {serverError}
              </div>
            ) : null}

            <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-1">
                <Input
                  className="rounded-sm"
                  placeholder="Email address"
                  type="email"
                  {...register("email")}
                />
                {errors.email ? (
                  <p className="text-xs text-red-600">{errors.email.message}</p>
                ) : null}
              </div>

              <div className="space-y-1">
                <Input
                  className="rounded-sm"
                  placeholder="Password"
                  type="password"
                  {...register("password")}
                />
                {errors.password ? (
                  <p className="text-xs text-red-600">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <input type="checkbox" {...register("remember")} />
                  Remember me
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button className="w-full rounded-sm" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
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
