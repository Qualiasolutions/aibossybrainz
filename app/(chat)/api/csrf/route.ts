import { NextResponse } from "next/server";
import {
	getCsrfToken,
	setCsrfCookie,
	validateCsrfToken,
} from "@/lib/security/csrf";

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

		// Generate new token and set cookie
		const newToken = await setCsrfCookie();

		return NextResponse.json({ token: newToken });
	} catch (error) {
		console.error("CSRF token generation error:", error);
		return NextResponse.json(
			{ error: "Failed to generate CSRF token" },
			{ status: 500 },
		);
	}
}
