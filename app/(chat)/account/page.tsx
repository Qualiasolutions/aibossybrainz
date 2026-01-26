"use client";

import {
  AlertTriangle,
  Building2,
  Check,
  CreditCard,
  Crown,
  ExternalLink,
  Loader2,
  Mail,
  Save,
  Target,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { getCsrfToken, initCsrfToken } from "@/lib/utils";

interface ProfileData {
  id: string;
  email: string;
  displayName: string | null;
  companyName: string | null;
  industry: string | null;
  businessGoals: string | null;
  preferredBotType: string | null;
  onboardedAt: string | null;
}

interface SubscriptionData {
  subscriptionType: string | null;
  subscriptionStatus: string | null;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  hasStripeSubscription: boolean;
}

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

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [businessGoals, setBusinessGoals] = useState("");

  useEffect(() => {
    initCsrfToken().then(() => loadData());
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, subRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/subscription"),
      ]);

      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfile(data);
        setDisplayName(data.displayName || "");
        setCompanyName(data.companyName || "");
        setIndustry(data.industry || "");
        setBusinessGoals(data.businessGoals || "");
      }

      if (subRes.ok) {
        const data = await subRes.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Failed to load account data:", error);
      toast.error("Failed to load account data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const csrfToken = getCsrfToken() || "";
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          displayName: displayName || null,
          companyName: companyName || null,
          industry: industry || null,
          businessGoals: businessGoals || null,
        }),
      });

      if (res.ok) {
        toast.success("Profile updated successfully");
        loadData();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const csrfToken = getCsrfToken() || "";
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ action: "portal" }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        toast.error("Failed to open billing portal");
      }
    } catch (error) {
      console.error("Failed to open billing portal:", error);
      toast.error("Failed to open billing portal");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      const csrfToken = getCsrfToken() || "";
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ action: "cancel" }),
      });

      if (res.ok) {
        toast.success("Subscription cancelled. You'll receive a confirmation email.");
        setShowCancelDialog(false);
        loadData();
      } else {
        toast.error("Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      toast.error("Failed to cancel subscription");
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string | null | undefined) => {
    const statusConfig = {
      active: { color: "bg-emerald-100 text-emerald-700", label: "Active" },
      trialing: { color: "bg-blue-100 text-blue-700", label: "Trial" },
      cancelled: { color: "bg-amber-100 text-amber-700", label: "Cancelled" },
      expired: { color: "bg-red-100 text-red-700", label: "Expired" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "bg-gray-100 text-gray-700",
      label: status || "None",
    };
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPlanName = (type: string | null | undefined) => {
    const plans = {
      trial: "Free Trial",
      monthly: "Most Flexible (Monthly)",
      annual: "Best Value (Annual)",
      lifetime: "Exclusive Lifetime",
    };
    return plans[type as keyof typeof plans] || "No Plan";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900">Account Settings</h1>
        <p className="mt-1 text-stone-500">Manage your profile and subscription</p>
      </div>

      <div className="space-y-6">
        {/* Subscription Section */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-rose-100">
              <Crown className="size-5 text-rose-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-stone-900">Subscription</h2>
              <p className="text-sm text-stone-500">Your current plan and billing</p>
            </div>
          </div>

          <div className="rounded-xl bg-stone-50 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-stone-500">Current Plan</p>
                <p className="mt-1 text-lg font-semibold text-stone-900">
                  {getPlanName(subscription?.subscriptionType)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-stone-500">Status</p>
                <div className="mt-1">{getStatusBadge(subscription?.subscriptionStatus)}</div>
              </div>
              {subscription?.subscriptionStartDate && (
                <div>
                  <p className="text-sm font-medium text-stone-500">Started</p>
                  <p className="mt-1 text-stone-900">{formatDate(subscription.subscriptionStartDate)}</p>
                </div>
              )}
              {subscription?.subscriptionEndDate && (
                <div>
                  <p className="text-sm font-medium text-stone-500">
                    {subscription.subscriptionStatus === "cancelled" ? "Access Until" : "Renews"}
                  </p>
                  <p className="mt-1 text-stone-900">{formatDate(subscription.subscriptionEndDate)}</p>
                </div>
              )}
            </div>
          </div>

          {subscription?.subscriptionStatus === "cancelled" && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800">Subscription Cancelled</p>
                <p className="text-sm text-amber-700">
                  You'll continue to have access until {formatDate(subscription.subscriptionEndDate)}.
                  After that, you can resubscribe anytime.
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {subscription?.hasStripeSubscription && (
              <Button
                variant="outline"
                onClick={handleManageBilling}
                disabled={portalLoading}
                className="gap-2"
              >
                {portalLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CreditCard className="size-4" />
                )}
                Manage Billing
                <ExternalLink className="size-3" />
              </Button>
            )}

            {!subscription?.subscriptionType && (
              <Button onClick={() => router.push("/pricing")} className="gap-2">
                <Crown className="size-4" />
                View Plans
              </Button>
            )}

            {subscription?.subscriptionStatus === "active" ||
            subscription?.subscriptionStatus === "trialing" ? (
              <Button
                variant="ghost"
                onClick={() => setShowCancelDialog(true)}
                className="text-stone-500 hover:text-red-600"
              >
                Cancel Subscription
              </Button>
            ) : null}
          </div>
        </div>

        {/* Profile Section */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100">
              <User className="size-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-stone-900">Profile</h2>
              <p className="text-sm text-stone-500">Your personal information</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Email (read-only) */}
            <div>
              <Label className="text-sm font-medium text-stone-700">
                <Mail className="mr-1.5 inline size-4" />
                Email Address
              </Label>
              <Input
                value={profile?.email || ""}
                disabled
                className="mt-1.5 bg-stone-50 text-stone-500"
              />
              <p className="mt-1 text-xs text-stone-400">Contact support to change your email</p>
            </div>

            {/* Display Name */}
            <div>
              <Label htmlFor="displayName" className="text-sm font-medium text-stone-700">
                <User className="mr-1.5 inline size-4" />
                Display Name
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="mt-1.5"
              />
            </div>

            {/* Company Name */}
            <div>
              <Label htmlFor="companyName" className="text-sm font-medium text-stone-700">
                <Building2 className="mr-1.5 inline size-4" />
                Company Name
              </Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your company"
                className="mt-1.5"
              />
            </div>

            {/* Industry */}
            <div>
              <Label htmlFor="industry" className="text-sm font-medium text-stone-700">
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

            {/* Business Goals */}
            <div>
              <Label htmlFor="businessGoals" className="text-sm font-medium text-stone-700">
                <Target className="mr-1.5 inline size-4" />
                Business Goals
              </Label>
              <Textarea
                id="businessGoals"
                value={businessGoals}
                onChange={(e) => setBusinessGoals(e.target.value)}
                placeholder="What are you trying to achieve with Boss Brainz?"
                className="mt-1.5 min-h-[100px]"
              />
              <p className="mt-1 text-xs text-stone-400">
                This helps Alexandria and Kim personalize their advice
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="size-5 text-amber-500" />
              Cancel Subscription?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-stone-600">
              Are you sure you want to cancel your subscription? You'll continue to have access until
              the end of your current billing period.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-lg">
              <X className="mr-1.5 size-4" />
              Keep Subscription
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              disabled={cancelling}
              className="rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              {cancelling ? (
                <Loader2 className="mr-1.5 size-4 animate-spin" />
              ) : (
                <Check className="mr-1.5 size-4" />
              )}
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
