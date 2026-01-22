"use client";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Briefcase, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCsrf } from "@/hooks/use-csrf";
import { BOT_PERSONALITIES } from "@/lib/bot-personalities";
import { toast } from "@/components/toast";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

type OnboardingStep = "welcome" | "meet-team" | "profile" | "success";

const alexandria = BOT_PERSONALITIES.alexandria;
const kim = BOT_PERSONALITIES.kim;

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [displayName, setDisplayName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const { csrfFetch, isLoading: csrfLoading } = useCsrf();

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
        setStep("success");
        toast({ type: "success", description: `Welcome aboard, ${displayName.trim()}!` });
        setTimeout(() => {
          setIsOpen(false);
        }, 2500);
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
        className="max-w-lg overflow-hidden border-0 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 p-0 shadow-2xl shadow-rose-500/10"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Animated gradient border */}
        <div className="pointer-events-none absolute inset-0 rounded-lg">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-rose-500/20 via-red-500/20 to-rose-600/20 opacity-50" />
          <div className="absolute inset-[1px] rounded-lg bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950" />
        </div>

        <AnimatePresence mode="wait">
          {step === "welcome" && (
            <WelcomeStep key="welcome" onNext={() => setStep("meet-team")} />
          )}
          {step === "meet-team" && (
            <MeetTeamStep key="meet-team" onNext={() => setStep("profile")} />
          )}
          {step === "profile" && (
            <ProfileStep
              key="profile"
              displayName={displayName}
              setDisplayName={setDisplayName}
              companyName={companyName}
              setCompanyName={setCompanyName}
              industry={industry}
              setIndustry={setIndustry}
              onSubmit={handleSubmit}
              isSaving={isSaving}
            />
          )}
          {step === "success" && (
            <SuccessStep key="success" displayName={displayName} />
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="relative flex flex-col items-center px-8 py-10"
    >
      <VisuallyHidden.Root>
        <DialogTitle>Welcome to AI Boss Brainz</DialogTitle>
        <DialogDescription>Your executive AI consulting team awaits</DialogDescription>
      </VisuallyHidden.Root>

      {/* Logo/Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="relative mb-6"
      >
        <div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 shadow-lg shadow-rose-500/30">
          <Sparkles className="size-10 text-white" />
        </div>
        <div className="absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-br from-rose-500/20 to-red-600/20 blur-xl" />
      </motion.div>

      {/* Welcome text */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-2 bg-gradient-to-r from-white to-stone-300 bg-clip-text text-center font-bold text-2xl text-transparent"
      >
        Welcome to Boss Brainz
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 max-w-sm text-center text-stone-400"
      >
        Your personal executive consulting team is ready to help you grow your business.
      </motion.p>

      {/* Executive preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8 flex items-center justify-center"
      >
        <div className="relative flex -space-x-4">
          {alexandria.avatar && (
            <div className="relative size-16 overflow-hidden rounded-full border-2 border-stone-800 shadow-lg">
              <Image
                src={alexandria.avatar}
                alt={alexandria.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          )}
          {kim.avatar && (
            <div className="relative size-16 overflow-hidden rounded-full border-2 border-stone-800 shadow-lg">
              <Image
                src={kim.avatar}
                alt={kim.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-xs"
      >
        <Button
          onClick={onNext}
          className="group w-full bg-gradient-to-r from-rose-500 to-red-600 font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:from-rose-600 hover:to-red-700 hover:shadow-rose-500/40"
        >
          Meet Your Team
          <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </motion.div>
  );
}

function MeetTeamStep({ onNext }: { onNext: () => void }) {
  const [activeExec, setActiveExec] = useState<"alexandria" | "kim">("alexandria");

  const executives = [
    { key: "alexandria" as const, data: alexandria },
    { key: "kim" as const, data: kim },
  ];

  const currentExec = activeExec === "alexandria" ? alexandria : kim;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="relative flex flex-col px-8 py-8"
    >
      <VisuallyHidden.Root>
        <DialogTitle>Meet Your Executive Team</DialogTitle>
        <DialogDescription>Alexandria and Kim are ready to help</DialogDescription>
      </VisuallyHidden.Root>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center"
      >
        <h2 className="mb-1 font-semibold text-lg text-white">Meet Your Executive Team</h2>
        <p className="text-sm text-stone-400">Two experts, one mission: your success</p>
      </motion.div>

      {/* Executive tabs */}
      <div className="mb-6 flex gap-2">
        {executives.map(({ key, data }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveExec(key)}
            className={`flex flex-1 items-center gap-3 rounded-xl border p-3 transition-all ${
              activeExec === key
                ? "border-rose-500/50 bg-rose-500/10"
                : "border-stone-700 bg-stone-800/50 hover:border-stone-600"
            }`}
          >
            {data.avatar && (
              <div className="relative size-10 overflow-hidden rounded-full">
                <Image
                  src={data.avatar}
                  alt={data.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            )}
            <div className="text-left">
              <p className={`font-medium text-sm ${activeExec === key ? "text-white" : "text-stone-300"}`}>
                {data.name.split(" ")[0]}
              </p>
              <p className="text-stone-500 text-xs">{data.role.split(" ")[0]}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Executive detail card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeExec}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mb-6 overflow-hidden rounded-2xl border border-stone-700/50 bg-gradient-to-br from-stone-800/80 to-stone-900/80 backdrop-blur-sm"
        >
          {/* Executive header */}
          <div className={`bg-gradient-to-r ${currentExec.color} p-4`}>
            <div className="flex items-center gap-4">
              {currentExec.avatar && (
                <div className="relative size-16 overflow-hidden rounded-xl border-2 border-white/20 shadow-lg">
                  <Image
                    src={currentExec.avatar}
                    alt={currentExec.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg text-white">{currentExec.name}</h3>
                <p className="text-white/80 text-sm">{currentExec.role}</p>
              </div>
            </div>
          </div>

          {/* Executive info */}
          <div className="p-4">
            <p className="mb-4 text-sm text-stone-300">{currentExec.personality}</p>
            <div className="flex flex-wrap gap-2">
              {currentExec.expertise.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-stone-700/50 px-3 py-1 text-stone-300 text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <Button
        onClick={onNext}
        className="group w-full bg-gradient-to-r from-rose-500 to-red-600 font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:from-rose-600 hover:to-red-700 hover:shadow-rose-500/40"
      >
        Continue
        <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </motion.div>
  );
}

function ProfileStep({
  displayName,
  setDisplayName,
  companyName,
  setCompanyName,
  industry,
  setIndustry,
  onSubmit,
  isSaving,
}: {
  displayName: string;
  setDisplayName: (value: string) => void;
  companyName: string;
  setCompanyName: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="relative flex flex-col px-8 py-8"
    >
      <VisuallyHidden.Root>
        <DialogTitle>Tell Us About Yourself</DialogTitle>
        <DialogDescription>Help us personalize your experience</DialogDescription>
      </VisuallyHidden.Root>

      {/* Header with icon */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-4"
      >
        <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/20 to-red-600/20">
          <Briefcase className="size-6 text-rose-400" />
        </div>
        <div>
          <h2 className="font-semibold text-lg text-white">Tell us about yourself</h2>
          <p className="text-sm text-stone-400">So we can personalize your experience</p>
        </div>
      </motion.div>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <Label htmlFor="displayName" className="font-medium text-sm text-stone-200">
            Your Name <span className="text-rose-400">*</span>
          </Label>
          <Input
            id="displayName"
            placeholder="How should we address you?"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="h-11 border-stone-700 bg-stone-800/50 text-white placeholder:text-stone-500 focus:border-rose-500 focus:ring-rose-500/20"
            autoFocus
            required
          />
        </motion.div>

        {/* Company */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <Label htmlFor="companyName" className="font-medium text-sm text-stone-200">
            Company Name <span className="text-stone-500 text-xs">(optional)</span>
          </Label>
          <Input
            id="companyName"
            placeholder="Your company or business name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="h-11 border-stone-700 bg-stone-800/50 text-white placeholder:text-stone-500 focus:border-rose-500 focus:ring-rose-500/20"
          />
        </motion.div>

        {/* Industry */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <Label htmlFor="industry" className="font-medium text-sm text-stone-200">
            Industry <span className="text-stone-500 text-xs">(optional)</span>
          </Label>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger
              id="industry"
              className="h-11 border-stone-700 bg-stone-800/50 text-white focus:border-rose-500 focus:ring-rose-500/20 [&>span]:text-stone-500 [&[data-state=open]>span]:text-white [&:has([data-placeholder='false'])>span]:text-white"
            >
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent className="border-stone-700 bg-stone-800">
              {industries.map((ind) => (
                <SelectItem
                  key={ind}
                  value={ind}
                  className="text-stone-200 focus:bg-rose-500/20 focus:text-white"
                >
                  {ind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-2"
        >
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-500 to-red-600 font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:from-rose-600 hover:to-red-700 hover:shadow-rose-500/40 disabled:opacity-50"
            disabled={!displayName.trim() || isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Setting up...
              </>
            ) : (
              "Get Started"
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}

function SuccessStep({ displayName }: { displayName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative flex flex-col items-center px-8 py-12"
    >
      <VisuallyHidden.Root>
        <DialogTitle>Welcome Complete</DialogTitle>
        <DialogDescription>Your executive team is ready</DialogDescription>
      </VisuallyHidden.Root>

      {/* Success animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
        className="relative mb-6"
      >
        <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30">
          <svg
            className="size-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div className="absolute -inset-2 -z-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-600/20 blur-xl" />
      </motion.div>

      {/* Welcome message */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-2 bg-gradient-to-r from-white to-stone-300 bg-clip-text text-center font-bold text-xl text-transparent"
      >
        Welcome, {displayName}!
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6 text-center text-stone-400"
      >
        Your executive advisors are ready to help you succeed.
      </motion.p>

      {/* Executive avatars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-center gap-4"
      >
        {alexandria.avatar && (
          <div className="relative">
            <div className="relative size-14 overflow-hidden rounded-full border-2 border-rose-500/50 shadow-lg">
              <Image
                src={alexandria.avatar}
                alt={alexandria.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500"
            >
              <svg className="size-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
          </div>
        )}
        {kim.avatar && (
          <div className="relative">
            <div className="relative size-14 overflow-hidden rounded-full border-2 border-rose-500/50 shadow-lg">
              <Image
                src={kim.avatar}
                alt={kim.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 }}
              className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500"
            >
              <svg className="size-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
