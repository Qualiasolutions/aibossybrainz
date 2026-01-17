import { createSupportTicket, getUserTickets } from "@/lib/db/support-queries";
import { sendTicketNotificationEmail } from "@/lib/email/support-notifications";
import { ChatSDKError } from "@/lib/errors";
import { withCsrf } from "@/lib/security/with-csrf";
import { createClient } from "@/lib/supabase/server";
import type { TicketCategory } from "@/lib/supabase/types";

// GET: List user's support tickets
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new ChatSDKError("unauthorized:api").toResponse();
  }

  try {
    const tickets = await getUserTickets({ userId: user.id });
    return Response.json(tickets);
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }
    console.error("Error getting tickets:", error);
    return new ChatSDKError("bad_request:api").toResponse();
  }
}

// POST: Create a new support ticket
export const POST = withCsrf(async (request: Request) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new ChatSDKError("unauthorized:api").toResponse();
  }

  try {
    const body = await request.json();
    const { subject, message, category } = body as {
      subject: string;
      message: string;
      category?: TicketCategory;
    };

    // Validate required fields
    if (!subject?.trim() || !message?.trim()) {
      return new ChatSDKError(
        "bad_request:api",
        "Subject and message are required",
      ).toResponse();
    }

    // Create the ticket
    const ticket = await createSupportTicket({
      userId: user.id,
      subject: subject.trim(),
      initialMessage: message.trim(),
      category,
    });

    // Send email notification (fire-and-forget)
    sendTicketNotificationEmail({
      ticketId: ticket.id,
      subject: ticket.subject,
      message: message.trim(),
      userEmail: user.email || "unknown",
    }).catch((err) => {
      console.error("Failed to send ticket notification email:", err);
    });

    return Response.json(ticket, { status: 201 });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }
    console.error("Error creating ticket:", error);
    return new ChatSDKError("bad_request:api").toResponse();
  }
});
