"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

const WELCOME_SEEN_KEY = "boss-brainz-welcome-seen";

interface WelcomeModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

const steps = [
  {
    title: "Welcome to Boss Brainz",
    description:
      "Your AI executive team is ready. Let's get you set up for success.",
    content: (
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-8">
          {[
            { name: "Alexandria", role: "CMO" },
            { name: "Kim", role: "CSO" },
          ].map((exec, i) => (
            <motion.div
              key={exec.name}
              className="text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
            >
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                <span className="font-semibold text-neutral-900 text-xl">
                  {exec.name[0]}
                </span>
              </div>
              <p className="font-medium text-neutral-900 text-sm">
                {exec.name}
              </p>
              <p className="text-neutral-500 text-xs">{exec.role}</p>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-neutral-500 text-sm">
          Brand strategy meets sales execution.
        </p>
      </div>
    ),
  },
  {
    title: "Choose Your Executive",
    description:
      "Work with one expert or get collaborative insights from both.",
    content: (
      <div className="grid grid-cols-3 gap-3">
        {[
          { name: "Alexandria", role: "Marketing", letter: "A" },
          { name: "Kim", role: "Sales", letter: "K" },
          { name: "Both", role: "Combined", letter: "+" },
        ].map((exec, i) => (
          <motion.div
            key={exec.name}
            className="group cursor-pointer rounded-xl border border-neutral-200 bg-white p-4 text-center transition-all hover:border-neutral-300 hover:shadow-sm"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 transition-colors group-hover:bg-neutral-200">
              <span className="font-semibold text-neutral-700">
                {exec.letter}
              </span>
            </div>
            <p className="font-medium text-neutral-900 text-sm">{exec.name}</p>
            <p className="text-neutral-500 text-xs">{exec.role}</p>
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    title: "Better Prompts, Better Results",
    description:
      "The more context you provide, the more targeted the strategy.",
    content: (
      <div className="space-y-4">
        <motion.div
          className="rounded-xl border border-neutral-200 bg-neutral-50 p-4"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <p className="mb-1.5 font-medium text-neutral-400 text-[11px] uppercase tracking-wide">
            Generic
          </p>
          <p className="text-neutral-600 text-sm">
            "How do I grow my business?"
          </p>
        </motion.div>
        <motion.div
          className="rounded-xl border border-neutral-900 bg-white p-4"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="mb-1.5 font-medium text-neutral-900 text-[11px] uppercase tracking-wide">
            Specific
          </p>
          <p className="text-neutral-700 text-sm leading-relaxed">
            "I run a B2B SaaS with 500 users targeting small businesses. How do
            I reach 2,000 users in 6 months?"
          </p>
        </motion.div>
      </div>
    ),
  },
  {
    title: "Take Action",
    description:
      "Strategy without execution is just planning. Pick one thing and implement it.",
    content: (
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Voice Input", desc: "Speak your questions" },
          { label: "Audio Responses", desc: "Listen at 1x-3x speed" },
        ].map((feature, i) => (
          <motion.div
            key={feature.label}
            className="rounded-xl border border-neutral-200 bg-white p-4 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
              <div className="h-2 w-2 rounded-full bg-neutral-400" />
            </div>
            <p className="font-medium text-neutral-900 text-sm">
              {feature.label}
            </p>
            <p className="mt-0.5 text-neutral-500 text-xs">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    ),
  },
];

export function WelcomeModal({ forceOpen, onClose }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    const hasSeenWelcome = localStorage.getItem(WELCOME_SEEN_KEY);
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  const handleClose = () => {
    localStorage.setItem(WELCOME_SEEN_KEY, "true");
    setIsOpen(false);
    onClose?.();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md border-neutral-200 bg-white p-0 shadow-lg">
        <div className="relative">
          {/* Header */}
          <DialogHeader className="border-neutral-100 border-b px-6 pt-6 pb-4">
            <div className="space-y-1">
              <p className="font-medium text-neutral-400 text-xs uppercase tracking-wide">
                Step {currentStep + 1} of {steps.length}
              </p>
              <DialogTitle className="font-semibold text-neutral-900 text-xl tracking-tight">
                {currentStepData.title}
              </DialogTitle>
              <p className="text-neutral-500 text-sm">
                {currentStepData.description}
              </p>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {currentStepData.content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-neutral-100 border-t px-6 py-4">
            {/* Step indicators */}
            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <button
                  type="button"
                  key={`step-${index}`}
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

            {/* Navigation */}
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
      </DialogContent>
    </Dialog>
  );
}
