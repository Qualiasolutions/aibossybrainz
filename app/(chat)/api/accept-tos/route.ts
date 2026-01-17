import { ensureUserExists } from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return new ChatSDKError("unauthorized:auth").toResponse();
  }

  // Ensure User record exists (syncs from Supabase Auth)
  await ensureUserExists({ id: user.id, email: user.email });

  // Update user's TOS acceptance timestamp
  const { error } = await supabase
    .from("User")
    .update({ tosAcceptedAt: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    console.error("Failed to update TOS acceptance:", error);
    return new ChatSDKError(
      "bad_request:database",
      "Failed to accept Terms of Service",
    ).toResponse();
  }

  return Response.json({ success: true, acceptedAt: new Date().toISOString() });
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new ChatSDKError("unauthorized:auth").toResponse();
  }

  // Get user's TOS acceptance status
  const { data, error } = await supabase
    .from("User")
    .select("tosAcceptedAt")
    .eq("id", user.id)
    .single();

  // If user doesn't exist in User table yet (new user), return not accepted
  if (error && error.code === "PGRST116") {
    return Response.json({
      accepted: false,
      acceptedAt: null,
    });
  }

  if (error) {
    console.error("Failed to get TOS acceptance status:", error);
    return new ChatSDKError(
      "bad_request:database",
      "Failed to get Terms of Service status",
    ).toResponse();
  }

  return Response.json({
    accepted: !!data?.tosAcceptedAt,
    acceptedAt: data?.tosAcceptedAt || null,
  });
}
