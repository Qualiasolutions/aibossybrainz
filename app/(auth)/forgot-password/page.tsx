"use client";

import Form from "next/form";
import Link from "next/link";
import { Suspense, useActionState, useEffect, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "@/components/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type ForgotPasswordActionState,
  requestPasswordReset,
} from "../actions";

const forgotPasswordHighlights = [
  {
    title: "Secure Reset Process",
    description:
      "We'll send a secure link to your email to reset your password. The link expires in 1 hour.",
  },
  {
    title: "Check Your Inbox",
    description:
      "If you don't see the email, check your spam folder. The email comes from noreply@aleccimedia.com.",
  },
  {
    title: "Need Help?",
    description:
      "If you're still having trouble, contact our support team for assistance.",
  },
];

function ForgotPasswordContent() {
  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<
    ForgotPasswordActionState,
    FormData
  >(requestPasswordReset, { status: "idle" });

  useEffect(() => {
    if (state.status === "success") {
      setIsSuccessful(true);
      toast({
        type: "success",
        description: "Check your email for a password reset link!",
      });
    } else if (state.status === "failed") {
      toast({
        type: "error",
        description: "Something went wrong. Please try again.",
      });
    } else if (state.status === "invalid_data") {
      toast({
        type: "error",
        description: "Please enter a valid email address.",
      });
    }
  }, [state.status]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formAction(formData);
  };

  if (isSuccessful) {
    return (
      <AuthShell
        description="We're here to help you get back into your account."
        highlights={forgotPasswordHighlights}
        title="Check Your Email"
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="font-semibold text-2xl text-slate-900">
              Email Sent!
            </h2>
            <p className="text-slate-500 text-sm">
              We sent a password reset link to{" "}
              <span className="font-medium text-slate-700">{email}</span>
            </p>
            <p className="text-slate-500 text-sm">
              The link will expire in 1 hour.
            </p>
          </div>
          <div className="space-y-3 pt-4">
            <p className="text-slate-500 text-sm">
              Didn't receive the email?{" "}
              <button
                onClick={() => setIsSuccessful(false)}
                className="font-medium text-rose-600 hover:text-rose-700"
              >
                Try again
              </button>
            </p>
            <Link
              href="/login"
              className="block font-medium text-rose-600 hover:text-rose-700"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      description="We're here to help you get back into your account."
      highlights={forgotPasswordHighlights}
      title="Reset Your Password"
    >
      <div className="space-y-2 text-center">
        <h2 className="font-semibold text-2xl text-slate-900">
          Forgot Password?
        </h2>
        <p className="text-slate-500 text-sm">
          Enter your email and we'll send you a reset link
        </p>
      </div>
      <Form action={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-slate-600 text-sm" htmlFor="email">
            Email Address
          </Label>
          <Input
            autoComplete="email"
            autoFocus
            className="h-12 rounded-2xl border-transparent bg-white/80 px-4 text-base text-slate-700 shadow-[inset_0_2px_12px_rgba(244,114,182,0.12)] shadow-inner transition-all placeholder:text-slate-400 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-rose-400/60 md:text-sm"
            defaultValue={email}
            id="email"
            name="email"
            placeholder="you@company.com"
            required
            type="email"
          />
        </div>
        <SubmitButton isSuccessful={isSuccessful}>Send Reset Link</SubmitButton>
      </Form>
      <p className="text-center text-sm text-slate-500">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-medium text-rose-600 hover:text-rose-700"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
