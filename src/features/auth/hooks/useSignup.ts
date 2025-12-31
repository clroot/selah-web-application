import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useEncryptionStore } from '@/features/encryption/stores/encryptionStore';
import { memberApi } from '@/features/member/api/member.api';

import type { SignupFormData } from '@/features/auth/utils/schemas';

export function useSignup() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setupEncryption = useEncryptionStore((state) => state.setupEncryption);
  const [recoveryKey, setRecoveryKey] = useState<string | null>(null);

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

      return { result: result!, password: data.password };
    },
    onSuccess: async ({ password }) => {
      // 인증 상태 설정
      setAuthenticated(true);

      // 암호화 설정 (로그인 비밀번호로 KEK 생성, DEK 암호화)
      const key = await setupEncryption(password);
      setRecoveryKey(key);

      // 프로필 조회
      const { data: profile } = await memberApi.getMyProfile();
      if (profile) {
        setUser(profile);
      }

      // 복구 키 표시 페이지로 이동
      router.push('/recovery-key');
    },
  });

  return {
    ...mutation,
    recoveryKey,
    clearRecoveryKey: () => setRecoveryKey(null),
  };
}
