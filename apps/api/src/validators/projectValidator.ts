import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(1000).optional().default(""),
  imageUrl: z.string().url().nullable().optional(),
  projectUrl: z.string().url().nullable().optional(),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().url().nullable().optional(),
  projectUrl: z.string().url().nullable().optional(),
});

export const reorderProjectSchema = z.object({
  ids: z.array(z.string().uuid()),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
