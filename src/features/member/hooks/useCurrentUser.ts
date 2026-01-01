import { useQuery } from "@tanstack/react-query";

import { memberApi } from "@/features/member/api/member.api";
import { useAuthStore } from "@/features/member/stores/authStore";

export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { data, error } = await memberApi.getMyProfile();

      if (error) {
        setUser(null);
        throw new Error(error.message);
      }

      setUser(data);
      return data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5분
    retry: false,
  });
}
