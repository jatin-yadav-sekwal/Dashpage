import { z } from "zod";

export const createExperienceSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  company: z.string().min(1, "Company is required").max(100),
  startDate: z.string().min(1, "Start date is required"), // ISO date string
  endDate: z.string().nullable().optional(),
  description: z.string().max(1000).optional().default(""),
});

export const updateExperienceSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  company: z.string().min(1).max(100).optional(),
  startDate: z.string().optional(),
  endDate: z.string().nullable().optional(),
  description: z.string().max(1000).optional(),
});

export const reorderSchema = z.object({
  ids: z.array(z.string().uuid()),
});

export type CreateExperienceInput = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>;
