import { z } from "zod";

export const createProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores")
    .transform((val) => val.toLowerCase()),
  fullName: z.string().min(1, "Full name is required").max(100),
  dateOfBirth: z.string().optional().nullable(),
  profession: z.string().max(100).optional().nullable(),
  tagline: z.string().max(150).optional().default(""),
  bio: z.string().max(1000).optional().default(""),
  email: z.string().email("Invalid email"),
  phone: z.string().max(20).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  socialLinks: z.record(z.string(), z.string().url().or(z.literal("")))
    .optional()
    .default({}),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  dateOfBirth: z.string().optional().nullable(),
  profession: z.string().max(100).optional().nullable(),
  tagline: z.string().max(150).optional(),
  bio: z.string().max(1000).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  socialLinks: z.record(z.string(), z.string().url().or(z.literal(""))).optional(),
  avatarUrl: z.string().url().optional().nullable(),
  themeId: z.string().uuid().optional().nullable(),
  isPublished: z.boolean().optional(),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
