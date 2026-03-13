import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { Env } from "../middleware/auth";
import { authMiddleware } from "../middleware/auth";
import { tagService } from "../services/tagService";
import { profileService } from "../services/profileService";

const tagRoutes = new Hono<Env>();

const replaceTagsSchema = z.object({
  tags: z.array(z.string().min(1).max(50)).max(20),
});

// ============================================
// PUBLIC
// ============================================

/** GET /profiles/:username/tags — public tags */
tagRoutes.get("/profiles/:username/tags", async (c) => {
  const { username } = c.req.param();
  const data = await tagService.getByUsername(username);

  if (data === null) {
    return c.json({ error: "Profile not found" }, 404);
  }

  return c.json({ data });
});

// ============================================
// PROTECTED
// ============================================

/** GET /me/tags — own tags */
tagRoutes.get("/me/tags", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const profile = await profileService.getByUserId(userId);

  if (!profile) {
    return c.json({ error: "Profile not found" }, 404);
  }

  const data = await tagService.getByProfileId(profile.id);
  return c.json({ data });
});

/** PUT /me/tags — replace all tags */
tagRoutes.put(
  "/me/tags",
  authMiddleware,
  zValidator("json", replaceTagsSchema),
  async (c) => {
    const userId = c.get("userId");
    const { tags } = c.req.valid("json");
    const profile = await profileService.getByUserId(userId);

    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    const data = await tagService.replaceTags(profile.id, tags);
    return c.json({ data });
  }
);

export default tagRoutes;
