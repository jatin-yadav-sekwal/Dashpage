import { db } from "../db";
import { educations, profiles } from "../db/schema";
import { eq, and, asc } from "drizzle-orm";
import type { CreateEducationInput, UpdateEducationInput } from "../validators/educationValidator";

export const educationService = {
  /** List educations by profile ID (sorted) */
  async listByProfileId(profileId: string) {
    return db.query.educations.findMany({
      where: eq(educations.profileId, profileId),
      orderBy: [asc(educations.sortOrder)],
    });
  },

  /** List educations by username (public) */
  async listByUsername(username: string) {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.username, username),
      columns: { id: true, isPublished: true },
    });
    if (!profile || !profile.isPublished) return null;

    return db.query.educations.findMany({
      where: eq(educations.profileId, profile.id),
      orderBy: [asc(educations.sortOrder)],
    });
  },

  /** Create a new education entry */
  async create(profileId: string, data: CreateEducationInput) {
    const existing = await db.query.educations.findMany({
      where: eq(educations.profileId, profileId),
      columns: { sortOrder: true },
    });
    const maxOrder = existing.reduce((max, e) => Math.max(max, e.sortOrder), -1);

    const [created] = await db
      .insert(educations)
      .values({
        profileId,
        degree: data.degree,
        institution: data.institution,
        startYear: data.startYear,
        endYear: data.endYear ?? null,
        description: data.description ?? null,
        sortOrder: maxOrder + 1,
      })
      .returning();

    return created;
  },

  /** Update an education (only if it belongs to the profile) */
  async update(id: string, profileId: string, data: UpdateEducationInput) {
    const [updated] = await db
      .update(educations)
      .set(data)
      .where(and(eq(educations.id, id), eq(educations.profileId, profileId)))
      .returning();

    return updated;
  },

  /** Delete an education (only if it belongs to the profile) */
  async delete(id: string, profileId: string) {
    const [deleted] = await db
      .delete(educations)
      .where(and(eq(educations.id, id), eq(educations.profileId, profileId)))
      .returning();

    return deleted;
  },

  /** Reorder educations by array of IDs */
  async reorder(profileId: string, ids: string[]) {
    const updates = ids.map((id, index) =>
      db
        .update(educations)
        .set({ sortOrder: index })
        .where(and(eq(educations.id, id), eq(educations.profileId, profileId)))
    );
    await Promise.all(updates);
  },
};
