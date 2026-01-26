import { NextResponse } from "next/server";
import { z } from "zod";
import { createCheckoutSession } from "@/lib/stripe/actions";
import { STRIPE_PRICES, type StripePlanId } from "@/lib/stripe/config";
import { createClient } from "@/lib/supabase/server";

const checkoutSchema = z.object({
  planId: z.enum(["monthly", "annual", "lifetime"]),
});

export async function POST(request: Request) {
  try {
    // Validate Stripe configuration at runtime
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("[Stripe Checkout] STRIPE_SECRET_KEY is not configured");
      return NextResponse.json(
        { error: "Payment system is not configured. Please contact support." },
        { status: 503 },
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id || !user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planId } = checkoutSchema.parse(body);

    // Check if price ID is configured for this plan
    const priceId = STRIPE_PRICES[planId as StripePlanId];
    if (!priceId || priceId.includes("placeholder")) {
      console.error(
        `[Stripe Checkout] Price ID not configured for plan: ${planId}. Current value: ${priceId}`,
      );
      return NextResponse.json(
        { error: "This plan is not yet available. Please contact support." },
        { status: 503 },
      );
    }

    const origin =
      request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";

    const checkoutUrl = await createCheckoutSession({
      userId: user.id,
      email: user.email,
      planId: planId as StripePlanId,
      successUrl: `${origin}/subscribe?payment=success&redirect=/new`,
      cancelUrl: `${origin}/pricing?payment=cancelled`,
    });

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("[Stripe Checkout] Error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
    }

    // Check for specific Stripe errors
    if (error instanceof Error) {
      if (error.message.includes("STRIPE_SECRET_KEY")) {
        return NextResponse.json(
          {
            error: "Payment system is not configured. Please contact support.",
          },
          { status: 503 },
        );
      }
      if (error.message.includes("No such price")) {
        return NextResponse.json(
          {
            error:
              "This pricing plan is not available. Please contact support.",
          },
          { status: 503 },
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create checkout session. Please try again." },
      { status: 500 },
    );
  }
}
