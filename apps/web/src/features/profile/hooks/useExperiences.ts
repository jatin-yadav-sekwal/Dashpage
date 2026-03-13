import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Experience, CreateExperienceInput, UpdateExperienceInput } from "@shared/types";

export function useMyExperiences() {
  return useQuery({
    queryKey: ["myExperiences"],
    queryFn: async () => {
      const response = await api.get("/me/experiences");
      return response.data as Experience[];
    },
  });
}

export function useCreateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateExperienceInput) => {
      const response = await api.post("/me/experiences", data);
      return response.data as Experience;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myExperiences"] });
    },
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateExperienceInput }) => {
      const response = await api.patch(`/me/experiences/${id}`, data);
      return response.data as Experience;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myExperiences"] });
    },
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/me/experiences/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myExperiences"] });
    },
  });
}

export function useReorderExperiences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      await api.patch("/me/experiences/reorder", { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myExperiences"] });
    },
  });
}
