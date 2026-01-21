import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/config";
import {
  activateSubscription,
  renewSubscription,
  expireSubscription,
} from "@/lib/stripe/actions";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  if (!webhookSecret) {
    console.error("[Stripe Webhook] Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  console.log(`[Stripe Webhook] Processing event: ${event.type}`);

  try {
    switch (event.type) {
      // Handle successful checkout (one-time payment for annual/lifetime)
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // For subscription mode, the subscription.created event handles activation
        if (session.mode === "payment") {
          const userId = session.metadata?.userId;
          const subscriptionType = session.metadata?.subscriptionType as
            | "monthly"
            | "annual"
            | "lifetime"
            | undefined;

          if (userId && subscriptionType) {
            await activateSubscription({
              userId,
              subscriptionType,
            });
            console.log(
              `[Stripe Webhook] Activated ${subscriptionType} subscription for user ${userId}`
            );
          }
        }
        break;
      }

      // Handle new subscription created
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        const subscriptionType = subscription.metadata?.subscriptionType as
          | "monthly"
          | "annual"
          | "lifetime"
          | undefined;

        if (userId && subscriptionType) {
          await activateSubscription({
            userId,
            subscriptionType,
            stripeSubscriptionId: subscription.id,
          });
          console.log(
            `[Stripe Webhook] Created ${subscriptionType} subscription for user ${userId}`
          );
        }
        break;
      }

      // Handle subscription renewal
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;

        // Only process subscription invoices (not one-time payments)
        const subscriptionId =
          typeof invoice.parent?.subscription_details?.subscription === "string"
            ? invoice.parent.subscription_details.subscription
            : null;

        if (subscriptionId) {
          const subscriptionResponse = await getStripe().subscriptions.retrieve(
            subscriptionId
          );
          // Cast to access the raw data
          const subscriptionData = subscriptionResponse as unknown as {
            id: string;
            current_period_end: number;
          };

          await renewSubscription({
            stripeSubscriptionId: subscriptionData.id,
            periodEnd: new Date(subscriptionData.current_period_end * 1000),
          });
          console.log(
            `[Stripe Webhook] Renewed subscription ${subscriptionData.id}`
          );
        }
        break;
      }

      // Handle subscription cancellation or expiration
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await expireSubscription(subscription.id);
        console.log(`[Stripe Webhook] Expired subscription ${subscription.id}`);
        break;
      }

      // Handle failed payment
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.warn(
          `[Stripe Webhook] Payment failed for invoice ${invoice.id}`
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
      { status: 500 }
    );
  }
}
