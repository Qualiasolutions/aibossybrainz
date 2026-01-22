"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Building2, Loader2, Sparkles, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useCsrf } from "@/hooks/use-csrf";
import { toast } from "@/components/toast";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const industries = [
  "Technology / SaaS",
  "E-commerce / Retail",
  "Professional Services",
  "Healthcare",
  "Finance / Fintech",
  "Real Estate",
  "Education",
  "Marketing / Advertising",
  "Manufacturing",
  "Other",
];

interface UserProfile {
  displayName: string | null;
  companyName: string | null;
  industry: string | null;
  onboardedAt: string | null;
}

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const { csrfFetch, isLoading: csrfLoading } = useCsrf();

  // Check if user needs onboarding - only show if never onboarded before
  useEffect(() => {
    async function checkProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const profile: UserProfile = await res.json();
          // Only show modal if user has NEVER been onboarded
          // Using onboardedAt timestamp ensures it shows once per user account
          if (!profile.onboardedAt) {
            setIsOpen(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    // Wait for CSRF token if still loading
    if (csrfLoading) {
      toast({ type: "error", description: "Please wait a moment and try again." });
      return;
    }

    setIsSaving(true);
    try {
      const res = await csrfFetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          companyName: companyName.trim() || null,
          industry: industry || null,
        }),
      });

      if (res.ok) {
        setShowSuccess(true);
        toast({ type: "success", description: `Welcome, ${displayName.trim()}!` });
        setTimeout(() => {
          setIsOpen(false);
        }, 1500);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Failed to save profile:", errorData);
        toast({ type: "error", description: "Failed to save your profile. Please try again." });
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast({ type: "error", description: "Something went wrong. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  // Don't render anything while checking profile
  if (isLoading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-md border-white/10 bg-background/95 backdrop-blur-xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-8"
            >
              <motion.div
                className="flex size-16 items-center justify-center rounded-full bg-emerald-500/20"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
              >
                <Sparkles className="size-8 text-emerald-400" />
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-semibold text-lg text-foreground">
                  Welcome, {displayName}!
                </h3>
                <p className="mt-1 text-muted-foreground text-sm">
                  Your AI advisors now know how to address you.
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/20">
                    <User className="size-5 text-red-400" />
                  </div>
                  <div>
                    <span className="text-lg">
                      Let&apos;s personalize your experience
                    </span>
                  </div>
                </DialogTitle>
                <DialogDescription className="pt-2">
                  Tell us a bit about yourself so our AI executives can better
                  serve you.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {/* Name - Required */}
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-sm font-medium">
                    Your Name <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="displayName"
                      placeholder="How should we address you?"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="pl-10"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                {/* Company Name - Optional */}
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm font-medium">
                    Company Name{" "}
                    <span className="text-muted-foreground text-xs">
                      (optional)
                    </span>
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="companyName"
                      placeholder="Your company or business name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Industry - Optional */}
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-sm font-medium">
                    Industry{" "}
                    <span className="text-muted-foreground text-xs">
                      (optional)
                    </span>
                  </Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger id="industry">
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

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600"
                  disabled={!displayName.trim() || isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Get Started"
                  )}
                </Button>

                <p className="text-center text-muted-foreground text-xs">
                  This helps our AI advisors provide personalized
                  recommendations.
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
