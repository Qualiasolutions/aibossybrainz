import { NextResponse } from "next/server";
import { z } from "zod";
import { createCheckoutSession } from "@/lib/stripe/actions";
import type { StripePlanId } from "@/lib/stripe/config";
import { createClient } from "@/lib/supabase/server";

const checkoutSchema = z.object({
  planId: z.enum(["monthly", "biannual"]),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id || !user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planId } = checkoutSchema.parse(body);

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";

    const checkoutUrl = await createCheckoutSession({
      userId: user.id,
      email: user.email,
      planId: planId as StripePlanId,
      successUrl: `${origin}/new?payment=success`,
      cancelUrl: `${origin}/pricing?payment=cancelled`,
    });

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("[Stripe Checkout] Error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid plan ID" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
