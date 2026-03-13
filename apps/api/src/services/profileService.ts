import { db } from "../db";
import { profiles, profileTags, experiences, educations, projects, themes } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import type { CreateProfileInput, UpdateProfileInput } from "../validators/profileValidator";

export const profileService = {
  /** Get a public profile by username with all related data */
  async getByUsername(username: string) {
    const profile = await db.query.profiles.findFirst({
      where: sql`LOWER(${profiles.username}) = LOWER(${username})`,
      with: {
        experiences: { orderBy: (exp, { asc }) => [asc(exp.sortOrder)] },
        educations: { orderBy: (edu, { asc }) => [asc(edu.sortOrder)] },
        projects: { orderBy: (proj, { asc }) => [asc(proj.sortOrder)] },
        tags: true,
        theme: true,
      },
    });

    if (!profile) return null;
    if (!profile.isPublished) return null; // Don't expose unpublished profiles

    return {
      ...profile,
      tags: profile.tags.map((t) => t.tag),
      theme: profile.theme?.config ?? null,
    };
  },

  /** Get own profile by Supabase user ID */
  async getByUserId(userId: string) {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
      with: {
        experiences: { orderBy: (exp, { asc }) => [asc(exp.sortOrder)] },
        educations: { orderBy: (edu, { asc }) => [asc(edu.sortOrder)] },
        projects: { orderBy: (proj, { asc }) => [asc(proj.sortOrder)] },
        tags: true,
        theme: true,
      },
    });

    if (!profile) return null;

    return {
      ...profile,
      tags: profile.tags.map((t) => t.tag),
      theme: profile.theme?.config ?? null,
    };
  },

  /** Create a new profile */
  async create(userId: string, data: CreateProfileInput) {
    const [profile] = await db
      .insert(profiles)
      .values({
        userId,
        username: data.username,
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth || null,
        profession: data.profession || null,
        tagline: data.tagline || "",
        bio: data.bio || "",
        email: data.email,
        phone: data.phone || null,
        location: data.location || null,
        socialLinks: data.socialLinks as any || {},
      })
      .returning();

    return profile;
  },

  /** Update an existing profile */
  async update(userId: string, data: UpdateProfileInput) {
    const [updated] = await db
      .update(profiles)
      .set({
        ...data,
        socialLinks: data.socialLinks as any,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, userId))
      .returning();

    return updated;
  },

  /** Check if a username is available */
  async checkUsername(username: string) {
    const existing = await db.query.profiles.findFirst({
      where: eq(profiles.username, username.toLowerCase()),
      columns: { id: true },
    });
    return !existing;
  },
};
