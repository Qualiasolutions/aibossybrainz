"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useActionState, useEffect, useRef, useState } from "react";

import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "@/components/toast";
import { type SignupActionState, signup } from "../actions";

const signupHighlights = [
  {
    title: "You're Here to Build",
    description:
      "This isn't a content vault for 'someday.' Every tool, every prompt, every checklist is built to help your business grow.",
  },
  {
    title: "Your Prompt Matters",
    description:
      "The more detailed your prompts, the more detailed your responses. The more specific your ask, the better the strategy.",
  },
  {
    title: "Implement, Don't Hoard",
    description:
      "Clarity without action is just procrastination. Pick one thing and implement it to achieve better business outcomes.",
  },
];

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [showCheckEmail, setShowCheckEmail] = useState(false);
  const hasHandledSuccess = useRef(false);

  const [state, formAction] = useActionState<SignupActionState, FormData>(
    signup,
    {
      status: "idle",
    },
  );

  useEffect(() => {
    if (state.status === "failed") {
      toast({
        type: "error",
        description: "Something went wrong. Please try again.",
      });
    } else if (state.status === "invalid_data") {
      toast({
        type: "error",
        description:
          "Please enter a valid email and password (min 6 characters).",
      });
    } else if (state.status === "user_exists") {
      toast({
        type: "error",
        description:
          "An account with this email already exists. Please sign in instead.",
      });
      router.push(`/login${plan ? `?plan=${plan}` : ""}`);
    } else if (state.status === "success" && !hasHandledSuccess.current) {
      hasHandledSuccess.current = true;
      setIsSuccessful(true);
      setShowCheckEmail(true);

      toast({
        type: "success",
        description: "Check your email to confirm your account!",
      });
    }
  }, [router, state.status, plan]);

  const handleSubmit = (formData: FormData) => {
    const emailValue = formData.get("email") as string;
    setEmail(emailValue);
    // Add plan to form data so it's included in the email redirect
    if (plan) {
      formData.set("plan", plan);
    }
    formAction(formData);
  };

  // Show "check your email" screen after successful signup
  if (showCheckEmail) {
    return (
      <AuthShell
        description="We've sent you a confirmation email. Click the link to activate your account and start your free trial."
        highlights={signupHighlights}
        title="Check Your Email"
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-rose-100">
            <Mail className="size-8 text-rose-600" />
          </div>
          <div className="space-y-2">
            <h2 className="font-semibold text-2xl text-slate-900">
              Check your inbox
            </h2>
            <p className="text-slate-500">
              We've sent a confirmation email to{" "}
              <span className="font-medium text-slate-700">{email}</span>
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">
              Click the link in the email to confirm your account and{" "}
              {plan ? (
                <>
                  start your{" "}
                  <span className="font-medium text-rose-600">
                    7-day free trial
                  </span>
                </>
              ) : (
                "get started"
              )}
            </p>
          </div>
          <p className="text-sm text-slate-400">
            Didn't receive it? Check your spam folder or{" "}
            <button
              onClick={() => {
                setShowCheckEmail(false);
                hasHandledSuccess.current = false;
              }}
              className="font-medium text-rose-600 hover:text-rose-700"
            >
              try again
            </button>
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      description="Join thousands of founders using AI-powered sales and marketing executives to grow their business."
      highlights={signupHighlights}
      title="Start Your Sales & Marketing Transformation"
    >
      <div className="space-y-2 text-center">
        <h2 className="font-semibold text-2xl text-slate-900">
          Create Account
        </h2>
        <p className="text-slate-500 text-sm">
          {plan ? (
            <>
              Get started with the{" "}
              <span className="font-medium text-rose-600">
                {plan === "monthly"
                  ? "Most Flexible"
                  : plan === "annual"
                    ? "Best Value"
                    : "Exclusive Lifetime"}
              </span>{" "}
              plan
            </>
          ) : (
            "The AI Boss Brainz Workspace — Powered by Alecci Media"
          )}
        </p>
      </div>
      <AuthForm
        action={handleSubmit}
        className="px-0 sm:px-0"
        defaultEmail={email}
      >
        <SubmitButton isSuccessful={isSuccessful}>Create Account</SubmitButton>
      </AuthForm>
      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href={`/login${plan ? `?plan=${plan}` : ""}`}
          className="font-medium text-rose-600 hover:text-rose-700"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
