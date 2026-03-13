import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Profile, CreateProfileInput, UpdateProfileInput } from "@shared/types";

export function useMyProfile() {
  return useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const response = await api.get("/me/profile");
      return response as { data: Profile | null; hasProfile: boolean };
    },
  });
}

export function useProfileByUsername(username: string) {
  return useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const response = await api.get(`/profiles/${username}`);
      // Based on our generic api.ts, it returns the body. We need to cast it.
      return response as { data: any }; // Using any here because it's a nested structure
    },
    enabled: !!username, // Only run query if username is valid
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProfileInput) => {
      const response = await api.post("/me/profile", data);
      return response.data as Profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileInput) => {
      const response = await api.patch("/me/profile", data);
      return response.data as Profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      // Using raw fetch since we need multipart/form-data not JSON
      const supabaseUrl = import.meta.env.VITE_API_URL;
      const { data: { session } } = await import("@/lib/supabase").then(m => m.supabase.auth.getSession());
      
      const response = await fetch(`${supabaseUrl}/api/upload/me/avatar`, {
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

      return response.json() as Promise<{ data: { avatarUrl: string } }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}
