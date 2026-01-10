"use client";

import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  MessageSquare,
  Mic,
  Paperclip,
  Send,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CloudAnimation } from "@/components/ui/cloud-animation";
import { cn } from "@/lib/utils";

// Hero Section with Cloud Animation - Split Layout
function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-white">
      {/* Cloud Animation Background */}
      <div className="absolute inset-0">
        <CloudAnimation
          className="absolute inset-0 h-full w-full"
          particleColor="rgba(231, 229, 228, 0.9)"
          particleCount={200}
        />
      </div>

      {/* Subtle Gradient Overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/80" />

      {/* Accent Glow */}
      <div className="pointer-events-none absolute left-1/4 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-100/40 blur-[150px]" />

      {/* Content - Split Layout */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-4 pt-24 sm:px-6 lg:px-8">
        <div className="grid w-full gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            {/* Main Heading */}
            <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl xl:text-7xl">
              Your Personal
              <span className="mt-2 block bg-gradient-to-r from-red-500 via-rose-500 to-red-600 bg-clip-text text-transparent">
                CMO & CSO Team
              </span>
            </h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-stone-600 sm:text-xl"
            >
              Strategic marketing and sales consulting powered by AI executives.
              Get actionable strategies and expert guidance on demand.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Link href="/login">
                <Button
                  size="lg"
                  className="group gap-2 bg-gradient-to-r from-red-500 to-red-600 px-8 text-base shadow-2xl shadow-red-500/25 transition-all hover:from-red-600 hover:to-red-700 hover:shadow-red-500/40"
                >
                  Start Free Trial
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-stone-300 bg-white/80 px-8 text-base text-stone-700 hover:border-stone-400 hover:bg-white hover:text-stone-900"
                >
                  View Pricing
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right - Chat Demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex items-center justify-center lg:justify-end"
          >
            <div className="w-full max-w-lg">
              <ChatDemo />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-medium uppercase tracking-widest text-stone-400">
            Scroll
          </span>
          <div className="h-8 w-px bg-gradient-to-b from-stone-300 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Compact Chat Demo Component
function ChatDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const conversation = [
    {
      role: "user",
      content: "I need a go-to-market strategy for our SaaS launch.",
    },
    {
      role: "assistant",
      bot: "alexandria",
      content: `Here's your GTM roadmap:

**Pre-Launch** - Build waitlist, create case studies
**Launch Week** - PR push, influencer activation
**Post-Launch** - Nurture leads, gather social proof`,
    },
    {
      role: "user",
      content: "What's the sales approach for first customers?",
    },
    {
      role: "assistant",
      bot: "kim",
      content: `Focus on design partners first:

1. **Offer 3-5 companies** discounted access
2. **Qualify with BANT** - Budget, Authority, Need
3. **Lead demos with value**, not features`,
    },
  ];

  useEffect(() => {
    if (currentStep >= conversation.length * 2) return;

    const timer = setTimeout(
      () => {
        if (currentStep % 2 === 0) {
          setCurrentStep((prev) => prev + 1);
        } else {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setCurrentStep((prev) => prev + 1);
          }, 1200);
        }
      },
      currentStep === 0 ? 800 : 2000
    );

    return () => clearTimeout(timer);
  }, [currentStep, conversation.length]);

  const visibleMessages = conversation.slice(0, Math.floor((currentStep + 1) / 2));

  return (
    <div className="relative w-full">
      {/* Browser Chrome */}
      <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-2xl shadow-stone-900/10">
        {/* Window Controls */}
        <div className="flex items-center gap-2 border-b border-stone-100 bg-stone-50/80 px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="size-2.5 rounded-full bg-red-400" />
            <div className="size-2.5 rounded-full bg-yellow-400" />
            <div className="size-2.5 rounded-full bg-green-400" />
          </div>
          <div className="mx-auto flex items-center gap-2 rounded-md bg-white px-3 py-1 shadow-sm">
            <img
              src="https://images.squarespace-cdn.com/content/v1/5ea759fa9e5575487ad28cd0/1591228238957-80Y8AGN1M9TTXTYNJ5QK/AM_Logo_Horizontal_4C+%281%29.jpg?format=500w"
              alt="AI Boss Brainz"
              className="h-4 w-auto"
            />
            <span className="text-[11px] text-stone-500">bossybrainz.ai</span>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="h-[400px] overflow-hidden bg-gradient-to-b from-stone-50/50 to-white lg:h-[450px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-100 bg-white/80 px-4 py-2.5 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-1.5">
                <div className="relative size-7 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-rose-100 to-rose-200 shadow-sm">
                  <img
                    src="https://i.ibb.co/39XxGyN1/Chat-GPT-Image-Oct-22-2025-04-39-58-AM.png"
                    alt="Alexandria"
                    className="size-full object-cover"
                  />
                </div>
                <div className="relative size-7 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-red-100 to-red-200 shadow-sm">
                  <img
                    src="https://i.ibb.co/m7vk4JF/KIM-3.png"
                    alt="Kim"
                    className="size-full object-cover"
                  />
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-stone-800">
                  Executive Team
                </span>
                <div className="flex items-center gap-1">
                  <span className="size-1.5 animate-pulse rounded-full bg-green-500" />
                  <span className="text-[10px] text-stone-500">Online</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
            >
              <Mic className="size-3.5" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-[calc(100%-100px)] space-y-3 overflow-y-auto p-3">
            {visibleMessages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="mr-2 flex flex-col items-center gap-0.5">
                    <div className="relative size-6 overflow-hidden rounded-full border border-stone-200 shadow-sm">
                      <img
                        src={
                          message.bot === "alexandria"
                            ? "https://i.ibb.co/39XxGyN1/Chat-GPT-Image-Oct-22-2025-04-39-58-AM.png"
                            : "https://i.ibb.co/m7vk4JF/KIM-3.png"
                        }
                        alt={message.bot === "alexandria" ? "Alexandria" : "Kim"}
                        className="size-full object-cover"
                      />
                    </div>
                    <span className="text-[9px] text-stone-400">
                      {message.bot === "alexandria" ? "CMO" : "CSO"}
                    </span>
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl px-3 py-2 text-xs",
                    message.role === "user"
                      ? "bg-stone-800 text-white"
                      : "border border-stone-200 bg-white text-stone-700 shadow-sm"
                  )}
                >
                  {message.role === "assistant" ? (
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                  ) : (
                    <span>{message.content}</span>
                  )}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2"
              >
                <div className="size-6 overflow-hidden rounded-full border border-stone-200 shadow-sm">
                  <img
                    src={
                      visibleMessages.length % 2 === 0
                        ? "https://i.ibb.co/39XxGyN1/Chat-GPT-Image-Oct-22-2025-04-39-58-AM.png"
                        : "https://i.ibb.co/m7vk4JF/KIM-3.png"
                    }
                    alt="Executive"
                    className="size-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-sm">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -3, 0] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.12,
                      }}
                      className="size-1.5 rounded-full bg-red-400"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-stone-100 bg-white/80 p-2.5 backdrop-blur-sm">
            <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-1.5 shadow-sm">
              <Paperclip className="size-3.5 text-stone-400" />
              <Mic className="size-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Message your executive team..."
                className="flex-1 bg-transparent text-xs text-stone-600 placeholder:text-stone-400 focus:outline-none"
                readOnly
              />
              <button
                type="button"
                className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-red-500 to-red-600 text-white shadow-sm"
              >
                <Send className="size-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Executive Cards
function ExecutiveCards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const executives = [
    {
      name: "Alexandria Alecci",
      role: "Chief Marketing Officer",
      image:
        "https://i.ibb.co/39XxGyN1/Chat-GPT-Image-Oct-22-2025-04-39-58-AM.png",
      expertise: ["Brand Strategy", "Go-to-Market", "Digital Campaigns"],
      color: "from-rose-500 to-red-600",
    },
    {
      name: "Kim Mylls",
      role: "Chief Sales Officer",
      image: "https://i.ibb.co/m7vk4JF/KIM-3.png",
      expertise: ["Enterprise Sales", "Pipeline Growth", "Deal Closing"],
      color: "from-red-600 to-red-700",
    },
  ];

  return (
    <section ref={ref} className="bg-stone-50 py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
            Meet Your{" "}
            <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              Executive Team
            </span>
          </h2>
          <p className="mt-4 text-lg text-stone-600">
            35+ years of combined Fortune 500 experience
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2">
          {executives.map((exec, i) => (
            <motion.div
              key={exec.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="group relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-stone-900/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
                <div className="relative mb-4 size-20 shrink-0 overflow-hidden rounded-2xl border-2 border-white shadow-xl sm:mb-0 sm:mr-6">
                  <img
                    src={exec.image}
                    alt={exec.name}
                    className="size-full object-cover"
                  />
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-t opacity-20",
                      exec.color
                    )}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-stone-900">{exec.name}</h3>
                  <p className="mt-1 font-semibold text-red-600">{exec.role}</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                    {exec.expertise.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Benefits Grid
function BenefitsGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const benefits = [
    {
      icon: Zap,
      title: "Instant Advice",
      desc: "Get answers in seconds, not weeks",
    },
    {
      icon: MessageSquare,
      title: "Natural Chat",
      desc: "Voice & text supported",
    },
    {
      icon: Target,
      title: "Actionable Plans",
      desc: "Ready-to-use frameworks",
    },
    {
      icon: TrendingUp,
      title: "Proven Tactics",
      desc: "Real-world experience",
    },
  ];

  return (
    <section ref={ref} className="bg-white py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
            Why Leaders Choose Us
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="group rounded-2xl border border-stone-200 bg-white p-6 transition-all duration-300 hover:border-stone-300 hover:shadow-xl hover:shadow-stone-900/5"
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 transition-transform group-hover:scale-110">
                <b.icon className="size-6" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900">{b.title}</h3>
              <p className="mt-2 text-stone-600">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="bg-stone-50 py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 px-8 py-16 text-center sm:px-16 sm:py-24"
        >
          <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-red-500/20 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-rose-500/20 blur-[100px]" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Ready to Transform Your Strategy?
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-lg text-stone-300">
              Join thousands of leaders getting executive-level guidance at a
              fraction of the cost.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/login">
                <Button
                  size="lg"
                  className="group gap-2 bg-white px-8 text-base text-stone-900 shadow-2xl transition-all hover:bg-stone-100"
                >
                  Start Free Trial
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 bg-white/5 px-8 text-base text-white hover:bg-white/10"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ExecutiveCards />
      <BenefitsGrid />
      <CTASection />
    </>
  );
}
