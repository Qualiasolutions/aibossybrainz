import { NextResponse } from "next/server";
import { createPortalSession } from "@/lib/stripe/actions";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const origin =
      request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";

    const portalUrl = await createPortalSession({
      userId: user.id,
      returnUrl: `${origin}/new`,
    });

    return NextResponse.json({ url: portalUrl });
  } catch (error) {
    console.error("[Stripe Portal] Error:", error);

    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 },
    );
  }
}
