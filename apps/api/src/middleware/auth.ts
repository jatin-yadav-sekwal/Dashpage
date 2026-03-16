import { createMiddleware } from "hono/factory";
import { db } from "../db";
import { profiles } from "../db/schema";
import { eq } from "drizzle-orm";
import { verify } from "hono/jwt";
import { getSupabasePublicKey } from "../utils/jwks";

// Dashpage auth context — simplified from unmarky
export type Env = {
  Variables: {
    userId: string;
    username: string | null;
    hasProfile: boolean;
  };
  Bindings: {
    DATABASE_URL: string;
    FRONTEND_URL: string;
    CORS_ORIGIN: string;
    RAZORPAY_KEY_ID: string;
    RAZORPAY_KEY_SECRET: string;
    RAZORPAY_WEBHOOK_SECRET: string;
    SUPABASE_URL: string;
    SUPABASE_JWKS_URL?: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
  };
};

export type Variables = Env["Variables"];
export type Bindings = Env["Bindings"];

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    console.log("[Auth] No Authorization header");
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    // Fetch the correct public key from Supabase JWKS (cached)
    // Pass c.env so it can find the URL in Workers
    const publicKey = await getSupabasePublicKey(token, c.env);

    // Verify Token using fetched Public Key (ES256)
    const payload = await verify(token, publicKey, "ES256");

    // Supabase JWT 'sub' claim is the user ID
    const userId = payload.sub as string;

    if (!userId) {
      console.error("[Auth] No sub claim found in payload:", payload);
      throw new Error("Invalid Token");
    }

    // Check against our profiles table to get context
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
      // User exists in Auth but hasn't created a profile yet
      c.set("userId", userId);
      c.set("username", null);
      c.set("hasProfile", false);
    }

    await next();
  } catch (err) {
    console.error("JWT Verification Failed:", err);
    if (err instanceof Error && err.message.includes("Invalid Token")) {
      return c.json({ error: "Invalid Token" }, 401);
    }
    return c.json({ error: "Authentication failed" }, 401);
  }
});
