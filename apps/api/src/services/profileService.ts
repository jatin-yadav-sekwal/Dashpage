import { getDb } from "../db";
import { eq, desc, and } from "drizzle-orm";
import { profiles, profileTags, experiences, educations, projects, themes } from "../db/schema";
import type { CreateProfileInput, UpdateProfileInput } from "../validators/profileValidator";

const db = getDb();

export const profileService = {
  /** Get a public profile by username with all related data */
  async getByUsername(username: string) {
    console.log(`[ProfileService] Looking for username: "${username}"`);
    
    try {
      const normalizedUsername = username.toLowerCase().trim();

      // Optimize: Quick check first for existence and publication status
      // This avoids heavy relational joins for non-existent or unpublished profiles
      const profileInfo = await db.query.profiles.findFirst({
        where: eq(profiles.username, normalizedUsername),
        columns: { id: true, isPublished: true },
      });

      if (!profileInfo) {
        console.log(`[ProfileService] Profile NOT found for: "${normalizedUsername}"`);
        return { notFound: true, isPublished: false, profile: null };
      }

      if (!profileInfo.isPublished) {
        console.log(`[ProfileService] Profile not published: "${normalizedUsername}"`);
        return { notFound: false, isPublished: false, profile: null };
      }

      // Now fetch full profile with relations (since we know it exists and is published)
      const result = await db.query.profiles.findFirst({
        where: eq(profiles.id, profileInfo.id),
        with: {
          experiences: {
            orderBy: [desc(experiences.sortOrder)],
          },
          educations: {
            orderBy: [desc(educations.sortOrder)],
          },
          projects: {
            orderBy: [desc(projects.sortOrder)],
          },
          tags: true,
          theme: true,
        },
      });

      if (!result) {
        // This shouldn't really happen since we just checked existence, 
        // but handling for consistency/race conditions.
        return { notFound: true, isPublished: false, profile: null };
      }
      
      console.log(`[ProfileService] Profile found! isPublished: ${result.isPublished}`);
      
      if (!result.isPublished) {
        console.log(`[ProfileService] Profile not published: "${normalizedUsername}"`);
        return { notFound: false, isPublished: false, profile: null };
      }

      console.log(`[ProfileService] Returning profile for: "${normalizedUsername}"`);
      
      return {
        notFound: false,
        isPublished: true,
        profile: {
          id: result.id,
          userId: result.userId,
          username: result.username,
          fullName: result.fullName,
          tagline: result.tagline,
          bio: result.bio,
          avatarUrl: result.avatarUrl,
          email: result.email,
          phone: result.phone,
          dateOfBirth: result.dateOfBirth,
          profession: result.profession,
          location: result.location,
          socialLinks: result.socialLinks,
          themeId: result.themeId,
          isPublished: result.isPublished,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
          experiences: (result.experiences || []).map((e) => ({
            id: e.id,
            title: e.title,
            company: e.company,
            location: null,
            startDate: e.startDate,
            endDate: e.endDate,
            description: e.description,
            sortOrder: e.sortOrder,
          })),
          educations: (result.educations || []).map((e) => ({
            id: e.id,
            school: e.institution,
            degree: e.degree,
            fieldOfStudy: null,
            startDate: e.startYear,
            endDate: e.endYear,
            description: e.description,
            sortOrder: e.sortOrder,
          })),
          projects: (result.projects || []).map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            imageUrl: p.imageUrl,
            projectUrl: p.projectUrl,
            sortOrder: p.sortOrder,
          })),
          tags: (result.tags || []).map((t) => t.tag),
          theme: result.theme ? {
            id: result.theme.id,
            name: result.theme.name,
            slug: result.theme.slug,
            previewImage: result.theme.previewImage,
            isPremium: result.theme.isPremium,
            price: result.theme.price,
            colors: result.theme.config?.colors || {},
            fonts: result.theme.config?.fonts || { heading: "Inter", body: "Inter" },
            borderRadius: result.theme.config?.borderRadius || "0.5rem",
            heroStyle: result.theme.config?.heroStyle || "split",
            experienceStyle: result.theme.config?.experienceStyle || "timeline",
            educationStyle: result.theme.config?.educationStyle || "timeline",
            projectsStyle: result.theme.config?.projectsStyle || "grid",
          } : null,
        }
      };
    } catch (error) {
      console.error(`[ProfileService] Error querying profile "${username}":`, error);
      throw error;
    }
  },

  /** Get own profile by Supabase user ID */
  async getByUserId(userId: string) {
    try {
      const result = await db.query.profiles.findFirst({
        where: eq(profiles.userId, userId),
        with: {
          experiences: {
            orderBy: [desc(experiences.sortOrder)],
          },
          educations: {
            orderBy: [desc(educations.sortOrder)],
          },
          projects: {
            orderBy: [desc(projects.sortOrder)],
          },
          tags: true,
          theme: true,
        },
      });

      if (!result) return null;

      return {
        id: result.id,
        userId: result.userId,
        username: result.username,
        fullName: result.fullName,
        tagline: result.tagline,
        bio: result.bio,
        avatarUrl: result.avatarUrl,
        email: result.email,
        phone: result.phone,
        dateOfBirth: result.dateOfBirth,
        profession: result.profession,
        location: result.location,
        socialLinks: result.socialLinks,
        themeId: result.themeId,
        isPublished: result.isPublished,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        experiences: result.experiences || [],
        educations: result.educations || [],
        projects: (result.projects || []).map((p) => ({
          id: p.id,
          profileId: p.profileId,
          title: p.title,
          description: p.description,
          imageUrl: p.imageUrl,
          projectUrl: p.projectUrl,
          sortOrder: p.sortOrder,
        })),
        tags: (result.tags || []).map((t) => t.tag),
        theme: result.theme,
      };
    } catch (error) {
      console.error("[ProfileService] Error in getByUserId:", error);
      throw error;
    }
  },

  /** Create a new profile */
  async create(userId: string, data: CreateProfileInput) {
    const [result] = await db.insert(profiles).values({
      userId,
      username: data.username.toLowerCase(),
      fullName: data.fullName,
      tagline: data.tagline || "",
      bio: data.bio || "",
      email: data.email,
      phone: data.phone || null,
      dateOfBirth: data.dateOfBirth || null,
      profession: data.profession || null,
      location: data.location || null,
      socialLinks: data.socialLinks || {},
    }).returning();
    
    return result;
  },

  /** Update an existing profile */
  async update(userId: string, data: UpdateProfileInput) {
    console.log("[ProfileService] Updating profile for user:", userId, "with data:", data);
    
    try {
      const updateData: Record<string, any> = {};
      
      if (data.fullName !== undefined) updateData.fullName = data.fullName;
      if (data.tagline !== undefined) updateData.tagline = data.tagline;
      if (data.bio !== undefined) updateData.bio = data.bio;
      if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.dateOfBirth !== undefined) updateData.dateOfBirth = data.dateOfBirth;
      if (data.profession !== undefined) updateData.profession = data.profession;
      if (data.location !== undefined) updateData.location = data.location;
      if (data.socialLinks !== undefined) updateData.socialLinks = data.socialLinks;
      if (data.themeId !== undefined) updateData.themeId = data.themeId;
      if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;
      
      updateData.updatedAt = new Date();
      
      const [result] = await db
        .update(profiles)
        .set(updateData)
        .where(eq(profiles.userId, userId))
        .returning();
      
      console.log("[ProfileService] Updated profile result:", result);
      return result;
    } catch (error) {
      console.error("[ProfileService] Error updating profile:", error);
      throw error;
    }
  },

  /** Check if a username is available */
  async checkUsername(username: string) {
    const result = await db.query.profiles.findFirst({
      where: eq(profiles.username, username.toLowerCase()),
      columns: { id: true },
    });
    return !result;
  },
};
