"use client";

import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/wrapper";
import { signUp } from "@/lib/auth-client";


const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpSection() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    // defaultValues: {
    //   name: "",
    //   email: "",
    //   password: "",
    // },
  });

  const onSubmit = async (data: SignUpValues) => {
    setServerError(null);

    const result = await signUp.email({
      email: data.email,
      password: data.password,
      name: data.name, // keep if your provider accepts it
      callbackURL: "/",

    });

    console.log(result, "result");

    // Better-auth usually returns something like { error } when it fails
    if (result.error) {
      setServerError(result.error?.message || "Signup failed");
      return;
    }
  };

  return (
    <section className="bg-white min-h-screen w-full">
      <Wrapper>
        <div className="py-8 md:py-12">
          <div className="mx-auto max-w-md border border-neutral-200 bg-white p-6 md:p-8">
            <p className="text-xs font-semibold text-primary">Account</p>
            <h1 className="mt-2 text-2xl font-bold">Sign up</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Create an account to start shopping.
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
                  placeholder="Full name"
                  {...register("name")}
                />
                {errors.name ? (
                  <p className="text-xs text-red-600">{errors.name.message}</p>
                ) : null}
              </div>

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

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth/sign-in"
                  className="text-blue-600 hover:underline"
                >
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
