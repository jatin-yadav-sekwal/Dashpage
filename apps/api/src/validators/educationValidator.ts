import { z } from "zod";

export const createEducationSchema = z.object({
  degree: z.string().min(1, "Degree is required").max(100),
  institution: z.string().min(1, "Institution is required").max(100),
  startYear: z.number().int().min(1900).max(2100),
  endYear: z.number().int().min(1900).max(2100).nullable().optional(),
  description: z.string().max(1000).nullable().optional(),
});

export const updateEducationSchema = z.object({
  degree: z.string().min(1).max(100).optional(),
  institution: z.string().min(1).max(100).optional(),
  startYear: z.number().int().min(1900).max(2100).optional(),
  endYear: z.number().int().min(1900).max(2100).nullable().optional(),
  description: z.string().max(1000).nullable().optional(),
});

export const reorderEducationSchema = z.object({
  ids: z.array(z.string().uuid()),
});

export type CreateEducationInput = z.infer<typeof createEducationSchema>;
export type UpdateEducationInput = z.infer<typeof updateEducationSchema>;
