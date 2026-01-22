"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";

const successHighlights = [
  {
    title: "Meet Your Executives",
    description:
      "Alexandria (CMO) handles brand strategy and marketing. Kim (CSO) focuses on sales and revenue growth.",
  },
  {
    title: "Start Chatting",
    description:
      "Ask anything about your business challenges. The more context you provide, the better advice you'll get.",
  },
  {
    title: "Voice Conversations",
    description:
      "Use the voice feature to have natural conversations with your AI executives - just like talking to real consultants.",
  },
];

function SignupSuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  return (
    <AuthShell
      description="Your AI executives are ready to help you grow your business."
      highlights={successHighlights}
      title="Welcome to Boss Brainz!"
    >
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200">
          <svg
            className="h-10 w-10 text-emerald-600"
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
            Account Created!
          </h2>
          <p className="text-slate-500 text-sm">
            Welcome to your AI-powered executive team
          </p>
        </div>

        <div className="space-y-4 pt-4">
          {plan ? (
            <div className="rounded-xl bg-rose-50 p-4 text-left">
              <p className="text-sm font-medium text-rose-900">
                Selected Plan: {plan === "monthly" ? "Monthly" : plan === "annual" ? "Annual" : "Lifetime"}
              </p>
              <p className="text-sm text-rose-700 mt-1">
                You'll be redirected to complete your subscription.
              </p>
            </div>
          ) : (
            <div className="rounded-xl bg-blue-50 p-4 text-left">
              <p className="text-sm font-medium text-blue-900">
                7-Day Free Trial Active
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Explore all features with 100 messages per day included.
              </p>
            </div>
          )}

          <Link href="/new" className="block">
            <Button className="w-full bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 shadow-lg">
              Start Your First Conversation
            </Button>
          </Link>

          <p className="text-xs text-slate-400">
            You can upgrade or change your plan anytime
          </p>
        </div>
      </div>
    </AuthShell>
  );
}

export default function SignupSuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <SignupSuccessContent />
    </Suspense>
  );
}
