import { Hono } from "hono";
import { themeService } from "../services/themeService";
import type { Variables, Bindings, Env } from "../middleware/auth";
import { authMiddleware } from "../middleware/auth";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { verify } from "hono/jwt";
import { getSupabasePublicKey } from "../utils/jwks";

const router = new Hono<{ Bindings: Bindings; Variables: Variables }>();

router.get("/", async (c) => {
  const authHeader = c.req.header("Authorization");
  let userId: string | undefined = undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "").trim();
    try {
      const publicKey = await getSupabasePublicKey(token);
      const payload = await verify(token, publicKey, "ES256");
      userId = payload.sub as string;
    } catch (e) {
      // Ignore auth errors, just treat as public
    }
  }

  const allThemes = await themeService.getAllThemes(userId);
  
  c.header("Cache-Control", "public, max-age=300, s-maxage=600");
  return c.json({ data: allThemes });
});

router.post("/seed", async (c) => {
  try {
    await themeService.seedDefaultThemes();
    return c.json({ status: "success", message: "Themes seeded if missing" });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

const applyThemeSchema = z.object({
  themeId: z.string().uuid()
});

router.post(
  "/",
  authMiddleware,
  zValidator("json", applyThemeSchema),
  async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const { themeId } = c.req.valid("json");

    try {
      const updatedProfile = await themeService.applyTheme(userId, themeId);
      return c.json({ data: updatedProfile });
    } catch (e: any) {
      return c.json({ error: e.message }, 400);
    }
  }
);

export default router;
