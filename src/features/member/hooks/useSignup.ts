import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import { authApi } from "@/features/member/api/auth.api";
import { memberApi } from "@/features/member/api/member.api";
import { useAuthStore } from "@/features/member/stores/authStore";

import type { SignupFormData } from "@/features/member/utils/schemas";

export function useSignup() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const mutation = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const { data: result, error } = await authApi.register({
        email: data.email,
        password: data.password,
        nickname: data.nickname,
      });

      if (error) {
        throw new Error(error.message);
      }

      return result!;
    },
    onSuccess: async () => {
      // 인증 상태 설정
      setAuthenticated(true);

      // 프로필 조회
      const { data: profile } = await memberApi.getMyProfile();
      if (profile) {
        setUser(profile);
      }

      // PIN 설정 페이지로 이동 (암호화는 PIN으로 설정)
      router.push("/setup-encryption");
    },
  });

  return mutation;
}
