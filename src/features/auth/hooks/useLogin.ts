import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useEncryptionStore } from '@/features/encryption/stores/encryptionStore';
import { memberApi } from '@/features/member/api/member.api';

import type { LoginFormData } from '@/features/auth/utils/schemas';

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const unlockWithPassword = useEncryptionStore(
    (state) => state.unlockWithPassword
  );

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const { data: result, error } = await authApi.login({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return { result: result!, password: data.password };
    },
    onSuccess: async ({ password }) => {
      // 인증 상태 설정 (프로필 조회 전)
      setAuthenticated(true);

      // 암호화 해제 (로그인 비밀번호로 DEK 복호화)
      try {
        await unlockWithPassword(password);
      } catch (e) {
        // 암호화 해제 실패해도 로그인은 성공으로 처리
        // (신규 사용자이거나 암호화 설정이 없는 경우)
        console.warn('암호화 해제 실패:', e);
      }

      // 프로필 조회
      const { data: profile } = await memberApi.getMyProfile();
      if (profile) {
        setUser(profile);
      }

      // 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });

      // 홈으로 이동
      router.push('/');
    },
  });
}
