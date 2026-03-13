import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

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

export function useMyBookmarks() {
  return useQuery({
    queryKey: ["myBookmarks"],
    queryFn: async () => {
      const response = await api.get<{ data: BookmarkData[] }>("/me/bookmarks/");
      return response;
    },
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
export function useBookmark() {
  const { data: bookmarksResp } = useMyBookmarks();
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
