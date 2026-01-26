import { ensureUserExists, getUserFullProfile } from "@/lib/db/queries";
import { sendCancellationEmail } from "@/lib/email/subscription-emails";
import { ChatSDKError } from "@/lib/errors";
import { withCsrf } from "@/lib/security/with-csrf";
import { cancelSubscription, createPortalSession } from "@/lib/stripe/actions";
import { createClient } from "@/lib/supabase/server";

// GET - Fetch user subscription info (accessible without auth for polling after payment)
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Return gracefully for unauthenticated users (needed for subscribe page polling)
    if (authError || !user || !user.email) {
      return Response.json({
        isActive: false,
        subscriptionType: null,
        subscriptionStatus: null,
        subscriptionStartDate: null,
        subscriptionEndDate: null,
        hasStripeSubscription: false,
      });
    }

    try {
      await ensureUserExists({ id: user.id, email: user.email });
    } catch (ensureError) {
      console.error("[Subscription API] ensureUserExists error:", ensureError);
      // Continue anyway - user might already exist
    }

    const profile = await getUserFullProfile({ userId: user.id });

    // Check if subscription is active (includes trialing)
    const isActive =
      profile?.subscriptionStatus === "active" ||
      profile?.subscriptionStatus === "trialing";

    return Response.json({
      isActive,
      subscriptionType: profile?.subscriptionType ?? null,
      subscriptionStatus: profile?.subscriptionStatus ?? null,
      subscriptionStartDate: profile?.subscriptionStartDate ?? null,
      subscriptionEndDate: profile?.subscriptionEndDate ?? null,
      hasStripeSubscription: !!profile?.stripeCustomerId,
    });
  } catch (error) {
    console.error("[Subscription API] GET error:", error);
    // Return a graceful fallback instead of error for GET requests
    return Response.json({
      isActive: false,
      subscriptionType: null,
      subscriptionStatus: null,
      subscriptionStartDate: null,
      subscriptionEndDate: null,
      hasStripeSubscription: false,
    });
  }
}

// POST - Create Stripe portal session or cancel subscription
export const POST = withCsrf(async (request: Request) => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }

    await ensureUserExists({ id: user.id, email: user.email });

    const body = await request.json();
    const action = body.action as string;

    if (action === "portal") {
      // Create Stripe billing portal session
      const returnUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const url = await createPortalSession({
        userId: user.id,
        returnUrl: `${returnUrl}/account`,
      });
      return Response.json({ url });
    }

    if (action === "cancel") {
      // Get user profile for email
      const profile = await getUserFullProfile({ userId: user.id });

      // Cancel subscription in Stripe and DB
      await cancelSubscription(user.id);

      // Send cancellation email
      await sendCancellationEmail({
        email: user.email,
        displayName: profile?.displayName ?? null,
        subscriptionEndDate: profile?.subscriptionEndDate ?? null,
      });

      return Response.json({ success: true });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }
    console.error("[Subscription API] POST error:", error);
    return new ChatSDKError("bad_request:database").toResponse();
  }
});
