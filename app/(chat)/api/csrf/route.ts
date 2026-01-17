import { NextResponse } from "next/server";
import {
	generateCsrfToken,
	getCsrfToken,
	validateCsrfToken,
} from "@/lib/security/csrf";

export const dynamic = "force-dynamic";

const CSRF_COOKIE_NAME = "__csrf";

/**
 * GET /api/csrf - Get or generate CSRF token
 * Returns existing token if valid, otherwise generates new one
 */
export async function GET() {
	try {
		// Check for existing valid token
		const existingToken = await getCsrfToken();

		if (existingToken && validateCsrfToken(existingToken)) {
			return NextResponse.json({ token: existingToken });
		}

		// Generate new token and set cookie via response headers
		const newToken = generateCsrfToken();
		const response = NextResponse.json({ token: newToken });

		response.cookies.set(CSRF_COOKIE_NAME, newToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
			maxAge: 60 * 60 * 24, // 24 hours
		});

		return response;
	} catch (error) {
		console.error("CSRF token generation error:", error);
		return NextResponse.json(
			{ error: "Failed to generate CSRF token" },
			{ status: 500 },
		);
	}
}
