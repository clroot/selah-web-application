"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  BottomNavigation,
  FullPageSpinner,
  Sidebar,
} from "@/shared/components";
import { useEncryptionStore } from "@/shared/stores/encryptionStore";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const { isUnlocked, isRestoring, restoreFromCache, hasCachedSession } =
    useEncryptionStore();

  useEffect(() => {
    const checkEncryption = async () => {
      if (isUnlocked) {
        setIsChecking(false);
        return;
      }

      if (hasCachedSession()) {
        const restored = await restoreFromCache();
        if (restored) {
          setIsChecking(false);
          return;
        }
      }

      setIsChecking(false);
      router.replace("/unlock-encryption");
    };

    checkEncryption();
  }, [isUnlocked, hasCachedSession, restoreFromCache, router]);

  if (isChecking || isRestoring) {
    return <FullPageSpinner />;
  }

  if (!isUnlocked) {
    return <FullPageSpinner />;
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <div className="flex-1 pb-16 lg:pb-0">
        {children}
      </div>
      <BottomNavigation />
    </div>
  );
}
