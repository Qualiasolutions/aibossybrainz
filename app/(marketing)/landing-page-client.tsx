"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight, Target, TrendingUp, Zap, Mic } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { InteractiveChatDemo } from "@/components/landing/interactive-chat-demo";
import { Button } from "@/components/ui/button";
import { CloudAnimation } from "@/components/ui/cloud-animation";
import type { LandingPageCMSContent } from "@/lib/cms/landing-page-types";
import { getGradientStyle } from "@/lib/cms/landing-page-types";
import { cn } from "@/lib/utils";

interface LandingPageClientProps {
  content: LandingPageCMSContent;
}

// Icon mapping
const IconMap = {
  Zap,
  Mic,
  Target,
  TrendingUp,
} as const;

// Hero Section with Cloud Animation - Split Layout
function HeroSection({ content }: { content: LandingPageCMSContent }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const gradientStyle = getGradientStyle(
    content.theme.primary_gradient_from,
    content.theme.primary_gradient_to
  );

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
              {content.hero.title_main}
              <span
                className="mt-2 block bg-clip-text text-transparent"
                style={{ backgroundImage: gradientStyle }}
              >
                {content.hero.title_highlight}
              </span>
            </h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-stone-600 sm:text-xl"
            >
              {content.hero.subtitle}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Link href={content.hero.cta_primary_link}>
                <Button
                  size="lg"
                  className="group gap-2 px-8 text-base shadow-2xl shadow-red-500/25 transition-all hover:shadow-red-500/40"
                  style={{ background: gradientStyle }}
                >
                  {content.hero.cta_primary_text}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href={content.hero.cta_secondary_link}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-stone-300 bg-white/80 px-8 text-base text-stone-700 hover:border-stone-400 hover:bg-white hover:text-stone-900"
                >
                  {content.hero.cta_secondary_text}
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right - Interactive Chat Demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex items-center justify-center lg:justify-end"
          >
            <div className="w-full max-w-2xl xl:max-w-3xl">
              <InteractiveChatDemo content={content} />
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

// Executive Cards
function ExecutiveCards({ content }: { content: LandingPageCMSContent }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const executives = [
    {
      name: content.executives.alex_name,
      role: content.executives.alex_role,
      image: content.executives.alex_image,
      expertise: content.executives.alex_expertise.split(","),
      color: "from-rose-500 to-red-600",
    },
    {
      name: content.executives.kim_name,
      role: content.executives.kim_role,
      image: content.executives.kim_image,
      expertise: content.executives.kim_expertise.split(","),
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
            {content.executives.section_title}{" "}
            <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              {content.executives.section_title_highlight}
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
            {content.executives.section_subtitle}
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
                        {skill.trim()}
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
function BenefitsGrid({ content }: { content: LandingPageCMSContent }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const benefits = [
    {
      icon: IconMap[content.benefits.benefit_1_icon as keyof typeof IconMap] || Zap,
      title: content.benefits.benefit_1_title,
      desc: content.benefits.benefit_1_desc,
    },
    {
      icon: IconMap[content.benefits.benefit_2_icon as keyof typeof IconMap] || Mic,
      title: content.benefits.benefit_2_title,
      desc: content.benefits.benefit_2_desc,
    },
    {
      icon: IconMap[content.benefits.benefit_3_icon as keyof typeof IconMap] || Target,
      title: content.benefits.benefit_3_title,
      desc: content.benefits.benefit_3_desc,
    },
    {
      icon: IconMap[content.benefits.benefit_4_icon as keyof typeof IconMap] || TrendingUp,
      title: content.benefits.benefit_4_title,
      desc: content.benefits.benefit_4_desc,
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
            {content.benefits.section_title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
            {content.benefits.section_subtitle}
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
function CTASection({ content }: { content: LandingPageCMSContent }) {
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
              {content.cta.title}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-300">
              {content.cta.subtitle}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href={content.cta.cta_primary_link}>
                <Button
                  size="lg"
                  className="group gap-2 bg-white px-8 text-base text-stone-900 shadow-2xl transition-all hover:bg-stone-100"
                >
                  {content.cta.cta_primary_text}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href={content.cta.cta_secondary_link}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 bg-white/5 px-8 text-base text-white hover:bg-white/10"
                >
                  {content.cta.cta_secondary_text}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function LandingPageClient({ content }: LandingPageClientProps) {
  return (
    <>
      <HeroSection content={content} />
      <ExecutiveCards content={content} />
      <BenefitsGrid content={content} />
      <CTASection content={content} />
    </>
  );
}
