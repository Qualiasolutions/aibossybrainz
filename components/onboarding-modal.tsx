"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
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
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
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

  // Check if user needs onboarding
  useEffect(() => {
    async function checkProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const profile: UserProfile = await res.json();
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

  if (isLoading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-sm border-neutral-200 bg-white p-0 shadow-lg"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 p-10"
            >
              <VisuallyHidden.Root>
                <DialogTitle>Welcome Complete</DialogTitle>
                <DialogDescription>Your profile has been set up</DialogDescription>
              </VisuallyHidden.Root>

              <motion.div
                className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
              >
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-semibold text-lg text-neutral-900">
                  Welcome, {displayName}
                </h3>
                <p className="mt-1 text-neutral-500 text-sm">
                  Your AI advisors are ready.
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
              <DialogHeader className="border-neutral-100 border-b px-6 pt-6 pb-4">
                <div className="space-y-1">
                  <DialogTitle className="font-semibold text-lg text-neutral-900 tracking-tight">
                    Let's personalize your experience
                  </DialogTitle>
                  <DialogDescription className="text-neutral-500 text-sm">
                    Tell us about yourself so our executives can better serve you.
                  </DialogDescription>
                </div>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Name - Required */}
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-sm font-medium text-neutral-900">
                    Your Name <span className="text-neutral-400">*</span>
                  </Label>
                  <Input
                    id="displayName"
                    placeholder="How should we address you?"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="h-10 border-neutral-200 bg-white focus:border-neutral-400 focus:ring-neutral-400"
                    autoFocus
                    required
                  />
                </div>

                {/* Company Name - Optional */}
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm font-medium text-neutral-900">
                    Company Name{" "}
                    <span className="text-neutral-400 text-xs font-normal">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="Your company or business name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="h-10 border-neutral-200 bg-white focus:border-neutral-400 focus:ring-neutral-400"
                  />
                </div>

                {/* Industry - Optional */}
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-sm font-medium text-neutral-900">
                    Industry{" "}
                    <span className="text-neutral-400 text-xs font-normal">
                      (optional)
                    </span>
                  </Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger
                      id="industry"
                      className="h-10 border-neutral-200 bg-white focus:border-neutral-400 focus:ring-neutral-400"
                    >
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
                  className="w-full h-10 bg-neutral-900 font-medium text-white hover:bg-neutral-800"
                  disabled={!displayName.trim() || isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Get Started"
                  )}
                </Button>

                <p className="text-center text-neutral-400 text-xs">
                  This helps our AI advisors provide personalized recommendations.
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
