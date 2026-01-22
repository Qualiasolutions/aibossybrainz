import "server-only";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { getStripe, STRIPE_PRICES, PLAN_DETAILS, type StripePlanId } from "./config";

/**
 * Get or create a Stripe customer for a user
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
): Promise<string> {
  const supabase = createServiceClient();

  // Check if user already has a Stripe customer ID
  const { data: user } = await supabase
    .from("User")
    .select("stripeCustomerId")
    .eq("id", userId)
    .single();

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Create new Stripe customer
  const customer = await getStripe().customers.create({
    email,
    metadata: {
      supabaseUserId: userId,
    },
  });

  // Save customer ID to database
  await supabase
    .from("User")
    .update({ stripeCustomerId: customer.id })
    .eq("id", userId);

  return customer.id;
}

/**
 * Create a Stripe Checkout session for subscription
 */
export async function createCheckoutSession({
  userId,
  email,
  planId,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  email: string;
  planId: StripePlanId;
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  const customerId = await getOrCreateStripeCustomer(userId, email);
  const priceId = STRIPE_PRICES[planId];
  const planDetails = PLAN_DETAILS[planId];

  // Annual and Lifetime are one-time payments, monthly is a subscription
  const isOneTime = planId === "annual" || planId === "lifetime";

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: isOneTime ? "payment" : "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      planId,
      subscriptionType: planDetails.subscriptionType,
    },
  };

  // Add metadata to payment intent or subscription
  if (isOneTime) {
    sessionParams.payment_intent_data = {
      metadata: {
        userId,
        planId,
        subscriptionType: planDetails.subscriptionType,
      },
    };
  } else {
    sessionParams.subscription_data = {
      metadata: {
        userId,
        planId,
        subscriptionType: planDetails.subscriptionType,
      },
    };
  }

  const session = await getStripe().checkout.sessions.create(sessionParams);

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  return session.url;
}

/**
 * Create a Stripe Customer Portal session for managing subscriptions
 */
export async function createPortalSession({
  userId,
  returnUrl,
}: {
  userId: string;
  returnUrl: string;
}): Promise<string> {
  const supabase = createServiceClient();

  const { data: user } = await supabase
    .from("User")
    .select("stripeCustomerId")
    .eq("id", userId)
    .single();

  if (!user?.stripeCustomerId) {
    throw new Error("No Stripe customer found for user");
  }

  const session = await getStripe().billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: returnUrl,
  });

  return session.url;
}

/**
 * Activate subscription after successful payment
 */
export async function activateSubscription({
  userId,
  subscriptionType,
  stripeSubscriptionId,
}: {
  userId: string;
  subscriptionType: "monthly" | "annual" | "lifetime";
  stripeSubscriptionId?: string;
}): Promise<void> {
  const supabase = createServiceClient();

  // Calculate duration: monthly=1, annual=12, lifetime=9999
  const durationMonths = subscriptionType === "monthly" ? 1 : subscriptionType === "annual" ? 12 : 9999;
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + durationMonths);

  await supabase
    .from("User")
    .update({
      subscriptionType,
      subscriptionStatus: "active",
      subscriptionStartDate: new Date().toISOString(),
      subscriptionEndDate: endDate.toISOString(),
      stripeSubscriptionId: stripeSubscriptionId || null,
    })
    .eq("id", userId);
}

/**
 * Cancel subscription (mark as cancelled, will expire at end of period)
 */
export async function cancelSubscription(userId: string): Promise<void> {
  const supabase = createServiceClient();

  const { data: user } = await supabase
    .from("User")
    .select("stripeSubscriptionId")
    .eq("id", userId)
    .single();

  // Cancel in Stripe if there's an active subscription
  if (user?.stripeSubscriptionId) {
    await getStripe().subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
  }

  // Update local status
  await supabase
    .from("User")
    .update({ subscriptionStatus: "cancelled" })
    .eq("id", userId);
}

/**
 * Handle subscription renewal (called by webhook)
 */
export async function renewSubscription({
  stripeSubscriptionId,
  periodEnd,
}: {
  stripeSubscriptionId: string;
  periodEnd: Date;
}): Promise<void> {
  const supabase = createServiceClient();

  await supabase
    .from("User")
    .update({
      subscriptionStatus: "active",
      subscriptionEndDate: periodEnd.toISOString(),
    })
    .eq("stripeSubscriptionId", stripeSubscriptionId);
}

/**
 * Expire subscription (called by webhook when subscription ends)
 */
export async function expireSubscription(stripeSubscriptionId: string): Promise<void> {
  const supabase = createServiceClient();

  await supabase
    .from("User")
    .update({
      subscriptionStatus: "expired",
      stripeSubscriptionId: null,
    })
    .eq("stripeSubscriptionId", stripeSubscriptionId);
}
