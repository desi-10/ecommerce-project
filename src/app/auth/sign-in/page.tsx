"use client";

import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import AuthShell from "@/components/auth/auth-shell";
import { IconField, PasswordField } from "@/components/auth/form-field";
import { signIn } from "@/lib/auth-client";

const signInSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInSection() {
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
      rememberMe: data.remember,
      callbackURL: "/",
    });

    if (result.error) {
      setServerError(result.error?.message || "Unable to sign in");
      return;
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your account"
      subtitle="Enter your details below to continue shopping."
    >
      {serverError ? (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <IconField
          icon={Mail}
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordField
          icon={Lock}
          label="Password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-neutral-300 accent-blue-600"
              {...register("remember")}
            />
            Remember me
          </label>
          <Link
            href="/auth/forgot-password"
            className="font-medium hover:underline"
            style={{ color: "var(--primary-600)" }}
          >
            Forgot password?
          </Link>
        </div>

        <Button
          className="h-11 w-full rounded-lg text-white"
          style={{ backgroundColor: "var(--primary-600)" }}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="font-medium hover:underline"
            style={{ color: "var(--primary-600)" }}
          >
            Create one
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
