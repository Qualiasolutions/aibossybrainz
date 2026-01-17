import {
  ensureUserExists,
  getUserProfile,
  updateUserProfile,
} from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";
import { validateCsrfRequest } from "@/lib/security/csrf";
import { createClient } from "@/lib/supabase/server";
import type { BotType } from "@/lib/supabase/types";
import { z } from "zod";

// Validation schema for profile updates
const profileUpdateSchema = z.object({
  displayName: z.string().max(100, "Display name too long").optional(),
  companyName: z.string().max(200, "Company name too long").optional(),
  industry: z.string().max(100, "Industry too long").optional(),
  businessGoals: z.string().max(2000, "Business goals too long").optional(),
  preferredBotType: z
    .enum(["alexandria", "kim", "collaborative"])
    .optional()
    .nullable(),
});

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
  // CSRF validation for state-changing operation
  const csrf = await validateCsrfRequest(request);
  if (!csrf.valid) {
    return new Response(JSON.stringify({ error: csrf.error }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

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

    // Validate input with Zod schema
    const parseResult = profileUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      return Response.json(
        { error: "Invalid input", details: parseResult.error.flatten() },
        { status: 400 },
      );
    }

    const { displayName, companyName, industry, businessGoals, preferredBotType } =
      parseResult.data;

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
