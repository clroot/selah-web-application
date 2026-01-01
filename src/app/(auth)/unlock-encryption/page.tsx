"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { PinUnlockForm } from "@/features/encryption/components";
import { FullPageSpinner } from "@/shared/components";
import { useEncryptionStore } from "@/shared/stores/encryptionStore";

export default function UnlockEncryptionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    isUnlocked,
    isRestoring,
    unlockWithPIN,
    restoreFromCache,
    hasCachedSession,
  } = useEncryptionStore();

  // 캐시에서 복원 시도
  useEffect(() => {
    const tryRestore = async () => {
      if (hasCachedSession()) {
        const restored = await restoreFromCache();
        if (restored) {
          router.replace("/");
        }
      }
    };

    tryRestore();
  }, [hasCachedSession, restoreFromCache, router]);

  // 이미 해제된 상태면 홈으로
  useEffect(() => {
    if (isUnlocked) {
      router.replace("/");
    }
  }, [isUnlocked, router]);

  const handleUnlock = async (pin: string) => {
    setIsLoading(true);
    try {
      await unlockWithPIN(pin);
      router.replace("/");
    } catch (e) {
      setIsLoading(false);
      // 암호화 관련 에러는 사용자 친화적인 메시지로 변환
      if (e instanceof Error) {
        // DOMException은 복호화 실패를 의미
        if (e.name === "OperationError" || e.message.includes("decrypt")) {
          throw new Error("PIN이 올바르지 않습니다");
        }
        throw e;
      }
      throw new Error("암호화 해제에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  // 복원 중
  if (isRestoring) {
    return <FullPageSpinner />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl font-bold text-deep-brown">
            Selah
          </h1>
          <p className="mt-2 text-soft-brown">
            기도 데이터를 보호하기 위해 PIN을 입력해주세요
          </p>
        </div>

        <PinUnlockForm onSubmit={handleUnlock} isLoading={isLoading} />

        <div className="mt-8 text-center">
          <button
            type="button"
            className="text-sm text-soft-brown hover:text-deep-brown hover:underline"
            onClick={() => {
              // TODO: 복구 키 입력 페이지로 이동
              alert("복구 키 입력 기능은 준비 중입니다.");
            }}
          >
            PIN을 잊으셨나요?
          </button>
        </div>
      </div>
    </div>
  );
}
