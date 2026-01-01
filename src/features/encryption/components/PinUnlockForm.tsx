"use client";

import { useCallback, useRef, useState } from "react";

import type { PinInputHandle } from "./PinInput";
import { PinInput } from "./PinInput";

interface PinUnlockFormProps {
  onSubmit: (pin: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * PIN 입력 폼 (로그인 시 암호화 해제용)
 */
export function PinUnlockForm({
  onSubmit,
  isLoading = false,
}: PinUnlockFormProps) {
  const [error, setError] = useState<string>();
  const pinInputRef = useRef<PinInputHandle>(null);

  const handlePinComplete = useCallback(
    async (pin: string) => {
      setError(undefined);

      try {
        await onSubmit(pin);
      } catch (e) {
        setError(e instanceof Error ? e.message : "PIN이 올바르지 않습니다");
        // 에러 시 입력 초기화
        pinInputRef.current?.clear();
      }
    },
    [onSubmit],
  );

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-[var(--color-deep-brown)]">
          암호화 해제
        </h2>
        <p className="mt-2 text-sm text-[var(--color-soft-brown)]">
          6자리 PIN을 입력하세요
        </p>
      </div>

      <PinInput
        ref={pinInputRef}
        onComplete={handlePinComplete}
        disabled={isLoading}
        error={error}
        autoFocus
      />

      {isLoading && (
        <p className="text-sm text-[var(--color-soft-brown)]">
          암호화 해제 중...
        </p>
      )}
    </div>
  );
}
