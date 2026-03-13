import { db } from "../db";
import { bookmarks, profiles } from "../db/schema";
import { eq, and } from "drizzle-orm";

export const bookmarkService = {
  // Add a bookmark for a specific user and profile
  async addBookmark(userId: string, profileId: string) {
    // First, verify the profile exists
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, profileId),
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    // Check if bookmark already exists
    const existing = await db.query.bookmarks.findFirst({
      where: and(
        eq(bookmarks.userId, userId),
        eq(bookmarks.profileId, profileId)
      )
    });

    if (existing) {
      throw new Error("Bookmark already exists");
    }

    // Insert new bookmark
    await db.insert(bookmarks).values({
      userId,
      profileId,
    });

    return { action: "added", profileId };
  },

  // Remove a bookmark for a specific user and profile
  async removeBookmark(userId: string, profileId: string) {
    // Check if bookmark exists
    const existing = await db.query.bookmarks.findFirst({
      where: and(
        eq(bookmarks.userId, userId),
        eq(bookmarks.profileId, profileId)
      )
    });

    if (!existing) {
      throw new Error("Bookmark not found");
    }

    // Delete the bookmark
    await db.delete(bookmarks).where(eq(bookmarks.id, existing.id));

    return { action: "removed", profileId };
  },

  // Get all bookmarks for a specific user, including the profile data
  async getUserBookmarks(userId: string) {
    const userBookmarks = await db.query.bookmarks.findMany({
      where: eq(bookmarks.userId, userId),
      with: {
        profile: {
          with: {
            tags: true,
          },
        },
      },
      orderBy: (bookmarks, { desc }) => [desc(bookmarks.createdAt)]
    });

    // Transform to match frontend expectations
    return userBookmarks.map(bookmark => ({
      ...bookmark,
      profile: bookmark.profile ? {
        ...bookmark.profile,
        tags: bookmark.profile.tags.map((t: any) => t.tag),
      } : undefined,
    }));
  }
};
