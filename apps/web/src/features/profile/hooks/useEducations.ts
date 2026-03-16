import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Education, CreateEducationInput, UpdateEducationInput } from "@shared/types";

// Cache configuration for education data
const STALE_TIME = 1000 * 60 * 3; // 3 minutes
const CACHE_TIME = 1000 * 60 * 10; // 10 minutes

export function useMyEducations() {
  return useQuery({
    queryKey: ["myEducations"],
    queryFn: async () => {
      const response = await api.get("/me/educations");
      return response.data as Education[];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
}

export function useCreateEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEducationInput) => {
      const response = await api.post("/me/educations", data);
      return response.data as Education;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myEducations"] });
    },
  });
}

export function useUpdateEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateEducationInput }) => {
      const response = await api.patch(`/me/educations/${id}`, data);
      return response.data as Education;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myEducations"] });
    },
  });
}

export function useDeleteEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/me/educations/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myEducations"] });
    },
  });
}

export function useReorderEducations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      await api.patch("/me/educations/reorder", { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myEducations"] });
    },
  });
}
