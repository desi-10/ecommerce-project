"use client";

import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import AuthShell from "@/components/auth/auth-shell";
import { IconField, PasswordField } from "@/components/auth/form-field";
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
  });

  const onSubmit = async (data: SignUpValues) => {
    setServerError(null);

    const result = await signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      callbackURL: "/",
    });

    if (result.error) {
      setServerError(result.error?.message || "Signup failed");
      return;
    }
  };

  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your account"
      subtitle="Sign up in seconds and start shopping today."
    >
      {serverError ? (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <IconField
          icon={User}
          label="Full name"
          placeholder="Jane Doe"
          error={errors.name?.message}
          {...register("name")}
        />

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
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register("password")}
        />

        <p className="text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-lg text-white"
          style={{ backgroundColor: "var(--primary-600)" }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="font-medium hover:underline"
            style={{ color: "var(--primary-600)" }}
          >
            Sign in
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
