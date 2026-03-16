import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Profile, CreateProfileInput, UpdateProfileInput } from "@shared/types";

// Cache configuration for profile data
const PROFILE_STALE_TIME = 1000 * 60 * 3; // 3 minutes
const PROFILE_CACHE_TIME = 1000 * 60 * 10; // 10 minutes

export function useMyProfile() {
  return useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const response = await api.get("/me/profile");
      return response as { data: Profile | null; hasProfile: boolean };
    },
    staleTime: PROFILE_STALE_TIME,
    gcTime: PROFILE_CACHE_TIME,
  });
}

export function useProfileByUsername(username: string) {
  return useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const response = await api.get(`/${username}`);
      return response as { data: any };
    },
    staleTime: 1000 * 30, // 30 seconds - public profiles should update faster
    gcTime: PROFILE_CACHE_TIME,
    enabled: !!username,
    refetchOnMount: true,
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
