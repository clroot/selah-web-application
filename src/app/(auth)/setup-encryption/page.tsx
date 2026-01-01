"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { Shield } from "lucide-react";

import { PinSetupForm } from "@/features/encryption/components";
import { useEncryptionSetup } from "@/features/encryption/hooks";
import { useAuthStore } from "@/features/member/stores/authStore";
import { FullPageSpinner } from "@/shared/components";

export default function SetupEncryptionPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  const { isLoading, isUnlocked, handlePinSetup } = useEncryptionSetup();

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isInitializing, isAuthenticated, router]);

  // 이미 암호화 설정이 완료된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (isUnlocked) {
      router.replace("/");
    }
  }, [isUnlocked, router]);

  if (isInitializing || !isAuthenticated) {
    return <FullPageSpinner />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold/20 to-gold/40">
            <Shield className="h-8 w-8 text-gold" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-deep-brown">
            기도 데이터 보호
          </h1>
          <p className="mt-2 text-soft-brown">
            6자리 PIN을 설정하여
            <br />
            기도 내용을 안전하게 보호하세요
          </p>
        </div>

        <PinSetupForm onSubmit={handlePinSetup} isLoading={isLoading} />

        <div className="rounded-lg bg-warm-beige/50 p-4 text-center">
          <p className="text-xs text-soft-brown">
            PIN은 기기에서 데이터를 암호화하는 데 사용됩니다.
            <br />
            서버에 저장되지 않으므로 안전합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
