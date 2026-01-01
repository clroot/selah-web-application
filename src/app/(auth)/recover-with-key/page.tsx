"use client";

import { useCallback, useRef, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  PinInput,
  PinInputHandle,
  RecoveryKeyInput,
} from "@/features/encryption/components";
import { Button } from "@/shared/components";
import { useEncryptionStore } from "@/shared/stores/encryptionStore";

type Step = "recovery-key" | "new-pin" | "confirm-pin";

const RECOVERY_KEY_LENGTH = 64;

function removeHyphens(formatted: string): string {
  return formatted.replace(/-/g, "");
}

export default function RecoverWithKeyPage() {
  const router = useRouter();
  const { recoverWithKey } = useEncryptionStore();

  const [step, setStep] = useState<Step>("recovery-key");
  const [recoveryKey, setRecoveryKey] = useState("");
  const [newPin, setNewPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const newPinRef = useRef<PinInputHandle>(null);
  const confirmPinRef = useRef<PinInputHandle>(null);

  const isRecoveryKeyComplete =
    removeHyphens(recoveryKey).length === RECOVERY_KEY_LENGTH;

  const handleRecoveryKeyNext = useCallback(() => {
    if (!isRecoveryKeyComplete) {
      setError("복구 키를 모두 입력해주세요");
      return;
    }
    setError(null);
    setStep("new-pin");
  }, [isRecoveryKeyComplete]);

  const handleNewPinComplete = useCallback((pin: string) => {
    setNewPin(pin);
    setError(null);
    setStep("confirm-pin");
  }, []);

  const handleConfirmPinComplete = useCallback(
    async (pin: string) => {
      if (pin !== newPin) {
        setError("PIN이 일치하지 않습니다");
        confirmPinRef.current?.clear();
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await recoverWithKey(recoveryKey, pin);
        router.replace("/");
      } catch (e) {
        setIsLoading(false);
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("복구에 실패했습니다");
        }
        setStep("recovery-key");
        setNewPin("");
      }
    },
    [newPin, recoveryKey, recoverWithKey, router],
  );

  const handleBack = useCallback(() => {
    setError(null);
    if (step === "confirm-pin") {
      setStep("new-pin");
      newPinRef.current?.clear();
    } else if (step === "new-pin") {
      setNewPin("");
      setStep("recovery-key");
    }
  }, [step]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl font-bold text-deep-brown">
            복구 키로 복원
          </h1>
          <p className="mt-2 text-soft-brown">
            {step === "recovery-key" && "회원가입 시 저장한 복구 키를 입력하세요"}
            {step === "new-pin" && "새로운 6자리 PIN을 설정하세요"}
            {step === "confirm-pin" && "PIN을 다시 한번 입력하세요"}
          </p>
        </div>

        {step === "recovery-key" && (
          <div className="space-y-6">
            <RecoveryKeyInput
              value={recoveryKey}
              onChange={setRecoveryKey}
              error={error ?? undefined}
              disabled={isLoading}
            />
            <Button
              onClick={handleRecoveryKeyNext}
              disabled={!isRecoveryKeyComplete || isLoading}
              className="w-full"
            >
              다음
            </Button>
          </div>
        )}

        {step === "new-pin" && (
          <div className="space-y-6">
            <PinInput
              ref={newPinRef}
              onComplete={handleNewPinComplete}
              disabled={isLoading}
              error={error ?? undefined}
              autoFocus
            />
            <button
              type="button"
              onClick={handleBack}
              className="w-full text-sm text-soft-brown hover:text-deep-brown hover:underline"
            >
              이전으로
            </button>
          </div>
        )}

        {step === "confirm-pin" && (
          <div className="space-y-6">
            <PinInput
              ref={confirmPinRef}
              onComplete={handleConfirmPinComplete}
              disabled={isLoading}
              error={error ?? undefined}
              autoFocus
            />
            <button
              type="button"
              onClick={handleBack}
              disabled={isLoading}
              className="w-full text-sm text-soft-brown hover:text-deep-brown hover:underline"
            >
              이전으로
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/unlock-encryption"
            className="text-sm text-soft-brown hover:text-deep-brown hover:underline"
          >
            PIN으로 잠금 해제
          </Link>
        </div>
      </div>
    </div>
  );
}
