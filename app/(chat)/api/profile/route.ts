import { createClient } from "@/lib/supabase/server";
import { ChatSDKError } from "@/lib/errors";
import { getUserProfile, updateUserProfile } from "@/lib/db/queries";
import type { BotType } from "@/lib/supabase/types";

// GET - Fetch user profile
export async function GET() {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return new ChatSDKError("unauthorized:chat").toResponse();
		}

		const profile = await getUserProfile({ userId: user.id });
		return Response.json(profile);
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

		if (!user) {
			return new ChatSDKError("unauthorized:chat").toResponse();
		}

		const body = await request.json();
		const { displayName, companyName, industry, businessGoals, preferredBotType } =
			body;

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
