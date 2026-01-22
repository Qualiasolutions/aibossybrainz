"use client";

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
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasRedirected = useRef(false);

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
        description: "Please enter a valid email and password (min 6 characters).",
      });
    } else if (state.status === "user_exists") {
      toast({
        type: "error",
        description: "An account with this email already exists. Please sign in instead.",
      });
      router.push(`/login${plan ? `?plan=${plan}` : ""}`);
    } else if (state.status === "success" && !hasRedirected.current) {
      hasRedirected.current = true;
      setIsSuccessful(true);

      toast({
        type: "success",
        description: "Account created successfully!",
      });

      // If there's a plan, redirect to checkout via success page
      if (plan) {
        setIsRedirecting(true);
        // Call the checkout API to create a Stripe session
        fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId: plan }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.url) {
              window.location.href = data.url;
            } else {
              toast({ type: "error", description: "Failed to start checkout" });
              router.push(`/signup-success${plan ? `?plan=${plan}` : ""}`);
            }
          })
          .catch(() => {
            toast({ type: "error", description: "Failed to start checkout" });
            router.push(`/signup-success${plan ? `?plan=${plan}` : ""}`);
          });
      } else {
        // Show success page before going to app
        router.push("/signup-success");
      }
    }
  }, [router, state.status, plan]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formAction(formData);
  };

  return (
    <AuthShell
      description="Join thousands of founders using AI-powered sales and marketing executives to grow their business."
      highlights={signupHighlights}
      title="Start Your Sales & Marketing Transformation"
    >
      <div className="space-y-2 text-center">
        <h2 className="font-semibold text-2xl text-slate-900">Create Account</h2>
        <p className="text-slate-500 text-sm">
          {plan ? (
            <>Get started with the <span className="font-medium text-rose-600">{plan === "monthly" ? "Most Flexible" : plan === "annual" ? "Best Value" : "Exclusive Lifetime"}</span> plan</>
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
        <SubmitButton isSuccessful={isSuccessful || isRedirecting}>
          {isRedirecting ? "Redirecting to checkout..." : "Create Account"}
        </SubmitButton>
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
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
