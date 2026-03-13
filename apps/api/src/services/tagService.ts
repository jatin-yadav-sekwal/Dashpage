import { db } from "../db";
import { profileTags, profiles } from "../db/schema";
import { eq } from "drizzle-orm";

const MAX_TAGS = 20;

export const tagService = {
  /** Get tags for a profile by profileId */
  async getByProfileId(profileId: string): Promise<string[]> {
    const tags = await db.query.profileTags.findMany({
      where: eq(profileTags.profileId, profileId),
    });
    return tags.map((t) => t.tag);
  },

  /** Get tags by username (public — checks isPublished) */
  async getByUsername(username: string): Promise<string[] | null> {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.username, username),
      columns: { id: true, isPublished: true },
    });
    if (!profile || !profile.isPublished) return null;

    const tags = await db.query.profileTags.findMany({
      where: eq(profileTags.profileId, profile.id),
    });
    return tags.map((t) => t.tag);
  },

  /** Replace all tags for a profile (delete existing + insert new) */
  async replaceTags(profileId: string, tags: string[]) {
    // Normalize + deduplicate + limit
    const normalized = [...new Set(
      tags
        .map((t) => t.toLowerCase().trim())
        .filter((t) => t.length > 0)
    )].slice(0, MAX_TAGS);

    // Delete existing tags
    await db.delete(profileTags).where(eq(profileTags.profileId, profileId));

    // Insert new tags
    if (normalized.length > 0) {
      await db.insert(profileTags).values(
        normalized.map((tag) => ({ profileId, tag }))
      );
    }

    return normalized;
  },
};
