"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useActionState, useEffect, useRef, useState } from "react";

import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "@/components/toast";
import { type LoginActionState, login } from "../actions";

const loginHighlights = [
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

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasRedirected = useRef(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: "idle",
    },
  );

  useEffect(() => {
    if (state.status === "failed") {
      toast({
        type: "error",
        description: "Invalid credentials!",
      });
    } else if (state.status === "invalid_data") {
      toast({
        type: "error",
        description: "Failed validating your submission!",
      });
    } else if (state.status === "success" && !hasRedirected.current) {
      hasRedirected.current = true;
      setIsSuccessful(true);

      // If there's a plan, redirect to checkout
      if (plan) {
        setIsRedirecting(true);
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
              router.push("/new");
            }
          })
          .catch(() => {
            toast({ type: "error", description: "Failed to start checkout" });
            router.push("/new");
          });
      } else {
        router.push("/new");
      }
    }
  }, [router, state.status, plan]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formAction(formData);
  };

  return (
    <AuthShell
      description="We're excited to talk to you. Don't forget, you can hear our voices too. Ask Alexandria and Kim anything when it comes to sales and marketing."
      highlights={loginHighlights}
      title="Welcome Back to Your Sales & Marketing Superheroes"
    >
      <div className="space-y-2 text-center">
        <h2 className="font-semibold text-2xl text-slate-900">Sign in</h2>
        <p className="text-slate-500 text-sm">
          {plan ? (
            <>
              Continue with the{" "}
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
        <div className="flex justify-end -mt-2">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-rose-600 hover:text-rose-700"
          >
            Forgot password?
          </Link>
        </div>
        <SubmitButton isSuccessful={isSuccessful || isRedirecting}>
          {isRedirecting ? "Redirecting to checkout..." : "Sign in"}
        </SubmitButton>
      </AuthForm>
      <p className="text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link
          href={`/signup${plan ? `?plan=${plan}` : ""}`}
          className="font-medium text-rose-600 hover:text-rose-700"
        >
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
