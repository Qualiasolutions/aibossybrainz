"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const TUTORIAL_COMPLETED_KEY = "alecci_tutorial_completed";

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  position: "center" | "top-left" | "top-right" | "bottom-center";
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Welcome",
    description:
      "Your AI executive team is ready. Alexandria handles brand strategy, Kim drives sales growth. Let's show you around.",
    position: "center",
  },
  {
    id: 2,
    title: "Navigation",
    description:
      "Open the sidebar to access chat history, analytics, and your strategy canvas.",
    position: "top-left",
  },
  {
    id: 3,
    title: "Choose Your Executive",
    description:
      "Select Alexandria for marketing, Kim for sales, or both for collaborative strategy.",
    position: "top-left",
  },
  {
    id: 4,
    title: "Quick Actions",
    description:
      "Start new conversations anytime. Use voice for real-time discussions.",
    position: "top-right",
  },
  {
    id: 5,
    title: "Smart Input",
    description:
      "Attach files, use voice, or type. Your executives understand context from your conversation.",
    position: "bottom-center",
  },
  {
    id: 6,
    title: "You're Ready",
    description:
      "Ask about brand positioning, sales pipeline, or any strategic challenge. Available 24/7.",
    position: "center",
  },
];

export function WelcomeTutorial() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    async function checkTutorialStatus() {
      const tutorialCompleted = localStorage.getItem(TUTORIAL_COMPLETED_KEY);
      if (tutorialCompleted) {
        return;
      }

      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const profile = await res.json();
          if (profile.onboardedAt) {
            localStorage.setItem(TUTORIAL_COMPLETED_KEY, profile.onboardedAt);
            return;
          }
        }

        const tosRes = await fetch("/api/accept-tos");
        if (tosRes.ok) {
          const tosData = await tosRes.json();
          if (tosData.accepted) {
            const timer = setTimeout(() => {
              setIsOpen(true);
            }, 500);
            return () => clearTimeout(timer);
          }
        }
      } catch (error) {
        console.error("Failed to check tutorial status:", error);
      }
    }

    checkTutorialStatus();
  }, []);

  const handleComplete = useCallback(() => {
    localStorage.setItem(TUTORIAL_COMPLETED_KEY, new Date().toISOString());
    setIsOpen(false);
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  }, [currentStep, handleComplete]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  const handleStepClick = useCallback((index: number) => {
    setCurrentStep(index);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowRight":
        case "Enter":
          handleNext();
          break;
        case "ArrowLeft":
          handlePrevious();
          break;
        case "Escape":
          handleSkip();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrevious, handleSkip]);

  if (!mounted || !isOpen) return null;

  const step = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
        >
          {/* Backdrop - clean white */}
          <div className="absolute inset-0 bg-white" />

          {/* Tutorial Card */}
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-10 mx-6 w-full max-w-sm"
          >
            {/* Card */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_8px_40px_-12px_rgba(0,0,0,0.12)]">
              {/* Progress bar */}
              <div className="h-0.5 bg-neutral-100">
                <motion.div
                  className="h-full bg-neutral-900"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Step indicator */}
                <p className="mb-4 font-medium text-neutral-400 text-xs tracking-wide uppercase">
                  {currentStep + 1} / {tutorialSteps.length}
                </p>

                {/* Title */}
                <motion.h2
                  key={`title-${step.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="mb-3 font-semibold text-2xl text-neutral-900 tracking-tight"
                >
                  {step.title}
                </motion.h2>

                {/* Description */}
                <motion.p
                  key={`desc-${step.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-base leading-relaxed text-neutral-500"
                >
                  {step.description}
                </motion.p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-neutral-100 border-t px-6 py-4">
                {/* Step dots */}
                <div className="flex items-center gap-2">
                  {tutorialSteps.map((_, index) => (
                    <button
                      type="button"
                      key={`dot-${index}`}
                      onClick={() => handleStepClick(index)}
                      className={`
                        h-2 rounded-full transition-all duration-300 cursor-pointer
                        ${
                          index === currentStep
                            ? "w-6 bg-neutral-900"
                            : index < currentStep
                              ? "w-2 bg-neutral-400 hover:bg-neutral-500"
                              : "w-2 bg-neutral-200 hover:bg-neutral-300"
                        }
                      `}
                      aria-label={`Go to step ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Navigation buttons */}
                <div className="flex items-center gap-2">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handlePrevious}
                      className="h-9 px-4 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                    >
                      Back
                    </Button>
                  )}

                  {currentStep === 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleSkip}
                      className="h-9 px-4 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                    >
                      Skip
                    </Button>
                  )}

                  <Button
                    type="button"
                    size="sm"
                    onClick={handleNext}
                    className="h-9 bg-neutral-900 px-5 font-medium text-white hover:bg-neutral-800"
                  >
                    {isLastStep ? "Get Started" : "Continue"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Keyboard hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-center text-neutral-400 text-xs"
            >
              Arrow keys to navigate · Esc to skip
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook to check if tutorial was completed
export function useTutorialCompleted() {
  const [completed, setCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    const value = localStorage.getItem(TUTORIAL_COMPLETED_KEY);
    setCompleted(!!value);
  }, []);

  return completed;
}

// Function to reset tutorial (for testing or re-showing)
export function resetTutorial() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TUTORIAL_COMPLETED_KEY);
  }
}
