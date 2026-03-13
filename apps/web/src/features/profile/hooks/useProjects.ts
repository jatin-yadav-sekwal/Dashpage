import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Project, CreateProjectInput, UpdateProjectInput } from "@shared/types";

export function useMyProjects() {
  return useQuery({
    queryKey: ["myProjects"],
    queryFn: async () => {
      const response = await api.get("/me/projects");
      return response.data as Project[];
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProjectInput) => {
      const response = await api.post("/me/projects", data);
      return response.data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProjects"] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProjectInput }) => {
      const response = await api.patch(`/me/projects/${id}`, data);
      return response.data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProjects"] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/me/projects/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProjects"] });
    },
  });
}

export function useReorderProjects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      await api.patch("/me/projects/reorder", { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProjects"] });
    },
  });
}

export function useUploadProjectImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);

      // Using raw fetch since we need multipart/form-data not JSON
      const supabaseUrl = import.meta.env.VITE_API_URL;
      const { data: { session } } = await import("@/lib/supabase").then(m => m.supabase.auth.getSession());
      
      const response = await fetch(`${supabaseUrl}/api/upload/me/projects/${id}/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Upload failed");
      }

      return response.json() as Promise<{ data: { imageUrl: string } }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProjects"] });
    },
  });
}

export function useDeleteProjectImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/me/projects/${id}/image`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProjects"] });
    },
  });
}
