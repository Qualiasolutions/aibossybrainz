import {
  deleteStrategyCanvas,
  getAllUserCanvases,
  getStrategyCanvas,
  saveStrategyCanvas,
} from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import type { CanvasType } from "@/lib/supabase/types";

// GET - Fetch canvas(es)
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }

    const { searchParams } = new URL(request.url);
    const canvasType = searchParams.get("type") as CanvasType | null;
    const canvasId = searchParams.get("id");

    if (canvasId) {
      const canvas = await getStrategyCanvas({ userId: user.id, canvasId });
      return Response.json(canvas);
    }

    if (canvasType) {
      const canvas = await getStrategyCanvas({ userId: user.id, canvasType });
      return Response.json(canvas);
    }

    // Return all canvases
    const canvases = await getAllUserCanvases({ userId: user.id });
    return Response.json(canvases);
  } catch (error) {
    console.error("[Canvas API] GET error:", error);
    return new ChatSDKError("bad_request:database").toResponse();
  }
}

// POST - Save canvas
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
    const { canvasType, name, data, canvasId, isDefault } = body;

    if (!canvasType || !data) {
      return new ChatSDKError("bad_request:api").toResponse();
    }

    const id = await saveStrategyCanvas({
      userId: user.id,
      canvasType,
      name,
      data,
      canvasId,
      isDefault: isDefault ?? true,
    });

    return Response.json({ id, success: true });
  } catch (error) {
    console.error("[Canvas API] POST error:", error);
    return new ChatSDKError("bad_request:database").toResponse();
  }
}

// DELETE - Delete canvas
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }

    const { searchParams } = new URL(request.url);
    const canvasId = searchParams.get("id");

    if (!canvasId) {
      return new ChatSDKError("bad_request:api").toResponse();
    }

    await deleteStrategyCanvas({ userId: user.id, canvasId });
    return Response.json({ success: true });
  } catch (error) {
    console.error("[Canvas API] DELETE error:", error);
    return new ChatSDKError("bad_request:database").toResponse();
  }
}
