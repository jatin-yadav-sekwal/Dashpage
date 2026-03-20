import { createMiddleware } from "hono/factory";
import { profiles } from "../db/schema";
import { eq } from "drizzle-orm";
import { verify } from "hono/jwt";
import { getSupabasePublicKey } from "../utils/jwks";

// ─────────────────────────────────────────────────────────────
// Type Definitions
// ─────────────────────────────────────────────────────────────
// Simplified for Vercel deployment — all environment variables
// are accessed via process.env, no Cloudflare-style Bindings.
// ─────────────────────────────────────────────────────────────

export type Env = {
  Variables: {
    userId: string;
    username: string | null;
    hasProfile: boolean;
  };
};

export type Variables = Env["Variables"];

// ─────────────────────────────────────────────────────────────
// Auth Middleware
// ─────────────────────────────────────────────────────────────
// Validates Supabase JWTs via JWKS, extracts the user ID,
// and attaches profile info to the Hono context.
// ─────────────────────────────────────────────────────────────

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
  // Skip auth for OPTIONS preflight requests - let CORS middleware handle it
  if (c.req.method === "OPTIONS") {
    return next();
  }

  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    console.log("[Auth] No Authorization header");
    return c.json({ error: "Unauthorized", code: "AUTH_NO_HEADER" }, 401);
  }

  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    return c.json({ error: "Unauthorized", code: "AUTH_EMPTY_TOKEN" }, 401);
  }

  try {
    const publicKey = await getSupabasePublicKey(token);
    const payload = await verify(token, publicKey, "ES256");

    const userId = payload.sub as string;

    if (!userId) {
      console.error("[Auth] No sub claim found in payload:", payload);
      return c.json({ error: "Invalid token", code: "AUTH_NO_SUB" }, 401);
    }

    // Check token expiry
    if (payload.exp && typeof payload.exp === "number") {
      const nowSeconds = Math.floor(Date.now() / 1000);
      if (payload.exp < nowSeconds) {
        return c.json({ error: "Token expired", code: "AUTH_EXPIRED" }, 401);
      }
    }

    const { db } = await import("../db");
    
    const profile = await db.query.profiles
      .findFirst({
        where: eq(profiles.userId, userId),
      })
      .catch(() => null);

    if (profile) {
      c.set("userId", userId);
      c.set("username", profile.username);
      c.set("hasProfile", true);
    } else {
      c.set("userId", userId);
      c.set("username", null);
      c.set("hasProfile", false);
    }

    await next();
  } catch (err) {
    console.error("[Auth] JWT Verification Failed:", err);

    if (err instanceof Error) {
      if (err.message.includes("Invalid Token") || err.message.includes("invalid")) {
        return c.json({ error: "Invalid token", code: "AUTH_INVALID_TOKEN" }, 401);
      }
      if (err.message.includes("expired") || err.message.includes("exp")) {
        return c.json({ error: "Token expired", code: "AUTH_EXPIRED" }, 401);
      }
      if (err.message.includes("JWKS") || err.message.includes("fetch")) {
        return c.json({ error: "Authentication service unavailable", code: "AUTH_SERVICE_ERROR" }, 503);
      }
    }

    return c.json({ error: "Authentication failed", code: "AUTH_FAILED" }, 401);
  }
});
