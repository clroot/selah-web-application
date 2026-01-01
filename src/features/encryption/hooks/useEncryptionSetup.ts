import { useState, useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { useEncryptionStore } from '@/shared/stores/encryptionStore';

/**
 * PIN 설정 및 복구 키 관리를 위한 훅
 * 회원가입 완료 후 암호화 설정 플로우에서 사용
 */
export function useEncryptionSetup() {
  const router = useRouter();
  const setupEncryption = useEncryptionStore((state) => state.setupEncryption);
  const isUnlocked = useEncryptionStore((state) => state.isUnlocked);
  const pendingRecoveryKey = useEncryptionStore(
    (state) => state.pendingRecoveryKey
  );
  const clearPendingRecoveryKey = useEncryptionStore(
    (state) => state.clearPendingRecoveryKey
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * PIN 설정 완료 처리
   * @param pin 6자리 PIN
   */
  const handlePinSetup = useCallback(
    async (pin: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // 암호화 설정 (PIN으로 KEK 파생 + Server Key 결합)
        await setupEncryption(pin);

        // 복구 키 페이지로 이동
        router.push('/recovery-key');
      } catch (e) {
        setError(e instanceof Error ? e.message : '암호화 설정에 실패했습니다');
      } finally {
        setIsLoading(false);
      }
    },
    [setupEncryption, router]
  );

  /**
   * 복구 키 확인 완료 처리
   */
  const handleRecoveryKeyConfirm = useCallback(() => {
    clearPendingRecoveryKey();
    router.push('/');
  }, [clearPendingRecoveryKey, router]);

  return {
    isLoading,
    error,
    recoveryKey: pendingRecoveryKey,
    isUnlocked,
    handlePinSetup,
    handleRecoveryKeyConfirm,
  };
}
