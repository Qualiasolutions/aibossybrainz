import {
  ensureUserExists,
  getUserProfile,
  updateUserProfile,
} from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import type { BotType } from "@/lib/supabase/types";

// GET - Fetch user profile
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }

    // Ensure User record exists (syncs from Supabase Auth)
    await ensureUserExists({ id: user.id, email: user.email });

    const profile = await getUserProfile({ userId: user.id });

    // Return default values if profile fields are null
    return Response.json({
      id: user.id,
      email: user.email,
      displayName: profile?.displayName ?? null,
      companyName: profile?.companyName ?? null,
      industry: profile?.industry ?? null,
      businessGoals: profile?.businessGoals ?? null,
      preferredBotType: profile?.preferredBotType ?? null,
      onboardedAt: profile?.onboardedAt ?? null,
    });
  } catch (error) {
    console.error("[Profile API] GET error:", error);
    return new ChatSDKError("bad_request:database").toResponse();
  }
}

// POST - Update user profile
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }

    // Ensure User record exists (syncs from Supabase Auth)
    await ensureUserExists({ id: user.id, email: user.email });

    const body = await request.json();
    const {
      displayName,
      companyName,
      industry,
      businessGoals,
      preferredBotType,
    } = body;

    await updateUserProfile({
      userId: user.id,
      displayName,
      companyName,
      industry,
      businessGoals,
      preferredBotType: preferredBotType as BotType | undefined,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("[Profile API] POST error:", error);
    return new ChatSDKError("bad_request:database").toResponse();
  }
}
