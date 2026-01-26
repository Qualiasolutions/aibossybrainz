"use client";

import {
  AlertCircle,
  ArrowRight,
  Building2,
  CreditCard,
  Loader2,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "@/components/toast";
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
import { getCsrfToken, initCsrfToken } from "@/lib/utils";

const planDetails = {
  monthly: {
    name: "Most Flexible",
    price: "$297",
    period: "per month",
    description: "Cancel anytime. Full access to all features.",
  },
  annual: {
    name: "Best Value",
    price: "$2,500",
    period: "per year",
    description:
      "Save $1,000+ with annual billing. Includes exclusive bonuses.",
  },
  lifetime: {
    name: "Exclusive Lifetime",
    price: "$3,500",
    period: "one-time",
    description: "One payment. Forever access. Limited to 10 seats.",
  },
};

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "E-commerce",
  "Manufacturing",
  "Consulting",
  "Marketing/Advertising",
  "Real Estate",
  "Education",
  "Legal",
  "Hospitality",
  "Other",
];

function SubscribeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") as keyof typeof planDetails | null;
  const reason = searchParams.get("reason"); // "signup" | "expired" | null
  const redirectPath = searchParams.get("redirect") || "/new";
  const [isLoading, setIsLoading] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [industry, setIndustry] = useState("");

  const selectedPlan = plan && planDetails[plan] ? planDetails[plan] : null;

  // Check if user already has active subscription
  useEffect(() => {
    async function checkSubscription() {
      try {
        const res = await fetch("/api/subscription");
        if (res.ok) {
          const data = await res.json();
          if (data.isActive) {
            // User already has active subscription, redirect to app
            router.push(redirectPath);
            return;
          }
        }
      } catch (error) {
        console.error("Failed to check subscription:", error);
      }
      setCheckingSubscription(false);
    }
    checkSubscription();
  }, [router, redirectPath]);

  // Determine header text based on reason
  const getHeaderContent = () => {
    if (reason === "expired") {
      return {
        icon: <AlertCircle className="size-8" />,
        iconBg: "from-amber-500 to-orange-600",
        title: "Your Subscription Has Expired",
        subtitle: "Renew now to continue accessing Boss Brainz",
      };
    }
    return {
      icon: <Sparkles className="size-8" />,
      iconBg: "from-rose-500 to-red-600",
      title: "Start Your Free Trial",
      subtitle: "Tell us a bit about yourself to personalize your experience",
    };
  };

  const headerContent = getHeaderContent();

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
      // Initialize CSRF if needed
      await initCsrfToken();
      const csrfToken = getCsrfToken() || "";

      // Save profile info
      const profileRes = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          displayName,
          industry,
        }),
      });

      if (!profileRes.ok) {
        console.error("Failed to save profile");
        // Continue anyway - don't block checkout
      }

      // Proceed to Stripe checkout
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
        toast({
          type: "error",
          description: data.error || "Failed to start checkout",
        });
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

  // Show loading while checking subscription
  if (checkingSubscription) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100">
        <Loader2 className="size-8 animate-spin text-rose-500" />
      </div>
    );
  }

  // If no plan selected, default to monthly
  const activePlan = selectedPlan || planDetails.monthly;
  const activePlanId = plan || "monthly";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white p-8 shadow-xl">
          {/* Header - dynamic based on reason */}
          <div className="mb-8 text-center">
            <div
              className={`mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br ${headerContent.iconBg} text-white`}
            >
              {headerContent.icon}
            </div>
            <h1 className="text-2xl font-bold text-stone-900">
              {headerContent.title}
            </h1>
            <p className="mt-2 text-stone-500">{headerContent.subtitle}</p>
          </div>

          {/* Plan Summary */}
          <div className="mb-6 rounded-2xl bg-stone-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-900">
                  {activePlan.name}
                </p>
                <p className="text-sm text-stone-500">
                  {activePlan.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-stone-900">
                  {activePlan.price}
                </p>
                <p className="text-sm text-stone-500">{activePlan.period}</p>
              </div>
            </div>
            {/* Link to change plan */}
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full text-rose-600 hover:text-rose-700"
              onClick={() => router.push("/pricing")}
            >
              Change Plan
            </Button>
          </div>

          {/* Profile Form */}
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="name"
                className="flex items-center gap-1.5 text-sm font-medium text-stone-700"
              >
                <User className="size-4" />
                Your Name
              </Label>
              <Input
                id="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                className="mt-1.5"
                autoFocus
              />
            </div>

            <div>
              <Label
                htmlFor="industry"
                className="flex items-center gap-1.5 text-sm font-medium text-stone-700"
              >
                <Building2 className="size-4" />
                Industry
              </Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="mt-1.5">
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
          </div>

          {/* Trial Info */}
          <div className="my-6 rounded-xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 size-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">7-Day Free Trial</p>
                <p className="text-sm text-green-700">
                  You won't be charged until your trial ends. Cancel anytime.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Button
            size="lg"
            className="w-full gap-2 text-base"
            onClick={handleSaveAndCheckout}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="size-5" />
                Continue to Payment
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>

          <p className="mt-4 text-center text-xs text-stone-400">
            Your credit card will be securely saved for when your trial ends
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="size-8 animate-spin text-rose-500" />
        </div>
      }
    >
      <SubscribeContent />
    </Suspense>
  );
}
