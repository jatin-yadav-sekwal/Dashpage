import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useMyTags(username?: string) {
  return useQuery({
    queryKey: ["myTags", username],
    queryFn: async () => {
      if (!username) return [];
      // GET /api/profiles/:username/tags
      const response = await api.get(`/profiles/${username}/tags`);
      return response.data as string[];
    },
    enabled: !!username,
  });
}

export function useUserTags(username: string) {
  return useQuery({
    queryKey: ["tags", username],
    queryFn: async () => {
      if (!username) return [];
      const response = await api.get(`/profiles/${username}/tags`);
      return response.data as string[];
    },
    enabled: !!username,
  });
}

export function useReplaceTags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tags: string[]) => {
      const response = await api.put("/me/tags", { tags });
      return response.data as string[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTags"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}
