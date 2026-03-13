import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { Env } from "../middleware/auth";
import { authMiddleware } from "../middleware/auth";
import { experienceService } from "../services/experienceService";
import { profileService } from "../services/profileService";
import {
  createExperienceSchema,
  updateExperienceSchema,
  reorderSchema,
} from "../validators/experienceValidator";

const experienceRoutes = new Hono<Env>();

// ============================================
// PUBLIC ROUTES
// ============================================

/** GET /profiles/:username/experiences — public list */
experienceRoutes.get("/profiles/:username/experiences", async (c) => {
  const { username } = c.req.param();
  const data = await experienceService.listByUsername(username);

  if (data === null) {
    return c.json({ error: "Profile not found" }, 404);
  }

  return c.json({ data });
});

// ============================================
// PROTECTED ROUTES
// ============================================

/** GET /me/experiences — list own experiences */
experienceRoutes.get("/me/experiences", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const profile = await profileService.getByUserId(userId);

  if (!profile) {
    return c.json({ error: "Profile not found. Create a profile first." }, 404);
  }

  const data = await experienceService.listByProfileId(profile.id);
  return c.json({ data });
});

/** POST /me/experiences — add experience */
experienceRoutes.post(
  "/me/experiences",
  authMiddleware,
  zValidator("json", createExperienceSchema),
  async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const profile = await profileService.getByUserId(userId);

    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    const data = await experienceService.create(profile.id, body);
    return c.json({ data }, 201);
  }
);

/** PATCH /me/experiences/:id — update experience */
experienceRoutes.patch(
  "/me/experiences/:id",
  authMiddleware,
  zValidator("json", updateExperienceSchema),
  async (c) => {
    const userId = c.get("userId");
    const { id } = c.req.param();
    const body = c.req.valid("json");
    const profile = await profileService.getByUserId(userId);

    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    const data = await experienceService.update(id, profile.id, body);
    if (!data) {
      return c.json({ error: "Experience not found" }, 404);
    }

    return c.json({ data });
  }
);

/** DELETE /me/experiences/:id — delete experience */
experienceRoutes.delete("/me/experiences/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const { id } = c.req.param();
  const profile = await profileService.getByUserId(userId);

  if (!profile) {
    return c.json({ error: "Profile not found" }, 404);
  }

  const deleted = await experienceService.delete(id, profile.id);
  if (!deleted) {
    return c.json({ error: "Experience not found" }, 404);
  }

  return c.json({ success: true });
});

/** PATCH /me/experiences/reorder — reorder experiences */
experienceRoutes.patch(
  "/me/experiences/reorder",
  authMiddleware,
  zValidator("json", reorderSchema),
  async (c) => {
    const userId = c.get("userId");
    const { ids } = c.req.valid("json");
    const profile = await profileService.getByUserId(userId);

    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    await experienceService.reorder(profile.id, ids);
    return c.json({ success: true });
  }
);

export default experienceRoutes;
