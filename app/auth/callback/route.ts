import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const plan = searchParams.get("plan");
  const next = searchParams.get("next") || "/new";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // If there's a plan, redirect to checkout page
      if (plan) {
        return NextResponse.redirect(`${origin}/subscribe?plan=${plan}`);
      }
      // Otherwise redirect to the app
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something went wrong, redirect to error page
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
