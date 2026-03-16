import { Hono } from "hono";
import type { Env } from "../middleware/auth";
import { profileService } from "../services/profileService";

const publicRoutes = new Hono<Env>();

publicRoutes.get("/:username", async (c) => {
  const { username } = c.req.param();
  
  const result = await profileService.getByUsername(username);
  
  if (!result || result.notFound) {
    return c.json({ error: "Profile not found" }, 404);
  }

  if (!result.isPublished) {
    return c.json({ error: "Profile is not published" }, 404);
  }

  return c.json({ data: result.profile });
});

export default publicRoutes;
