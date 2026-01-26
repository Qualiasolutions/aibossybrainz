import { NextResponse } from "next/server";
import { ensureUserExists, getUserProfile } from "@/lib/db/queries";
import { sendWelcomeEmail } from "@/lib/email/subscription-emails";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const plan = searchParams.get("plan");
  const next = searchParams.get("next") || "/new";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const user = data.user;

      // Ensure user exists in our database
      if (user.email) {
        try {
          await ensureUserExists({ id: user.id, email: user.email });

          // Send welcome email for new signups
          // Check if this is a new user (no profile data yet)
          const profile = await getUserProfile({ userId: user.id });
          const isNewUser = !profile?.onboardedAt;

          if (isNewUser) {
            // Send welcome email in the background
            sendWelcomeEmail({
              email: user.email,
              displayName: profile?.displayName,
            }).catch((err) => {
              console.error("[Auth Callback] Failed to send welcome email:", err);
            });
          }
        } catch (err) {
          console.error("[Auth Callback] Failed to ensure user exists:", err);
        }
      }

      // If there's a plan, redirect to subscribe page (they'll enter payment info)
      if (plan) {
        return NextResponse.redirect(`${origin}/subscribe?plan=${plan}`);
      }

      // Otherwise redirect to the app (user is now logged in)
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something went wrong, redirect to error page
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
