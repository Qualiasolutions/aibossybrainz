"use client";

import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Mic,
  Paperclip,
  Send,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
              AI Boss Brainz
              <span className="mt-2 block bg-gradient-to-r from-red-500 via-rose-500 to-red-600 bg-clip-text text-transparent">
                Your Sales & Marketing Experts 24/7
              </span>
            </h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-stone-600 sm:text-xl"
            >
              AI-powered. Expert-led. Get high-level sales and marketing
              strategy built to grow your brand, results-obsessed, and ready to
              drop strategies that work.
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
                  Sign In
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
            <div className="w-full max-w-2xl xl:max-w-3xl">
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

// Helper to parse **bold** markdown
function formatBoldText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// Realistic Chat Demo Component - Matches actual app interface
function ChatDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedExec, setSelectedExec] = useState<
    "alexandria" | "kim" | "collaborative"
  >("collaborative");

  const conversation = [
    {
      role: "user",
      content:
        "I need a go-to-market strategy for our SaaS launch next quarter.",
    },
    {
      role: "assistant",
      bot: "alexandria",
      name: "Alexandria Alecci",
      title: "Chief Marketing Officer",
      content: `Here's your GTM roadmap:

**Phase 1: Pre-Launch (Weeks 1-4)**
• Build email waitlist with lead magnet
• Create 3 customer case studies
• Prep launch content calendar

**Phase 2: Launch Week**
• PR push to industry publications
• Influencer activation campaign
• Launch day email sequence

**Phase 3: Post-Launch**
• Nurture MQLs with drip campaign
• Gather social proof and testimonials`,
    },
    {
      role: "user",
      content:
        "What's the best sales approach for landing our first 10 customers?",
    },
    {
      role: "assistant",
      bot: "kim",
      name: "Kim Mylls",
      title: "Chief Sales Officer",
      content: `Smart move focusing on early wins. Here's my playbook:

**Design Partner Strategy:**
1. Target 3-5 companies for discounted beta access
2. Qualify with BANT framework
3. Lead demos with value, not features

**Closing Framework:**
• Create urgency with limited beta spots
• Offer implementation support
• Build case studies from each win`,
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
          }, 1500);
        }
      },
      currentStep === 0 ? 1000 : 2500,
    );

    return () => clearTimeout(timer);
  }, [currentStep]);

  const visibleMessages = conversation.slice(
    0,
    Math.floor((currentStep + 1) / 2),
  );

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
            <Image
              src="https://images.squarespace-cdn.com/content/v1/5ea759fa9e5575487ad28cd0/1591228238957-80Y8AGN1M9TTXTYNJ5QK/AM_Logo_Horizontal_4C+%281%29.jpg?format=500w"
              alt="AI Boss Brainz"
              className="h-4 w-auto"
              width={80}
              height={16}
            />
            <span className="text-[11px] text-stone-500">
              app.bossybrainz.ai
            </span>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="h-[420px] overflow-hidden bg-gradient-to-b from-stone-50/30 to-white sm:h-[440px]">
          {/* Header - Matches actual app header */}
          <div className="flex items-center justify-between border-b border-stone-100 bg-white/95 px-4 py-3 backdrop-blur-xl">
            {/* Left - Menu + New Chat */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 shadow-sm"
              >
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="flex h-8 items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-2.5 text-xs font-medium text-stone-600 shadow-sm"
              >
                <svg
                  className="size-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="hidden sm:inline">New</span>
              </button>
            </div>

            {/* Center - Executive Selector */}
            <div className="flex items-center gap-1 rounded-full bg-stone-100 p-1">
              {[
                {
                  id: "alexandria",
                  img: "https://i.ibb.co/39XxGyN1/Chat-GPT-Image-Oct-22-2025-04-39-58-AM.png",
                },
                { id: "kim", img: "https://i.ibb.co/m7vk4JF/KIM-3.png" },
                { id: "collaborative", icon: true },
              ].map((exec) => (
                <button
                  key={exec.id}
                  type="button"
                  onClick={() =>
                    setSelectedExec(exec.id as typeof selectedExec)
                  }
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full transition-all",
                    selectedExec === exec.id
                      ? "bg-white shadow-sm ring-1 ring-stone-200"
                      : "hover:bg-stone-200/50",
                  )}
                >
                  {exec.icon ? (
                    <div className="flex -space-x-1">
                      <Image
                        src="https://i.ibb.co/39XxGyN1/Chat-GPT-Image-Oct-22-2025-04-39-58-AM.png"
                        className="size-4 rounded-full border border-white"
                        alt=""
                        width={16}
                        height={16}
                      />
                      <Image
                        src="https://i.ibb.co/m7vk4JF/KIM-3.png"
                        className="size-4 rounded-full border border-white"
                        alt=""
                        width={16}
                        height={16}
                      />
                    </div>
                  ) : (
                    <Image
                      src={exec.img as string}
                      className="size-6 rounded-full"
                      alt=""
                      width={24}
                      height={24}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Right - SWOT + Menu */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="flex h-8 items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-2.5 text-xs font-medium text-stone-500 shadow-sm"
              >
                <svg
                  className="size-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                <span className="hidden sm:inline">SWOT</span>
              </button>
              <button
                type="button"
                className="flex h-8 items-center gap-1 rounded-lg border border-stone-200 bg-white px-2 text-stone-500 shadow-sm"
              >
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area - Matches actual app styling */}
          <div className="h-[calc(100%-140px)] space-y-4 overflow-y-auto p-4">
            {visibleMessages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "flex w-full",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {message.role === "assistant" ? (
                  // Executive message - matches EnhancedChatMessage styling
                  <div className="max-w-[90%] sm:max-w-[85%]">
                    <div className="relative flex flex-col gap-2 rounded-2xl border border-stone-200 bg-gradient-to-br from-white to-stone-50/50 px-4 py-3 shadow-sm">
                      {/* Accent line */}
                      <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-gradient-to-b from-rose-400 to-rose-600" />

                      {/* Header */}
                      <div className="flex items-center gap-2.5 pl-3">
                        <div className="relative">
                          <Image
                            src={
                              message.bot === "alexandria"
                                ? "https://i.ibb.co/39XxGyN1/Chat-GPT-Image-Oct-22-2025-04-39-58-AM.png"
                                : "https://i.ibb.co/m7vk4JF/KIM-3.png"
                            }
                            alt=""
                            className="size-8 rounded-full border-2 border-rose-100 shadow-sm"
                            width={32}
                            height={32}
                          />
                          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white bg-green-500" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-stone-800">
                            {message.name}
                          </div>
                          <div className="text-[11px] text-stone-500">
                            {message.title}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="pl-3 text-xs leading-relaxed text-stone-700">
                        {message.content.split("\n").map((line, i) => (
                          <span key={i}>
                            {formatBoldText(line)}
                            {i < message.content.split("\n").length - 1 && (
                              <br />
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // User message
                  <div className="max-w-[85%] rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm text-stone-800 shadow-sm sm:max-w-[70%]">
                    {message.content}
                  </div>
                )}
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[85%]">
                  <div className="relative flex flex-col gap-2 rounded-2xl border border-stone-200 bg-gradient-to-br from-white to-stone-50/50 px-4 py-3 shadow-sm">
                    <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-gradient-to-b from-rose-400 to-rose-600" />
                    <div className="flex items-center gap-2.5 pl-3">
                      <Image
                        src={
                          visibleMessages.length === 1
                            ? "https://i.ibb.co/m7vk4JF/KIM-3.png"
                            : "https://i.ibb.co/39XxGyN1/Chat-GPT-Image-Oct-22-2025-04-39-58-AM.png"
                        }
                        alt=""
                        className="size-8 rounded-full border-2 border-rose-100 shadow-sm"
                        width={32}
                        height={32}
                      />
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              animate={{ y: [0, -4, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.15,
                              }}
                              className="size-1.5 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 shadow-sm"
                            />
                          ))}
                        </div>
                        <span className="animate-pulse text-xs text-stone-500">
                          Crafting response...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area - Matches actual app */}
          <div className="border-t border-stone-100 bg-white/80 px-4 pb-4 pt-3 backdrop-blur-xl">
            {/* Focus Mode Chips */}
            <div className="mb-2 flex gap-1.5 overflow-x-auto">
              {[
                "Default",
                "Brand Crisis",
                "Pipeline Audit",
                "Deal Closing",
              ].map((mode, i) => (
                <span
                  key={mode}
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium transition-all",
                    i === 0
                      ? "bg-red-100 text-red-700"
                      : "bg-stone-100 text-stone-500 hover:bg-stone-200",
                  )}
                >
                  {mode}
                </span>
              ))}
            </div>

            {/* Input field */}
            <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-sm transition-all focus-within:border-red-300 focus-within:ring-2 focus-within:ring-red-100">
              <button
                type="button"
                className="text-stone-400 transition-colors hover:text-stone-600"
              >
                <Paperclip className="size-4" />
              </button>
              <button
                type="button"
                className="text-stone-400 transition-colors hover:text-stone-600"
              >
                <Mic className="size-4" />
              </button>
              <input
                type="text"
                placeholder="Message your executive team..."
                className="flex-1 bg-transparent text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none"
                readOnly
              />
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white shadow-sm transition-all hover:from-red-600 hover:to-red-700"
              >
                <Send className="size-4" />
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
              Sales and Marketing Masterminds
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
            40+ years bringing Fortune 500 strategy to founders to the next
            level. Now laser-focused on scaling your brand with strategy that
            actually sells.
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
                  <Image
                    src={exec.image}
                    alt={exec.name}
                    width={80}
                    height={80}
                    className="size-full object-cover"
                  />
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-t opacity-20",
                      exec.color,
                    )}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-stone-900">
                    {exec.name}
                  </h3>
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
      title: "Rapid-Fire Strategy",
      desc: "At your fingertips so you never stall on sales or marketing again",
    },
    {
      icon: Mic,
      title: "Talk It Out or Type It In",
      desc: "'Live' call feature - hear our voices in real-time. Feel like you're talking to Alexandria and Kim.",
    },
    {
      icon: Target,
      title: "Plug-and-Play Plans",
      desc: "Sales and marketing plans built to convert, no generic BS",
    },
    {
      icon: TrendingUp,
      title: "40+ Years of Proof",
      desc: "Fortune 500 and founder success - proven strategies from hundreds of brands and teams",
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
            Get the Move-the-Needle Strategies Now
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
            Watch your business grow with expert guidance on demand
          </p>
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
              <h3 className="text-lg font-semibold text-stone-900">
                {b.title}
              </h3>
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
              This Is How You Grow Without Being Great at Sales or Marketing
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-300">
              You don't need to be a sales expert or marketing genius to grow -
              you just need the right messaging and strategy. Thousands of
              entrepreneurs are using our proven tools to scale. Stop
              second-guessing every move. Start dominating.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/login">
                <Button
                  size="lg"
                  className="group gap-2 bg-white px-8 text-base text-stone-900 shadow-2xl transition-all hover:bg-stone-100"
                >
                  Sign In
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
