import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getUserFullProfile } from "@/lib/db/queries";
import { sendTrialStartedEmail } from "@/lib/email/subscription-emails";
import {
  activateSubscription,
  expireSubscription,
  renewSubscription,
  startTrial,
} from "@/lib/stripe/actions";
import { getStripe, PLAN_DETAILS } from "@/lib/stripe/config";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  if (!webhookSecret) {
    console.error("[Stripe Webhook] Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`[Stripe Webhook] Processing event: ${event.type}`);

  try {
    switch (event.type) {
      // Handle new subscription created (with trial)
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        const subscriptionType = subscription.metadata?.subscriptionType as
          | "monthly"
          | "annual"
          | "lifetime"
          | undefined;

        if (userId && subscriptionType) {
          // Check if subscription is in trial
          if (subscription.status === "trialing" && subscription.trial_end) {
            const trialEndDate = new Date(subscription.trial_end * 1000);
            await startTrial({
              userId,
              subscriptionType,
              stripeSubscriptionId: subscription.id,
              trialEndDate,
            });
            console.log(
              `[Stripe Webhook] Started 7-day trial for ${subscriptionType} subscription for user ${userId}`,
            );

            // Send trial started email
            try {
              const profile = await getUserFullProfile({ userId });
              if (profile?.email) {
                const planDetails = PLAN_DETAILS[subscriptionType];
                await sendTrialStartedEmail({
                  email: profile.email,
                  displayName: profile.displayName,
                  trialEndDate,
                  planName: planDetails?.name || subscriptionType,
                });
              }
            } catch (emailError) {
              console.error(
                "[Stripe Webhook] Failed to send trial email:",
                emailError,
              );
            }
          } else {
            await activateSubscription({
              userId,
              subscriptionType,
              stripeSubscriptionId: subscription.id,
            });
            console.log(
              `[Stripe Webhook] Activated ${subscriptionType} subscription for user ${userId}`,
            );
          }
        }
        break;
      }

      // Handle subscription renewal / first payment after trial
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;

        // Get subscription ID from invoice - handle various Stripe API versions
        const invoiceAny = invoice as unknown as Record<string, unknown>;
        const subscriptionId =
          typeof invoiceAny.subscription === "string"
            ? invoiceAny.subscription
            : (invoiceAny.subscription as { id?: string })?.id ||
              (typeof invoice.parent?.subscription_details?.subscription ===
              "string"
                ? invoice.parent.subscription_details.subscription
                : null);

        if (subscriptionId) {
          const subscriptionResponse =
            await getStripe().subscriptions.retrieve(subscriptionId);
          // Cast to access properties
          const subscription = subscriptionResponse as unknown as {
            id: string;
            metadata: Record<string, string>;
            current_period_end: number;
          };
          const subscriptionType = subscription.metadata?.subscriptionType as
            | "monthly"
            | "annual"
            | "lifetime"
            | undefined;
          const userId = subscription.metadata?.userId;

          if (userId && subscriptionType) {
            // Activate subscription (trial ended, payment successful)
            await activateSubscription({
              userId,
              subscriptionType,
              stripeSubscriptionId: subscription.id,
            });
            console.log(
              `[Stripe Webhook] Payment received, activated ${subscriptionType} subscription for user ${userId}`,
            );

            // For annual and lifetime plans, cancel after first payment
            // so they don't get charged again
            if (
              subscriptionType === "annual" ||
              subscriptionType === "lifetime"
            ) {
              await getStripe().subscriptions.update(subscription.id, {
                cancel_at_period_end: true,
              });
              console.log(
                `[Stripe Webhook] Set ${subscriptionType} subscription to cancel at period end`,
              );
            }
          } else {
            // Fallback: just renew based on subscription data
            await renewSubscription({
              stripeSubscriptionId: subscription.id,
              periodEnd: new Date(subscription.current_period_end * 1000),
            });
            console.log(
              `[Stripe Webhook] Renewed subscription ${subscription.id}`,
            );
          }
        }
        break;
      }

      // Handle subscription cancellation or expiration
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionType = subscription.metadata?.subscriptionType;

        // Don't expire lifetime/annual subscriptions when they "end" - they're still valid
        if (subscriptionType === "lifetime" || subscriptionType === "annual") {
          console.log(
            `[Stripe Webhook] ${subscriptionType} subscription ${subscription.id} ended (user retains access)`,
          );
        } else {
          await expireSubscription(subscription.id);
          console.log(
            `[Stripe Webhook] Expired subscription ${subscription.id}`,
          );
        }
        break;
      }

      // Handle failed payment
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.warn(
          `[Stripe Webhook] Payment failed for invoice ${invoice.id}`,
        );
        // Could send email notification here
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook] Error processing event:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
