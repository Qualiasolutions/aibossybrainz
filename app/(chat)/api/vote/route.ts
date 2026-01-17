import { safeParseJson } from "@/lib/api-utils";
import { getChatById, getVotesByChatId, voteMessage } from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";
import { withCsrf } from "@/lib/security/with-csrf";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameter chatId is required.",
    ).toResponse();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new ChatSDKError("unauthorized:vote").toResponse();
  }

  const chat = await getChatById({ id: chatId });

  // If chat doesn't exist yet (e.g., new chat not saved), return empty votes
  if (!chat) {
    return Response.json([], { status: 200 });
  }

  if (chat.userId !== user.id) {
    return new ChatSDKError("forbidden:vote").toResponse();
  }

  const votes = await getVotesByChatId({ id: chatId });

  return Response.json(votes, { status: 200 });
}

export const PATCH = withCsrf(async (request: Request) => {
  try {
    const { chatId, messageId, type } = await safeParseJson<{
      chatId: string;
      messageId: string;
      type: "up" | "down";
    }>(request);

    if (!chatId || !messageId || !type) {
      return new ChatSDKError(
        "bad_request:api",
        "Parameters chatId, messageId, and type are required.",
      ).toResponse();
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new ChatSDKError("unauthorized:vote").toResponse();
    }

    const chat = await getChatById({ id: chatId });

    if (!chat) {
      return new ChatSDKError("not_found:vote").toResponse();
    }

    if (chat.userId !== user.id) {
      return new ChatSDKError("forbidden:vote").toResponse();
    }

    await voteMessage({
      chatId,
      messageId,
      type,
    });

    return new Response("Message voted", { status: 200 });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }
    console.error("Failed to vote:", error);
    return new ChatSDKError("bad_request:api", "Failed to vote").toResponse();
  }
});
