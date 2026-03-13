import { db } from "../db";
import { experiences, profiles } from "../db/schema";
import { eq, and, asc } from "drizzle-orm";
import type { CreateExperienceInput, UpdateExperienceInput } from "../validators/experienceValidator";

export const experienceService = {
  /** List experiences by profile ID (sorted) */
  async listByProfileId(profileId: string) {
    return db.query.experiences.findMany({
      where: eq(experiences.profileId, profileId),
      orderBy: [asc(experiences.sortOrder)],
    });
  },

  /** List experiences by username (public) */
  async listByUsername(username: string) {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.username, username),
      columns: { id: true, isPublished: true },
    });
    if (!profile || !profile.isPublished) return null;

    return db.query.experiences.findMany({
      where: eq(experiences.profileId, profile.id),
      orderBy: [asc(experiences.sortOrder)],
    });
  },

  /** Create a new experience */
  async create(profileId: string, data: CreateExperienceInput) {
    // Get current max sort_order
    const existing = await db.query.experiences.findMany({
      where: eq(experiences.profileId, profileId),
      columns: { sortOrder: true },
    });
    const maxOrder = existing.reduce((max, e) => Math.max(max, e.sortOrder), -1);

    const [created] = await db
      .insert(experiences)
      .values({
        profileId,
        title: data.title,
        company: data.company,
        startDate: data.startDate,
        endDate: data.endDate ?? null,
        description: data.description || "",
        sortOrder: maxOrder + 1,
      })
      .returning();

    return created;
  },

  /** Update an experience (only if it belongs to the profile) */
  async update(id: string, profileId: string, data: UpdateExperienceInput) {
    const [updated] = await db
      .update(experiences)
      .set(data)
      .where(and(eq(experiences.id, id), eq(experiences.profileId, profileId)))
      .returning();

    return updated;
  },

  /** Delete an experience (only if it belongs to the profile) */
  async delete(id: string, profileId: string) {
    const [deleted] = await db
      .delete(experiences)
      .where(and(eq(experiences.id, id), eq(experiences.profileId, profileId)))
      .returning();

    return deleted;
  },

  /** Reorder experiences by array of IDs */
  async reorder(profileId: string, ids: string[]) {
    const updates = ids.map((id, index) =>
      db
        .update(experiences)
        .set({ sortOrder: index })
        .where(and(eq(experiences.id, id), eq(experiences.profileId, profileId)))
    );
    await Promise.all(updates);
  },
};
