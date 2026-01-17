"use client";

import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Gift,
  MessageSquare,
  Phone,
  Sparkles,
  Star,
  Target,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingFeature {
  text: string;
  value: string;
  icon: typeof Phone;
  highlight?: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  popular: boolean;
  totalValue: string;
  savings?: string;
  features: PricingFeature[];
  cta: string;
  ctaLink: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: "monthly",
    name: "Most Flexible",
    price: 297,
    period: "Monthly",
    description: "6 Month Membership",
    popular: false,
    totalValue: "$3,600+",
    features: [
      {
        text: "6 Strategy Sales & Marketing Calls",
        value: "$3,000",
        icon: Phone,
      },
      {
        text: "Sales and Marketing Message Makeover",
        value: "$50",
        icon: MessageSquare,
      },
      {
        text: "The Sales & Marketing Checkup",
        value: "$27",
        icon: Target,
      },
      {
        text: "Bonus Call in December",
        value: "$500",
        icon: Gift,
      },
      {
        text: "24/7 Access",
        value: "Priceless",
        icon: Clock,
      },
      {
        text: "Prompt Guide",
        value: "$33",
        icon: Zap,
      },
    ],
    cta: "Get Started",
    ctaLink: "/login",
  },
  {
    id: "annual",
    name: "Best Value",
    price: 1500,
    period: "One-Time",
    description: "6 Month Membership Paid in Full",
    popular: true,
    totalValue: "$4,100+",
    savings: "SAVE: $282 + GET 1 PRIVATE STRATEGY CALL",
    features: [
      {
        text: "Everything in Monthly Subscription",
        value: "Included",
        icon: Check,
      },
      {
        text: "1 Private Strategy Call",
        value: "$500",
        icon: Users,
        highlight: true,
      },
      {
        text: "Save $282 on Total Cost",
        value: "Savings",
        icon: Star,
        highlight: true,
      },
      {
        text: "Priority Support",
        value: "Included",
        icon: Zap,
      },
    ],
    cta: "Get Best Value",
    ctaLink: "/login",
  },
];

function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={cn(
        "relative flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-all hover:shadow-xl",
        plan.popular
          ? "border-red-300 shadow-lg shadow-red-500/10"
          : "border-stone-200",
      )}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -right-12 top-8 rotate-45 bg-gradient-to-r from-red-600 to-rose-600 px-12 py-1.5 text-center text-xs font-bold text-white shadow-lg">
          BEST VALUE
        </div>
      )}

      {/* Header */}
      <div
        className={cn(
          "p-6 sm:p-8",
          plan.popular
            ? "bg-gradient-to-br from-red-50 to-rose-50"
            : "bg-stone-50/50",
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-xl",
              plan.popular
                ? "bg-gradient-to-br from-red-500 to-rose-600 text-white"
                : "bg-stone-100 text-stone-600",
            )}
          >
            {plan.popular ? (
              <Star className="size-5" />
            ) : (
              <Calendar className="size-5" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-xl text-stone-900">{plan.name}</h3>
            <p className="text-sm text-stone-500">{plan.description}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-5xl tracking-tight text-stone-900">
              ${plan.price.toLocaleString()}
            </span>
            <span className="text-lg text-stone-500">{plan.period}</span>
          </div>
          {plan.savings && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-1.5 text-sm font-semibold text-green-700"
            >
              <Gift className="size-4" />
              {plan.savings}
            </motion.div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex-1 space-y-4">
          {plan.features.map((feature, i) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.05 }}
              className={cn(
                "flex items-start gap-3 rounded-xl p-3 transition-colors",
                feature.highlight
                  ? "bg-gradient-to-r from-red-50 to-rose-50"
                  : "hover:bg-stone-50",
              )}
            >
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg",
                  feature.highlight
                    ? "bg-gradient-to-br from-red-500 to-rose-600 text-white"
                    : "bg-stone-100 text-stone-600",
                )}
              >
                <feature.icon className="size-4" />
              </div>
              <div className="flex-1">
                <p
                  className={cn(
                    "font-medium text-sm",
                    feature.highlight ? "text-stone-900" : "text-stone-700",
                  )}
                >
                  {feature.text}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-xs",
                    feature.highlight
                      ? "text-red-600 font-semibold"
                      : "text-stone-500",
                  )}
                >
                  VALUED at {feature.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total Value */}
        <div className="mt-6 rounded-xl border border-dashed border-stone-300 bg-stone-50/50 p-4 text-center">
          <p className="text-sm text-stone-500">Total Value</p>
          <p className="font-bold text-2xl text-stone-900">{plan.totalValue}</p>
        </div>

        {/* CTA */}
        <Link href={plan.ctaLink} className="mt-6 block">
          <Button
            size="lg"
            className={cn(
              "w-full gap-2 text-base",
              plan.popular
                ? "shadow-xl shadow-red-500/20"
                : "bg-stone-900 hover:bg-stone-800",
            )}
            variant={plan.popular ? "default" : "premium"}
          >
            {plan.cta}
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const faqs = [
    {
      question: "What's included in the Strategy Calls?",
      answer:
        "Each 45-minute call covers personalized marketing and sales strategy tailored to your business. You'll get actionable frameworks, templates, and expert guidance from our AI executives.",
    },
    {
      question: "Can I cancel my subscription?",
      answer:
        "The 6-month membership is a commitment to your business growth. However, if you're not satisfied within the first 30 days, we offer a full refund, no questions asked.",
    },
    {
      question: "What is 24/7 Access?",
      answer:
        "You get unlimited access to our AI executive platform anytime, anywhere. Chat with Alexandria (CMO) or Kim (CSO) whenever you need strategic guidance - day or night.",
    },
    {
      question: "What's the Sales & Marketing Checkup?",
      answer:
        "A comprehensive audit of your current sales and marketing operations. We analyze your pipeline, messaging, campaigns, and provide a prioritized action plan.",
    },
    {
      question: "Why should I pay in full?",
      answer:
        "The Best Value plan saves you $282 AND includes a bonus private strategy call worth $500. It's the smartest investment for serious business growth.",
    },
  ];

  return (
    <section ref={ref} className="py-20 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-bold text-3xl tracking-tight text-stone-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-stone-600">
            Everything you need to know about our membership plans.
          </p>
        </motion.div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <motion.details
              key={faq.question}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group rounded-xl border border-stone-200 bg-white shadow-sm transition-all hover:shadow-md [&[open]]:shadow-md"
            >
              <summary className="flex cursor-pointer items-center justify-between p-5 font-medium text-stone-900 sm:p-6">
                <span>{faq.question}</span>
                <span className="ml-4 flex size-8 shrink-0 items-center justify-center rounded-full border border-stone-200 text-stone-400 transition-all group-open:rotate-45 group-open:border-red-200 group-open:bg-red-50 group-open:text-red-600">
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
                      d="M12 6v12M6 12h12"
                    />
                  </svg>
                </span>
              </summary>
              <div className="border-t border-stone-100 px-5 pb-5 pt-4 text-stone-600 sm:px-6 sm:pb-6">
                {faq.answer}
              </div>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}

function GuaranteeSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-stone-50/50 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-8 sm:p-12"
        >
          {/* Background Elements */}
          <div className="absolute -left-20 -top-20 size-40 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 size-40 rounded-full bg-rose-500/10 blur-3xl" />

          <div className="relative z-10 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25">
              <Check className="size-8" />
            </div>
            <h3 className="mt-6 font-bold text-2xl text-white sm:text-3xl">
              30-Day Money-Back Guarantee
            </h3>
            <p className="mx-auto mt-4 max-w-lg text-stone-300">
              If you're not completely satisfied with your membership within the
              first 30 days, we'll refund your payment in full. No questions
              asked. We're confident you'll love working with our AI executive
              team.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-red-50/50 via-white to-white" />
          <div className="absolute left-1/2 top-0 -translate-x-1/2">
            <div className="size-[600px] rounded-full bg-gradient-to-br from-red-100/40 via-rose-50/30 to-transparent blur-3xl" />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-1.5 text-sm font-medium text-red-700 shadow-sm">
              <Sparkles className="size-4" />
              Simple, Transparent Pricing
            </span>
            <h1 className="mt-8 font-bold text-4xl tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              Invest in Your{" "}
              <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                Business Growth
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
              Get executive-level marketing and sales strategy at a fraction of
              traditional consulting costs. Choose the plan that works best for
              you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 sm:pb-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={plan.id} plan={plan} index={index} />
            ))}
          </div>
        </div>
      </section>

      <GuaranteeSection />
      <FAQSection />

      {/* Bottom CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-bold text-2xl text-stone-900 sm:text-3xl">
            Still have questions?
          </h2>
          <p className="mt-4 text-stone-600">
            We're here to help. Reach out and we'll get back to you within 24
            hours.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact">
              <Button size="lg" variant="outline" className="gap-2">
                <MessageSquare className="size-4" />
                Contact Us
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" className="gap-2 shadow-lg shadow-red-500/20">
                Start Free Trial
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
