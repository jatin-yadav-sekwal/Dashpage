import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { Env } from "../middleware/auth";
import { authMiddleware } from "../middleware/auth";
import { educationService } from "../services/educationService";
import { profileService } from "../services/profileService";
import {
  createEducationSchema,
  updateEducationSchema,
  reorderEducationSchema,
} from "../validators/educationValidator";

const educationRoutes = new Hono<Env>();

// ============================================
// PUBLIC ROUTES
// ============================================

/** GET /profiles/:username/educations — public list */
educationRoutes.get("/profiles/:username/educations", async (c) => {
  const { username } = c.req.param();
  const data = await educationService.listByUsername(username);

  if (data === null) {
    return c.json({ error: "Profile not found" }, 404);
  }

  return c.json({ data });
});

// ============================================
// PROTECTED ROUTES
// ============================================

/** GET /me/educations — list own educations */
educationRoutes.get("/me/educations", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const profile = await profileService.getByUserId(userId);

  if (!profile) {
    return c.json({ error: "Profile not found. Create a profile first." }, 404);
  }

  const data = await educationService.listByProfileId(profile.id);
  return c.json({ data });
});

/** POST /me/educations — add education */
educationRoutes.post(
  "/me/educations",
  authMiddleware,
  zValidator("json", createEducationSchema),
  async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const profile = await profileService.getByUserId(userId);

    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    const data = await educationService.create(profile.id, body);
    return c.json({ data }, 201);
  }
);

/** PATCH /me/educations/:id — update education */
educationRoutes.patch(
  "/me/educations/:id",
  authMiddleware,
  zValidator("json", updateEducationSchema),
  async (c) => {
    const userId = c.get("userId");
    const { id } = c.req.param();
    const body = c.req.valid("json");
    const profile = await profileService.getByUserId(userId);

    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    const data = await educationService.update(id, profile.id, body);
    if (!data) {
      return c.json({ error: "Education not found" }, 404);
    }

    return c.json({ data });
  }
);

/** DELETE /me/educations/:id — delete education */
educationRoutes.delete("/me/educations/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const { id } = c.req.param();
  const profile = await profileService.getByUserId(userId);

  if (!profile) {
    return c.json({ error: "Profile not found" }, 404);
  }

  const deleted = await educationService.delete(id, profile.id);
  if (!deleted) {
    return c.json({ error: "Education not found" }, 404);
  }

  return c.json({ success: true });
});

/** PATCH /me/educations/reorder — reorder educations */
educationRoutes.patch(
  "/me/educations/reorder",
  authMiddleware,
  zValidator("json", reorderEducationSchema),
  async (c) => {
    const userId = c.get("userId");
    const { ids } = c.req.valid("json");
    const profile = await profileService.getByUserId(userId);

    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    await educationService.reorder(profile.id, ids);
    return c.json({ success: true });
  }
);

export default educationRoutes;
