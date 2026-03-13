import { db } from "../db";
import { projects, profiles } from "../db/schema";
import { eq, and, asc } from "drizzle-orm";
import type { CreateProjectInput, UpdateProjectInput } from "../validators/projectValidator";

export const projectService = {
  /** List projects by profile ID (sorted) */
  async listByProfileId(profileId: string) {
    return db.query.projects.findMany({
      where: eq(projects.profileId, profileId),
      orderBy: [asc(projects.sortOrder)],
    });
  },

  /** List projects by username (public) */
  async listByUsername(username: string) {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.username, username),
      columns: { id: true, isPublished: true },
    });
    if (!profile || !profile.isPublished) return null;

    return db.query.projects.findMany({
      where: eq(projects.profileId, profile.id),
      orderBy: [asc(projects.sortOrder)],
    });
  },

  /** Create a new project */
  async create(profileId: string, data: CreateProjectInput) {
    const existing = await db.query.projects.findMany({
      where: eq(projects.profileId, profileId),
      columns: { sortOrder: true },
    });
    const maxOrder = existing.reduce((max, p) => Math.max(max, p.sortOrder), -1);

    const [created] = await db
      .insert(projects)
      .values({
        profileId,
        title: data.title,
        description: data.description || "",
        imageUrl: data.imageUrl ?? null,
        projectUrl: data.projectUrl ?? null,
        sortOrder: maxOrder + 1,
      })
      .returning();

    return created;
  },

  /** Update a project (only if it belongs to the profile) */
  async update(id: string, profileId: string, data: UpdateProjectInput) {
    const [updated] = await db
      .update(projects)
      .set(data)
      .where(and(eq(projects.id, id), eq(projects.profileId, profileId)))
      .returning();

    return updated;
  },

  /** Delete a project (only if it belongs to the profile) */
  async delete(id: string, profileId: string) {
    const [deleted] = await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.profileId, profileId)))
      .returning();

    return deleted;
  },

  /** Reorder projects by array of IDs */
  async reorder(profileId: string, ids: string[]) {
    const updates = ids.map((id, index) =>
      db
        .update(projects)
        .set({ sortOrder: index })
        .where(and(eq(projects.id, id), eq(projects.profileId, profileId)))
    );
    await Promise.all(updates);
  },
};
