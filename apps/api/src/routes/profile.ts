import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { Env } from "../middleware/auth";
import { authMiddleware } from "../middleware/auth";
import { profileService } from "../services/profileService";
import { createProfileSchema, updateProfileSchema } from "../validators/profileValidator";

const profileRoutes = new Hono<Env>();

// ============================================
// PUBLIC ROUTES
// ============================================

/** GET /api/profiles/:username — public profile page data */
profileRoutes.get("/profiles/:username", async (c) => {
  const { username } = c.req.param();
  console.log(`[Profile Route] Requesting profile: ${username}`);
  
  const result = await profileService.getByUsername(username);
  console.log(`[Profile Route] Profile result for ${username}:`, result.profile ? "found" : "not found");

  if (result.notFound || !result.isPublished || !result.profile) {
    return c.json({ error: "Profile not found" }, 404);
  }

  c.header("Cache-Control", "public, max-age=60, s-maxage=180, stale-while-revalidate=300");
  c.header("X-Content-Type-Options", "nosniff");
  c.header("ETag", `"${result.profile.id}-${result.profile.updatedAt}"`);
  
  return c.json({ data: result.profile });
});

// ============================================
// PROTECTED ROUTES (require auth)
// ============================================

/** GET /me/profile — get own profile */
profileRoutes.get("/me/profile", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const profile = await profileService.getByUserId(userId);

  if (!profile) {
    return c.json({ data: null, hasProfile: false });
  }

  return c.json({ data: profile, hasProfile: true });
});

/** POST /me/profile — create profile */
profileRoutes.post(
  "/me/profile",
  authMiddleware,
  zValidator("json", createProfileSchema),
  async (c) => {
    const userId = c.get("userId");
    const data = c.req.valid("json");

    // Check if user already has a profile
    const existing = await profileService.getByUserId(userId);
    if (existing) {
      return c.json({ error: "Profile already exists" }, 409);
    }

    // Check username availability
    const isAvailable = await profileService.checkUsername(data.username);
    if (!isAvailable) {
      return c.json({ error: "Username already taken" }, 409);
    }

    const profile = await profileService.create(userId, data);
    return c.json({ data: profile }, 201);
  }
);

/** PATCH /me/profile — update profile */
profileRoutes.patch(
  "/me/profile",
  authMiddleware,
  zValidator("json", updateProfileSchema),
  async (c) => {
    const userId = c.get("userId");
    const data = c.req.valid("json");

    const updated = await profileService.update(userId, data);
    if (!updated) {
      return c.json({ error: "Profile not found" }, 404);
    }

    return c.json({ data: updated });
  }
);

// ============================================
// USERNAME CHECK (public)
// ============================================

/** GET /username/check?q=johndoe — check availability */
profileRoutes.get(
  "/username/check",
  zValidator("query", z.object({ q: z.string().min(3).max(30) })),
  async (c) => {
    const { q } = c.req.valid("query");
    const available = await profileService.checkUsername(q);
    return c.json({ available, username: q.toLowerCase() });
  }
);

export default profileRoutes;
