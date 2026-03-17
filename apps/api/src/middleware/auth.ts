import { createMiddleware } from "hono/factory";
import { profiles } from "../db/schema";
import { eq } from "drizzle-orm";
import { verify } from "hono/jwt";
import { getSupabasePublicKey } from "../utils/jwks";

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
    const publicKey = await getSupabasePublicKey(token);
    const payload = await verify(token, publicKey, "ES256");

    const userId = payload.sub as string;

    if (!userId) {
      console.error("[Auth] No sub claim found in payload:", payload);
      throw new Error("Invalid Token");
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
    console.error("JWT Verification Failed:", err);
    if (err instanceof Error && err.message.includes("Invalid Token")) {
      return c.json({ error: "Invalid Token" }, 401);
    }
    return c.json({ error: "Authentication failed" }, 401);
  }
});
