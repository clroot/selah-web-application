import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { memberApi } from '@/features/member/api/member.api';

import type { LoginFormData } from '@/features/auth/utils/schemas';

/**
 * 로그인 훅
 *
 * 로그인과 암호화 해제가 분리됨:
 * - 로그인: 이메일 + 비밀번호 (인증)
 * - 암호화 해제: 6자리 PIN (별도 입력 필요, IndexedDB 캐시 있으면 생략)
 */
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const { data: result, error } = await authApi.login({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return result!;
    },
    onSuccess: async () => {
      // 인증 상태 설정 (프로필 조회 전)
      setAuthenticated(true);

      // 프로필 조회
      const { data: profile } = await memberApi.getMyProfile();
      if (profile) {
        setUser(profile);
      }

      // 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });

      // 홈으로 이동
      // TODO: 암호화 설정 여부 확인 후 PIN 입력 화면으로 이동할 수 있음
      router.push('/');
    },
  });
}
