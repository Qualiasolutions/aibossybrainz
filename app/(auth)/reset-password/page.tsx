"use client";

import Form from "next/form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useActionState, useEffect, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "@/components/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ResetPasswordActionState, resetPassword } from "../actions";

const resetPasswordHighlights = [
  {
    title: "Strong Password Tips",
    description:
      "Use at least 8 characters with a mix of letters, numbers, and symbols for better security.",
  },
  {
    title: "Keep It Secure",
    description:
      "Don't reuse passwords from other accounts. Your AI executives deserve unique protection!",
  },
  {
    title: "Almost There",
    description:
      "Once you reset your password, you'll be automatically logged in and ready to go!",
  },
];

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isInvalidLink, setIsInvalidLink] = useState(false);

  // Check for error params (from Supabase redirect)
  useEffect(() => {
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error) {
      setIsInvalidLink(true);
      toast({
        type: "error",
        description:
          errorDescription || "This reset link is invalid or has expired.",
      });
    }
  }, [searchParams]);

  const [state, formAction] = useActionState<
    ResetPasswordActionState,
    FormData
  >(resetPassword, { status: "idle" });

  useEffect(() => {
    if (state.status === "success") {
      setIsSuccessful(true);
      toast({
        type: "success",
        description: "Password updated! Welcome back to Boss Brainz!",
      });
      // User is already authenticated via the reset link - redirect to app
      setTimeout(() => {
        router.push("/new");
      }, 2000);
    } else if (state.status === "failed") {
      toast({
        type: "error",
        description:
          state.message || "Failed to reset password. Please try again.",
      });
    } else if (state.status === "invalid_data") {
      toast({
        type: "error",
        description: "Password must be at least 6 characters.",
      });
    } else if (state.status === "mismatch") {
      toast({
        type: "error",
        description: "Passwords do not match.",
      });
    }
  }, [state, router]);

  if (isInvalidLink) {
    return (
      <AuthShell
        description="We're here to help you get back into your account."
        highlights={resetPasswordHighlights}
        title="Link Expired"
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
            <svg
              className="h-8 w-8 text-rose-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="font-semibold text-2xl text-slate-900">
              Reset Link Invalid
            </h2>
            <p className="text-slate-500 text-sm">
              This password reset link has expired or is invalid.
            </p>
          </div>
          <Link
            href="/forgot-password"
            className="inline-block rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 px-6 py-3 font-medium text-white shadow-lg hover:from-rose-600 hover:to-red-600"
          >
            Request New Link
          </Link>
        </div>
      </AuthShell>
    );
  }

  if (isSuccessful) {
    return (
      <AuthShell
        description="We're here to help you get back into your account."
        highlights={resetPasswordHighlights}
        title="Password Reset"
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg
              className="h-8 w-8 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="font-semibold text-2xl text-slate-900">
              Welcome Back!
            </h2>
            <p className="text-slate-500 text-sm">
              Your password has been successfully updated.
            </p>
            <p className="text-slate-500 text-sm">
              Taking you to your AI executives...
            </p>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      description="We're here to help you get back into your account."
      highlights={resetPasswordHighlights}
      title="Create New Password"
    >
      <div className="space-y-2 text-center">
        <h2 className="font-semibold text-2xl text-slate-900">New Password</h2>
        <p className="text-slate-500 text-sm">Enter your new password below</p>
      </div>
      <Form action={formAction} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label
            className="font-medium text-slate-600 text-sm"
            htmlFor="password"
          >
            New Password
          </Label>
          <Input
            autoComplete="new-password"
            autoFocus
            className="h-12 rounded-2xl border-transparent bg-white/80 px-4 text-base text-slate-700 shadow-[inset_0_2px_12px_rgba(244,114,182,0.12)] shadow-inner transition-all focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-rose-400/60 md:text-sm"
            id="password"
            name="password"
            placeholder="Min 6 characters"
            required
            type="password"
            minLength={6}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label
            className="font-medium text-slate-600 text-sm"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </Label>
          <Input
            autoComplete="new-password"
            className="h-12 rounded-2xl border-transparent bg-white/80 px-4 text-base text-slate-700 shadow-[inset_0_2px_12px_rgba(244,114,182,0.12)] shadow-inner transition-all focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-rose-400/60 md:text-sm"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Re-enter your password"
            required
            type="password"
            minLength={6}
          />
        </div>
        <SubmitButton isSuccessful={isSuccessful}>Reset Password</SubmitButton>
      </Form>
      <p className="text-center text-sm text-slate-500">
        <Link
          href="/login"
          className="font-medium text-rose-600 hover:text-rose-700"
        >
          Back to Sign In
        </Link>
      </p>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
