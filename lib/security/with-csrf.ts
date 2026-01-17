import { validateCsrfRequest } from "@/lib/security/csrf";
import { ChatSDKError } from "@/lib/errors";

type RouteHandler<TContext = unknown> = (
	request: Request,
	context?: TContext,
) => Promise<Response>;

/**
 * Higher-order function that wraps route handlers with CSRF validation.
 * Use this for all state-changing operations (POST, PUT, PATCH, DELETE).
 *
 * @example
 * export const POST = withCsrf(async (request: Request) => {
 *   // Your handler logic here - CSRF already validated
 *   return Response.json({ success: true });
 * });
 */
export function withCsrf<TContext = unknown>(
	handler: RouteHandler<TContext>,
): RouteHandler<TContext> {
	return async (request: Request, context?: TContext): Promise<Response> => {
		const csrf = await validateCsrfRequest(request);

		if (!csrf.valid) {
			return new ChatSDKError("forbidden:api", csrf.error).toResponse();
		}

		return handler(request, context);
	};
}
