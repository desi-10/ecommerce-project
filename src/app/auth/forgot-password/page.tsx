"use client";

import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, AlertCircle, Loader2, ArrowLeft, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import AuthShell from "@/components/auth/auth-shell";
import { IconField } from "@/components/auth/form-field";
import { requestPasswordReset } from "@/lib/auth-client";

const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setServerError(null);

    const result = await requestPasswordReset({
      email: data.email,
      redirectTo: "/auth/reset-password",
    });

    if (result.error) {
      setServerError(result.error?.message || "Something went wrong. Please try again.");
      return;
    }

    setSentTo(data.email);
  };

  if (sentTo) {
    return (
      <AuthShell
        eyebrow="Check your inbox"
        title="Reset link sent"
        subtitle="We just emailed you a link to reset your password."
      >
        <div className="flex flex-col items-center gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-6 text-center">
          <span
            className="grid h-12 w-12 place-items-center rounded-full text-white"
            style={{ backgroundColor: "var(--primary-600)" }}
          >
            <MailCheck className="h-6 w-6" />
          </span>
          <p className="text-sm text-neutral-700">
            If an account exists for <strong>{sentTo}</strong>, a password reset link
            is on its way. It expires in 1 hour — check your spam folder if you don't
            see it soon.
          </p>
          <Link
            href="/auth/sign-in"
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--primary-600)" }}
          >
            Back to sign in
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Forgot your password?"
      subtitle="Enter the email on your account and we'll send you a reset link."
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-lg text-white"
          style={{ backgroundColor: "var(--primary-600)" }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending link...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>

        <Link
          href="/auth/sign-in"
          className="flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-neutral-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      </form>
    </AuthShell>
  );
}
