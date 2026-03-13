import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { Env } from "../middleware/auth";
import { authMiddleware } from "../middleware/auth";
import { projectService } from "../services/projectService";
import { profileService } from "../services/profileService";
import {
  createProjectSchema,
  updateProjectSchema,
  reorderProjectSchema,
} from "../validators/projectValidator";

const projectRoutes = new Hono<Env>();

// ============================================
// PUBLIC ROUTES
// ============================================

/** GET /profiles/:username/projects — public list */
projectRoutes.get("/profiles/:username/projects", async (c) => {
  const { username } = c.req.param();
  const data = await projectService.listByUsername(username);

  if (data === null) {
    return c.json({ error: "Profile not found" }, 404);
  }

  return c.json({ data });
});

// ============================================
// PROTECTED ROUTES
// ============================================

/** GET /me/projects — list own projects */
projectRoutes.get("/me/projects", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const profile = await profileService.getByUserId(userId);

  if (!profile) {
    return c.json({ error: "Profile not found. Create a profile first." }, 404);
  }

  const data = await projectService.listByProfileId(profile.id);
  return c.json({ data });
});

/** POST /me/projects — add project */
projectRoutes.post(
  "/me/projects",
  authMiddleware,
  zValidator("json", createProjectSchema),
  async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const profile = await profileService.getByUserId(userId);

    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    const data = await projectService.create(profile.id, body);
    return c.json({ data }, 201);
  }
);

/** PATCH /me/projects/:id — update project */
projectRoutes.patch(
  "/me/projects/:id",
  authMiddleware,
  zValidator("json", updateProjectSchema),
  async (c) => {
    const userId = c.get("userId");
    const { id } = c.req.param();
    const body = c.req.valid("json");
    const profile = await profileService.getByUserId(userId);

    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    const data = await projectService.update(id, profile.id, body);
    if (!data) {
      return c.json({ error: "Project not found" }, 404);
    }

    return c.json({ data });
  }
);

/** DELETE /me/projects/:id — delete project */
projectRoutes.delete("/me/projects/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const { id } = c.req.param();
  const profile = await profileService.getByUserId(userId);

  if (!profile) {
    return c.json({ error: "Profile not found" }, 404);
  }

  const deleted = await projectService.delete(id, profile.id);
  if (!deleted) {
    return c.json({ error: "Project not found" }, 404);
  }

  return c.json({ success: true });
});

/** PATCH /me/projects/reorder — reorder projects */
projectRoutes.patch(
  "/me/projects/reorder",
  authMiddleware,
  zValidator("json", reorderProjectSchema),
  async (c) => {
    const userId = c.get("userId");
    const { ids } = c.req.valid("json");
    const profile = await profileService.getByUserId(userId);

    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    await projectService.reorder(profile.id, ids);
    return c.json({ success: true });
  }
);

export default projectRoutes;
