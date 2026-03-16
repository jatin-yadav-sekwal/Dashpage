import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { api } from "@/lib/api";

const STALE_TIME = 1000 * 60 * 3;
const THEME_STALE_TIME = 1000 * 60 * 10;

export function usePrefetchDashboardData() {
  const queryClient = useQueryClient();

  const prefetchAll = useCallback(async () => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["myExperiences"],
        queryFn: async () => {
          const response = await api.get("/me/experiences");
          return response.data;
        },
        staleTime: STALE_TIME,
      }),
      queryClient.prefetchQuery({
        queryKey: ["myEducations"],
        queryFn: async () => {
          const response = await api.get("/me/educations");
          return response.data;
        },
        staleTime: STALE_TIME,
      }),
      queryClient.prefetchQuery({
        queryKey: ["myProjects"],
        queryFn: async () => {
          const response = await api.get("/me/projects");
          return response.data;
        },
        staleTime: STALE_TIME,
      }),
      queryClient.prefetchQuery({
        queryKey: ["myTags"],
        queryFn: async () => {
          const response = await api.get("/me/tags");
          return response.data;
        },
        staleTime: STALE_TIME,
      }),
      queryClient.prefetchQuery({
        queryKey: ["themes"],
        queryFn: async () => {
          const res = await api.get("/themes");
          return res.data;
        },
        staleTime: THEME_STALE_TIME,
      }),
    ]);
  }, [queryClient]);

  return { prefetchAll };
}
