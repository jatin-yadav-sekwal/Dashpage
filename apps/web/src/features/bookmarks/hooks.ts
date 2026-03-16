import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Cache configuration for bookmarks
const STALE_TIME = 1000 * 60 * 2; // 2 minutes
const CACHE_TIME = 1000 * 60 * 5; // 5 minutes

export interface BookmarkData {
  id: string;
  userId: string;
  profileId: string;
  createdAt: string;
  profile?: {
    id: string;
    username: string;
    fullName: string;
    tagline: string;
    avatarUrl: string | null;
    tags?: string[];
  };
}

export function useMyBookmarks(enabled: boolean = true) {
  return useQuery({
    queryKey: ["myBookmarks"],
    queryFn: async () => {
      const response = await api.get<{ data: BookmarkData[] }>("/me/bookmarks/");
      return response;
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled, // Only run query when enabled
  });
}

export function useAddBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileId: string) => {
      const response = await api.post<{ data: { action: "added"; profileId: string } }>("/me/bookmarks/add", { profileId });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookmarks"] });
    },
  });
}

export function useRemoveBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileId: string) => {
      const response = await api.delete<{ data: { action: "removed"; profileId: string } }>(`/me/bookmarks/${profileId}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookmarks"] });
    },
  });
}

// Combined hook for bookmark button component
export function useBookmark(enabled: boolean = true) {
  const { data: bookmarksResp } = useMyBookmarks(enabled);
  const addMutation = useAddBookmark();
  const removeMutation = useRemoveBookmark();

  const isBookmarked = (profileId: string) => {
    return bookmarksResp?.data?.some(b => b.profileId === profileId) || false;
  };

  const toggleBookmark = async (profileId: string, isCurrentlyBookmarked: boolean) => {
    if (isCurrentlyBookmarked) {
      return await removeMutation.mutateAsync(profileId);
    } else {
      return await addMutation.mutateAsync(profileId);
    }
  };

  return {
    isBookmarked,
    toggleBookmark,
    isLoading: addMutation.isPending || removeMutation.isPending,
    addBookmark: addMutation.mutateAsync,
    removeBookmark: removeMutation.mutateAsync,
  };
}
