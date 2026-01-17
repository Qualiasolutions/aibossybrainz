"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  Crown,
  MessageSquare,
  Mic,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

const WELCOME_SEEN_KEY = "boss-brainz-welcome-seen";

// Animated App Demo Component
function AppDemoAnimation() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const phases = [
      { duration: 2000 }, // Initial state
      { duration: 1500 }, // User typing
      { duration: 2000 }, // Message sent
      { duration: 2500 }, // AI responding
      { duration: 3000 }, // Strategy revealed
    ];

    let timeout: NodeJS.Timeout;
    const runPhase = (currentPhase: number) => {
      if (currentPhase >= phases.length) {
        // Reset loop
        setTimeout(() => setPhase(0), 1000);
        return;
      }
      setPhase(currentPhase);
      timeout = setTimeout(
        () => runPhase(currentPhase + 1),
        phases[currentPhase].duration,
      );
    };

    runPhase(0);
    return () => clearTimeout(timeout);
  }, []);

  const userMessage = "How do I scale my coaching business to $50K/month?";
  const aiResponse = "Based on your goals, here's a 3-phase growth strategy...";

  return (
    <div className="relative mx-auto aspect-video w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Ambient glow */}
      <motion.div
        className="absolute -top-20 left-1/2 h-40 w-60 -translate-x-1/2 rounded-full bg-red-500/20 blur-[60px]"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Mock App Interface */}
      <div className="relative flex h-full flex-col p-3">
        {/* Header Bar */}
        <motion.div
          className="mb-2 flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-red-500/20">
              <Brain className="size-3.5 text-red-400" />
            </div>
            <span className="font-semibold text-white/90 text-xs">
              Boss Brainz
            </span>
          </div>
          <div className="flex gap-1">
            {["Alexandria", "Kim"].map((name, i) => (
              <motion.div
                key={name}
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  i === 0
                    ? "bg-rose-500/20 text-rose-300"
                    : "bg-blue-500/20 text-blue-300"
                }`}
                animate={phase >= 3 ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {name}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 space-y-2 overflow-hidden">
          {/* User Message */}
          <AnimatePresence>
            {phase >= 2 && (
              <motion.div
                className="ml-auto max-w-[85%]"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="rounded-2xl rounded-br-md bg-red-500/90 px-3 py-2">
                  <p className="text-white text-[11px] leading-relaxed">
                    {userMessage}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Response */}
          <AnimatePresence>
            {phase >= 3 && (
              <motion.div
                className="mr-auto max-w-[90%]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="flex gap-2">
                  <motion.div
                    className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-600"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 1,
                      repeat: phase === 3 ? Infinity : 0,
                    }}
                  >
                    <Crown className="size-3 text-white" />
                  </motion.div>
                  <div className="space-y-1.5">
                    <div className="rounded-2xl rounded-tl-md bg-white/10 px-3 py-2 backdrop-blur-sm">
                      {phase === 3 ? (
                        <motion.div className="flex items-center gap-1.5">
                          <motion.div
                            className="size-1.5 rounded-full bg-rose-400"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                          />
                          <motion.div
                            className="size-1.5 rounded-full bg-rose-400"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: 0.2,
                            }}
                          />
                          <motion.div
                            className="size-1.5 rounded-full bg-rose-400"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: 0.4,
                            }}
                          />
                        </motion.div>
                      ) : (
                        <p className="text-white/90 text-[11px] leading-relaxed">
                          {aiResponse}
                        </p>
                      )}
                    </div>

                    {/* Strategy Cards */}
                    {phase >= 4 && (
                      <motion.div
                        className="flex gap-1.5"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {[
                          {
                            icon: TrendingUp,
                            label: "Growth",
                            color: "emerald",
                          },
                          { icon: Users, label: "Audience", color: "blue" },
                          { icon: Zap, label: "Launch", color: "amber" },
                        ].map((item, i) => (
                          <motion.div
                            key={item.label}
                            className={`flex items-center gap-1 rounded-lg bg-${item.color}-500/20 px-2 py-1`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + i * 0.15 }}
                          >
                            <item.icon
                              className={`size-2.5 text-${item.color}-400`}
                            />
                            <span
                              className={`text-${item.color}-300 text-[9px] font-medium`}
                            >
                              {item.label}
                            </span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Bar */}
        <motion.div
          className="mt-2 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex-1">
            {phase === 1 ? (
              <motion.div className="flex items-center">
                <motion.span
                  className="text-white/70 text-[11px]"
                  initial={{ width: 0 }}
                  animate={{ width: "auto" }}
                  transition={{ duration: 1.2 }}
                >
                  {userMessage.slice(
                    0,
                    Math.floor((phase === 1 ? 1 : 0) * userMessage.length),
                  )}
                </motion.span>
                <motion.span
                  className="ml-0.5 inline-block h-3 w-0.5 bg-red-400"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </motion.div>
            ) : phase === 0 ? (
              <span className="text-white/30 text-[11px]">
                Ask anything about your business...
              </span>
            ) : (
              <span className="text-white/30 text-[11px]">
                Type your message...
              </span>
            )}
          </div>
          <motion.div
            className={`flex size-6 items-center justify-center rounded-lg transition-colors ${
              phase >= 1 ? "bg-red-500" : "bg-white/10"
            }`}
            whileHover={{ scale: 1.05 }}
            animate={phase === 1 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Send
              className={`size-3 ${phase >= 1 ? "text-white" : "text-white/40"}`}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Feature highlights floating */}
      <AnimatePresence>
        {phase >= 4 && (
          <>
            <motion.div
              className="absolute top-3 right-3 rounded-full bg-emerald-500/20 px-2 py-1 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <span className="font-medium text-emerald-300 text-[9px]">
                24/7 Available
              </span>
            </motion.div>
            <motion.div
              className="absolute bottom-14 right-3 rounded-full bg-purple-500/20 px-2 py-1 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.8, type: "spring" }}
            >
              <span className="font-medium text-purple-300 text-[9px]">
                Expert Strategies
              </span>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

interface WelcomeModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

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

  const steps = [
    {
      title: "Welcome to Boss Brainz",
      description:
        "Your AI-powered sales and marketing executives, available 24/7.",
      icon: Brain,
      content: <AppDemoAnimation />,
    },
    {
      title: "Choose Your Executive",
      description:
        "Toggle between Alexandria (CMO), Kim (CSO), or work with both for a combined strategy.",
      icon: Target,
      content: (
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: "Alexandria", role: "CMO", color: "rose" },
            { name: "Kim", role: "CSO", color: "blue" },
            { name: "Both", role: "Combined", color: "purple" },
          ].map((exec, i) => (
            <motion.div
              key={exec.name}
              className="rounded-xl border border-white/10 bg-white/5 p-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
            >
              <div
                className={`mx-auto mb-2 flex size-10 items-center justify-center rounded-full ${
                  exec.color === "rose"
                    ? "bg-rose-500/20"
                    : exec.color === "blue"
                      ? "bg-blue-500/20"
                      : "bg-purple-500/20"
                }`}
              >
                <Target
                  className={`size-5 ${
                    exec.color === "rose"
                      ? "text-rose-400"
                      : exec.color === "blue"
                        ? "text-blue-400"
                        : "text-purple-400"
                  }`}
                />
              </div>
              <p className="font-semibold text-foreground text-sm">
                {exec.name}
              </p>
              <p className="text-muted-foreground text-xs">{exec.role}</p>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      title: "Be Specific for Better Results",
      description:
        "The more details you share, the more tailored strategies you'll receive.",
      icon: MessageSquare,
      content: (
        <div className="space-y-3">
          <motion.div
            className="rounded-xl border border-white/10 bg-white/5 p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="mb-2 font-medium text-red-400 text-xs uppercase">
              Instead of
            </p>
            <p className="text-muted-foreground text-sm">
              "How do I grow my business?"
            </p>
          </motion.div>
          <motion.div
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <p className="mb-2 font-medium text-emerald-400 text-xs uppercase">
              Try this
            </p>
            <p className="text-foreground text-sm">
              "I run a SaaS company targeting small businesses. We have 500
              users and want to reach 2,000 in 6 months. What marketing
              strategies should I focus on?"
            </p>
          </motion.div>
        </div>
      ),
    },
    {
      title: "Talk or Type",
      description:
        "Use voice input to speak naturally, or type your questions. Listen to responses with adjustable speed.",
      icon: Mic,
      content: (
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            className="rounded-xl border border-white/10 bg-white/5 p-4 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-red-500/20"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Mic className="size-6 text-red-400" />
            </motion.div>
            <p className="font-semibold text-foreground text-sm">Voice Input</p>
            <p className="mt-1 text-muted-foreground text-xs">
              Click the mic to speak
            </p>
          </motion.div>
          <motion.div
            className="rounded-xl border border-white/10 bg-white/5 p-4 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-blue-500/20"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="size-6 text-blue-400" />
            </motion.div>
            <p className="font-semibold text-foreground text-sm">
              Audio Response
            </p>
            <p className="mt-1 text-muted-foreground text-xs">
              1x - 3x speed control
            </p>
          </motion.div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg border-white/10 bg-background/95 p-0 backdrop-blur-xl">
        <div className="relative">
          {/* Header */}
          <DialogHeader className="border-white/5 border-b p-6 pb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="flex size-10 items-center justify-center rounded-xl bg-red-500/20"
                key={currentStep}
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <currentStepData.icon className="size-5 text-red-400" />
              </motion.div>
              <div>
                <DialogTitle className="text-foreground text-lg">
                  {currentStepData.title}
                </DialogTitle>
                <p className="mt-0.5 text-muted-foreground text-sm">
                  {currentStepData.description}
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {currentStepData.content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-white/5 border-t p-4">
            {/* Step indicators */}
            <div className="flex gap-1.5">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentStep
                      ? "w-6 bg-red-500"
                      : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Back
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => setCurrentStep(currentStep + 1)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-600"
                  onClick={handleClose}
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
