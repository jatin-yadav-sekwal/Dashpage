import { handle } from "hono/vercel";
import app from "../src/index";

// ─────────────────────────────────────────────────────────────
// Vercel Serverless Entrypoint
// ─────────────────────────────────────────────────────────────
// This is the single entrypoint for all API requests on Vercel.
// It wraps the Hono app with crash protection, env validation,
// and timeout guards to ensure no silent failures.
// ─────────────────────────────────────────────────────────────

const handler = handle(app) as (request: Request, context?: { waitUntil?: (promise: Promise<void>) => void }) => Promise<Response>;

/**
 * Critical environment variables that must be present for the
 * API to function. Checked at invocation time (not import time)
 * because Vercel injects env vars at runtime.
 */
const REQUIRED_ENV_VARS = ["DATABASE_URL", "SUPABASE_URL"] as const;

/**
 * Timeout duration in milliseconds.
 * Set to 55s — safely under Vercel's 60s hard limit for Pro plans.
 * This prevents Vercel's opaque FUNCTION_INVOCATION_TIMEOUT error.
 */
const HANDLER_TIMEOUT_MS = 55_000;

/**
 * Validates that all critical environment variables are present.
 * Returns the name of the first missing variable, or null if all are set.
 */
function validateEnv(): string | null {
  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]) return key;
  }
  return null;
}

/**
 * Creates a structured JSON error response.
 * All error responses follow the same shape for predictable client handling.
 */
function errorResponse(
  status: number,
  error: string,
  code: string,
  details?: string
): Response {
  const body: Record<string, unknown> = {
    error,
    code,
    timestamp: new Date().toISOString(),
  };
  if (details) body.details = details;

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    },
  });
}

export default async function (
  request: Request,
  context: { waitUntil?: (promise: Promise<void>) => void }
) {
  try {
    // ── Step 1: Startup env validation ──────────────────────
    // Fail fast with 503 if critical env vars are missing.
    // This prevents obscure DB connection errors deeper in the stack.
    const missingEnv = validateEnv();
    if (missingEnv) {
      console.error(`[Entrypoint] FATAL: Missing required env var: ${missingEnv}`);
      return errorResponse(
        503,
        "Service temporarily unavailable",
        "MISSING_ENV",
        `Required configuration '${missingEnv}' is not set`
      );
    }

    // ── Step 2: Timeout guard ───────────────────────────────
    // Creates a race between the handler and a timeout.
    // If the handler exceeds 55s, we return a structured timeout
    // error instead of letting Vercel kill the function opaquely.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), HANDLER_TIMEOUT_MS);

    const responsePromise = handler(request, context as any);

    const timeoutPromise = new Promise<Response>((_, reject) => {
      controller.signal.addEventListener("abort", () => {
        reject(new Error("HANDLER_TIMEOUT"));
      });
    });

    let response: Response;
    try {
      response = await Promise.race([responsePromise, timeoutPromise]);
    } catch (raceError: any) {
      clearTimeout(timeoutId);
      if (raceError?.message === "HANDLER_TIMEOUT") {
        console.error(`[Entrypoint] Handler exceeded ${HANDLER_TIMEOUT_MS}ms timeout for ${request.method} ${new URL(request.url).pathname}`);
        return errorResponse(
          504,
          "Request timed out",
          "HANDLER_TIMEOUT",
          `The server did not respond within ${HANDLER_TIMEOUT_MS / 1000}s`
        );
      }
      throw raceError; // Re-throw non-timeout errors to outer catch
    }

    clearTimeout(timeoutId);

    // ── Step 3: Attach security & diagnostic headers ────────
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set(
      "Cache-Control",
      "public, max-age=0, s-maxage=60, stale-while-revalidate=300"
    );

    return response;
  } catch (error: unknown) {
    // ── Step 4: Catch-all crash protection ──────────────────
    // This catches ANY unhandled error — sync or async — that
    // escaped the Hono error handler. Logs full details for
    // debugging but returns a safe, structured response to clients.
    const err = error instanceof Error ? error : new Error(String(error));
    const url = (() => { try { return new URL(request.url).pathname; } catch { return "unknown"; } })();

    console.error("[Entrypoint] Unhandled crash:", {
      method: request.method,
      path: url,
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    });

    return errorResponse(
      500,
      "Internal Server Error",
      "UNHANDLED_EXCEPTION"
    );
  }
}

export const config = {
  runtime: "nodejs18.x",
  maxDuration: 60,
};
