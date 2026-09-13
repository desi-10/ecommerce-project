"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import AuthShell from "@/components/auth/auth-shell";
import { PasswordField } from "@/components/auth/form-field";
import { resetPassword } from "@/lib/auth-client";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    setServerError(null);

    if (!token) {
      setServerError("This reset link is missing or invalid. Please request a new one.");
      return;
    }

    const result = await resetPassword({
      newPassword: data.password,
      token,
    });

    if (result.error) {
      setServerError(
        result.error?.message ||
          "This reset link is invalid or has expired. Please request a new one.",
      );
      return;
    }

    setDone(true);
  };

  if (done) {
    return (
      <AuthShell
        eyebrow="All set"
        title="Password updated"
        subtitle="Your password has been changed successfully."
      >
        <div className="flex flex-col items-center gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-6 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <p className="text-sm text-neutral-700">
            You can now sign in with your new password.
          </p>
          <Button
            className="h-11 w-full rounded-lg text-white"
            style={{ backgroundColor: "var(--primary-600)" }}
            onClick={() => router.push("/auth/sign-in")}
          >
            Continue to sign in
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Set a new password"
      subtitle="Choose a new password for your account."
    >
      {!token ? (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            This link is missing its reset token. Please use the button from your
            email, or{" "}
            <Link href="/auth/forgot-password" className="underline">
              request a new link
            </Link>
            .
          </span>
        </div>
      ) : null}

      {serverError ? (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <PasswordField
          icon={Lock}
          label="New password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register("password")}
        />

        <PasswordField
          icon={Lock}
          label="Confirm new password"
          placeholder="Re-enter your new password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button
          type="submit"
          disabled={isSubmitting || !token}
          className="h-11 w-full rounded-lg text-white"
          style={{ backgroundColor: "var(--primary-600)" }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating password...
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
