import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authApi } from "@/features/member/api/auth.api";
import { useAuthStore } from "@/features/member/stores/authStore";
import { useEncryptionStore } from "@/shared/stores/encryptionStore";

interface UseLogoutOptions {
  logoutAll?: boolean;
}

export function useLogout(options: UseLogoutOptions = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const lock = useEncryptionStore((state) => state.lock);

  return useMutation({
    mutationFn: async () => {
      const { error } = options.logoutAll
        ? await authApi.logoutAll()
        : await authApi.logout();

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      // 인증 상태 초기화
      logout();

      // 암호화 잠금 (DEK 폐기)
      lock();

      // 쿼리 캐시 전체 클리어
      queryClient.clear();

      // 로그인 페이지로 이동
      router.push("/login");
    },
  });
}
