"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { BottomNavigation, FullPageSpinner } from "@/shared/components";
import { useEncryptionStore } from "@/shared/stores/encryptionStore";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const { isUnlocked, isRestoring, restoreFromCache, hasCachedSession } =
    useEncryptionStore();

  // 앱 시작 시 캐시에서 DEK 복원 시도
  useEffect(() => {
    const checkEncryption = async () => {
      // 이미 해제된 상태
      if (isUnlocked) {
        setIsChecking(false);
        return;
      }

      // 캐시에서 복원 시도
      if (hasCachedSession()) {
        const restored = await restoreFromCache();
        if (restored) {
          setIsChecking(false);
          return;
        }
      }

      // 복원 실패 - PIN 입력 페이지로 이동
      setIsChecking(false);
      router.replace("/unlock-encryption");
    };

    checkEncryption();
  }, [isUnlocked, hasCachedSession, restoreFromCache, router]);

  // 로딩 중
  if (isChecking || isRestoring) {
    return <FullPageSpinner />;
  }

  // 암호화 해제되지 않음 (리다이렉트 대기)
  if (!isUnlocked) {
    return <FullPageSpinner />;
  }

  return (
    <div className="min-h-screen bg-cream pb-16">
      {children}
      <BottomNavigation />
    </div>
  );
}
