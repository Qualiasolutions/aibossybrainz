import "server-only";
import Stripe from "stripe";

// Lazy initialization to avoid build-time errors
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}

// For backwards compatibility - lazy getter
export const stripe = {
  get customers() {
    return getStripe().customers;
  },
  get checkout() {
    return getStripe().checkout;
  },
  get billingPortal() {
    return getStripe().billingPortal;
  },
  get subscriptions() {
    return getStripe().subscriptions;
  },
  get webhooks() {
    return getStripe().webhooks;
  },
};

// Price IDs from Stripe Dashboard
// These should be created in Stripe Dashboard first
export const STRIPE_PRICES = {
  // Monthly plan: $297/month
  monthly: process.env.STRIPE_PRICE_MONTHLY || "price_monthly_placeholder",
  // Biannual plan: $1,500 one-time for 6 months
  biannual: process.env.STRIPE_PRICE_BIANNUAL || "price_biannual_placeholder",
} as const;

export type StripePlanId = keyof typeof STRIPE_PRICES;

export const PLAN_DETAILS: Record<
  StripePlanId,
  {
    name: string;
    price: number;
    period: string;
    subscriptionType: "monthly" | "biannual";
    durationMonths: number;
  }
> = {
  monthly: {
    name: "Most Flexible",
    price: 297,
    period: "Monthly",
    subscriptionType: "monthly",
    durationMonths: 1,
  },
  biannual: {
    name: "Best Value",
    price: 1500,
    period: "One-Time",
    subscriptionType: "biannual",
    durationMonths: 6,
  },
};
