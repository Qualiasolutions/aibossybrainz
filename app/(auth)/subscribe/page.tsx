"use client";

import { motion } from "framer-motion";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/toast";
import { cn } from "@/lib/utils";
import { getCsrfToken, initCsrfToken } from "@/lib/utils";

const ALECCI_LOGO_URL =
  "https://images.squarespace-cdn.com/content/v1/5ea759fa9e5575487ad28cd0/1591228238957-80Y8AGN1M9TTXTYNJ5QK/AM_Logo_Horizontal_4C+%281%29.jpg?format=500w";

const planDetails = {
  monthly: {
    name: "Monthly",
    price: "$297",
    period: "/month",
    description: "Full access, cancel anytime",
  },
  annual: {
    name: "Annual",
    price: "$2,500",
    period: "/year",
    description: "Save over $1,000 annually",
    badge: "Best Value",
  },
  lifetime: {
    name: "Lifetime",
    price: "$3,500",
    period: "one-time",
    description: "Forever access, limited seats",
    badge: "Exclusive",
  },
};

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "E-commerce",
  "Manufacturing",
  "Consulting",
  "Marketing & Advertising",
  "Real Estate",
  "Education",
  "Legal",
  "Hospitality",
  "Other",
];

// Success component shown after payment
function PaymentSuccess({ redirectPath }: { redirectPath: string }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(redirectPath);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, redirectPath]);

  return (
    <div className="relative min-h-screen bg-stone-50">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-100 via-stone-50 to-white" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 py-16">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Image
            src={ALECCI_LOGO_URL}
            alt="Alecci Media"
            width={160}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
        </motion.div>

        {/* Success card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full"
        >
          <div className="rounded-2xl border border-stone-200/60 bg-white p-10 text-center shadow-xl shadow-stone-200/20">
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-stone-900"
            >
              <Check className="h-8 w-8 text-white" strokeWidth={3} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-light text-stone-900 tracking-tight sm:text-3xl"
            >
              Welcome to Boss Brainz
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-3 text-stone-500"
            >
              Your 7-day free trial has started. You now have full access to your AI executive team.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <Link href={redirectPath}>
                <Button
                  size="lg"
                  className="h-12 w-full bg-stone-900 text-white shadow-lg shadow-stone-900/10 transition-all hover:bg-stone-800"
                >
                  Start Your First Conversation
                </Button>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-4 text-sm text-stone-400"
            >
              Redirecting in {countdown} seconds...
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SubscribeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") as keyof typeof planDetails | null;
  const reason = searchParams.get("reason");
  const payment = searchParams.get("payment"); // "success" after Stripe checkout
  const redirectPath = searchParams.get("redirect") || "/new";
  const [isLoading, setIsLoading] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [industry, setIndustry] = useState("");

  const selectedPlan = plan && planDetails[plan] ? planDetails[plan] : null;

  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;
    let pollCount = 0;
    const maxPolls = 15; // 30 seconds max (15 * 2s)

    async function checkSubscription() {
      try {
        const res = await fetch("/api/subscription");
        if (res.ok) {
          const data = await res.json();
          if (data.isActive) {
            setHasActiveSubscription(true);
            if (pollInterval) clearInterval(pollInterval);
            // If payment=success, show success page, otherwise redirect
            if (payment !== "success") {
              router.push(redirectPath);
              return;
            }
          } else if (payment === "success" && pollCount < maxPolls) {
            // Keep polling - webhook might not have processed yet
            return;
          }
        }
      } catch (error) {
        console.error("Failed to check subscription:", error);
      }
      setCheckingSubscription(false);
    }

    checkSubscription();

    // If payment=success, poll for subscription activation
    if (payment === "success") {
      pollInterval = setInterval(() => {
        pollCount++;
        if (pollCount >= maxPolls) {
          if (pollInterval) clearInterval(pollInterval);
          setCheckingSubscription(false);
          return;
        }
        checkSubscription();
      }, 2000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [router, redirectPath, payment]);

  const handleSaveAndCheckout = async () => {
    if (!displayName.trim()) {
      toast({ type: "error", description: "Please enter your name" });
      return;
    }
    if (!industry) {
      toast({ type: "error", description: "Please select your industry" });
      return;
    }

    setIsLoading(true);

    try {
      await initCsrfToken();
      const csrfToken = getCsrfToken() || "";

      const profileRes = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ displayName, industry }),
      });

      if (!profileRes.ok) {
        console.error("Failed to save profile");
      }

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: activePlanId }),
      });

      const data = await response.json();

      if (response.status === 401) {
        toast({ type: "error", description: "Please log in to continue" });
        router.push(`/login?plan=${activePlanId}`);
        return;
      }

      if (!response.ok) {
        toast({ type: "error", description: data.error || "Failed to start checkout" });
        setIsLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({ type: "error", description: "Unable to start checkout" });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({ type: "error", description: "Network error. Please try again." });
      setIsLoading(false);
    }
  };

  // Show loading spinner while checking
  if (checkingSubscription) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-stone-900" />
        </motion.div>
      </div>
    );
  }

  // Show success page after payment
  if (payment === "success" && hasActiveSubscription) {
    return <PaymentSuccess redirectPath={redirectPath} />;
  }

  // If payment=success but subscription not active yet, wait for webhook
  if (payment === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-stone-900" />
          <p className="text-stone-600">Activating your subscription...</p>
          <p className="text-sm text-stone-400">This may take a few seconds</p>
        </motion.div>
      </div>
    );
  }

  const activePlan = selectedPlan || planDetails.monthly;
  const activePlanId = plan || "monthly";

  return (
    <div className="relative min-h-screen bg-stone-50">
      {/* Refined background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-100 via-stone-50 to-white" />
      </div>

      <div className="relative z-10 mx-auto max-w-lg px-6 py-16 sm:py-24">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex justify-center"
        >
          <Image
            src={ALECCI_LOGO_URL}
            alt="Alecci Media"
            width={160}
            height={40}
            className="h-9 w-auto object-contain"
            priority
            unoptimized
          />
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <div className="rounded-2xl border border-stone-200/60 bg-white shadow-xl shadow-stone-200/20">
            {/* Top accent */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-stone-900/20 to-transparent" />

            <div className="p-8 sm:p-10">
              {/* Header */}
              <div className="mb-8 text-center">
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-light text-stone-900 tracking-tight sm:text-3xl"
                >
                  {reason === "expired" ? "Renew Your Access" : "Start Your Journey"}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="mt-2 text-stone-500"
                >
                  {reason === "expired"
                    ? "Continue where you left off"
                    : "7-day free trial, then subscribe"}
                </motion.p>
              </div>

              {/* Plan selector */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <div className="rounded-xl border border-stone-100 bg-stone-50/50 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-stone-900">{activePlan.name}</span>
                        {"badge" in activePlan && (activePlan as { badge?: string }).badge && (
                          <span className="rounded-full bg-stone-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
                            {(activePlan as { badge: string }).badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-stone-500">{activePlan.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-light text-stone-900">{activePlan.price}</span>
                      <span className="text-sm text-stone-400">{activePlan.period}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/pricing")}
                    className="mt-4 flex w-full items-center justify-center gap-1 text-sm text-stone-500 transition-colors hover:text-stone-900"
                  >
                    View all plans
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>

              {/* Form */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="space-y-5"
              >
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-stone-700">
                    Your name
                  </Label>
                  <Input
                    id="name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-2 h-11 border-stone-200 bg-white focus:border-stone-400 focus:ring-stone-400"
                    autoFocus
                  />
                </div>

                <div>
                  <Label htmlFor="industry" className="text-sm font-medium text-stone-700">
                    Industry
                  </Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className="mt-2 h-11 border-stone-200 bg-white focus:border-stone-400 focus:ring-stone-400">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>

              {/* Trial notice */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 rounded-lg border border-stone-100 bg-stone-50/50 p-4"
              >
                <p className="text-center text-sm text-stone-600">
                  <span className="font-medium text-stone-900">7 days free</span>
                  {" · "}
                  Cancel anytime
                  {" · "}
                  Secure checkout
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="mt-6"
              >
                <Button
                  size="lg"
                  className={cn(
                    "h-12 w-full bg-stone-900 text-white transition-all hover:bg-stone-800",
                    "shadow-lg shadow-stone-900/10",
                  )}
                  onClick={handleSaveAndCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Continue to payment"
                  )}
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-center text-xs text-stone-400"
              >
                Your card will be saved securely for when your trial ends
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-sm text-stone-400"
        >
          Questions?{" "}
          <Link href="/contact" className="text-stone-600 underline-offset-4 hover:underline">
            Contact us
          </Link>
        </motion.p>
      </div>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-stone-50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-stone-900" />
        </div>
      }
    >
      <SubscribeContent />
    </Suspense>
  );
}
