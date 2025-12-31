'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useSignup } from '@/features/auth/hooks';
import { RecoveryKeyDisplay } from '@/features/encryption/components/RecoveryKeyDisplay';
import { FullPageSpinner } from '@/shared/components';

export default function RecoveryKeyPage() {
  const router = useRouter();
  const { recoveryKey, clearRecoveryKey } = useSignup();

  useEffect(() => {
    // 복구 키가 없으면 홈으로 리다이렉트
    if (!recoveryKey) {
      router.replace('/');
    }
  }, [recoveryKey, router]);

  const handleComplete = () => {
    clearRecoveryKey();
    router.push('/');
  };

  if (!recoveryKey) {
    return <FullPageSpinner />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
      <div className="w-full max-w-sm">
        <RecoveryKeyDisplay recoveryKey={recoveryKey} onComplete={handleComplete} />
      </div>
    </div>
  );
}
