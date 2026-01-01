"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { RecoveryKeyDisplay } from "@/features/encryption/components";
import { useEncryptionSetup } from "@/features/encryption/hooks";
import { FullPageSpinner } from "@/shared/components";

export default function RecoveryKeyPage() {
  const router = useRouter();
  const { recoveryKey, handleRecoveryKeyConfirm } = useEncryptionSetup();

  useEffect(() => {
    // 복구 키가 없으면 홈으로 리다이렉트
    if (!recoveryKey) {
      router.replace("/");
    }
  }, [recoveryKey, router]);

  if (!recoveryKey) {
    return <FullPageSpinner />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
      <div className="w-full max-w-sm">
        <RecoveryKeyDisplay
          recoveryKey={recoveryKey}
          onComplete={handleRecoveryKeyConfirm}
        />
      </div>
    </div>
  );
}
