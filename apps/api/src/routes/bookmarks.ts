import { Hono } from "hono";
import { bookmarkService } from "../services/bookmarkService";
import type { Env } from "../middleware/auth";
import { authMiddleware } from "../middleware/auth";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

type Variables = Env["Variables"];

const router = new Hono<{ Variables: Variables }>();

// Get all bookmarks for the authenticated user
router.get("/", authMiddleware, async (c) => {
  const userId = c.get("userId");
  
  try {
    const bookmarks = await bookmarkService.getUserBookmarks(userId);
    return c.json({ data: bookmarks }, 200);
  } catch (error: any) {
    return c.json({ error: error.message || "Failed to fetch bookmarks" }, 500);
  }
});

// Add a bookmark
const addBookmarkSchema = z.object({
  profileId: z.string().uuid(),
});

router.post(
  "/add",
  authMiddleware,
  zValidator("json", addBookmarkSchema),
  async (c) => {
    const userId = c.get("userId");
    const { profileId } = c.req.valid("json");
    
    try {
      const result = await bookmarkService.addBookmark(userId, profileId);
      return c.json({ data: result }, 200);
    } catch (error: any) {
      if (error.message.includes("violates foreign key constraint")) {
         return c.json({ error: "Profile not found" }, 404);
      }
      if (error.message.includes("duplicate key")) {
         return c.json({ error: "Bookmark already exists" }, 409);
      }
      return c.json({ error: error.message || "Failed to add bookmark" }, 500);
    }
  }
);

// Remove a bookmark
router.delete(
  "/:profileId",
  authMiddleware,
  async (c) => {
    const userId = c.get("userId");
    const profileId = c.req.param("profileId");
    
    try {
      const result = await bookmarkService.removeBookmark(userId, profileId);
      return c.json({ data: result }, 200);
    } catch (error: any) {
      if (error.message.includes("Bookmark not found")) {
         return c.json({ error: "Bookmark not found" }, 404);
      }
      return c.json({ error: error.message || "Failed to remove bookmark" }, 500);
    }
  }
);

export default router;
