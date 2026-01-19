import { NextResponse } from "next/server";
import { checkUserSubscription } from "@/lib/db/queries";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const subscription = await checkUserSubscription(user.id);

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("[Subscription Check] Error:", error);
    return NextResponse.json(
      { error: "Failed to check subscription" },
      { status: 500 }
    );
  }
}
