import { addMessageToTicket } from "@/lib/db/support-queries";
import { ChatSDKError } from "@/lib/errors";
import { withCsrf } from "@/lib/security/with-csrf";
import { createClient } from "@/lib/supabase/server";

// POST: Add a message to a ticket
export const POST = withCsrf(
  async (
    request: Request,
    context?: { params: Promise<{ ticketId: string }> },
  ) => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new ChatSDKError("unauthorized:api").toResponse();
    }

    try {
      const { ticketId } = await context!.params; // biome-ignore lint/style/noNonNullAssertion: context is guaranteed by Next.js for dynamic routes
      const body = await request.json();
      const { content } = body as { content: string };

      // Validate content
      if (!content?.trim()) {
        return new ChatSDKError(
          "bad_request:api",
          "Message content is required",
        ).toResponse();
      }

      const message = await addMessageToTicket({
        ticketId,
        userId: user.id,
        content: content.trim(),
      });

      return Response.json(message, { status: 201 });
    } catch (error) {
      if (error instanceof ChatSDKError) {
        return error.toResponse();
      }
      console.error("Error adding message:", error);
      return new ChatSDKError("bad_request:api").toResponse();
    }
  },
);
