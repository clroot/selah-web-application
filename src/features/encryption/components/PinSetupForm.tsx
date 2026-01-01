"use client";

import { useCallback, useState } from "react";

import { Button } from "@/shared/components";

import { PinInput } from "./PinInput";

type Step = "enter" | "confirm";

interface PinSetupFormProps {
  onSubmit: (pin: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * PIN 설정 폼 (회원가입 완료 시)
 *
 * 6자리 PIN을 입력하고 확인하는 2단계 폼입니다.
 */
export function PinSetupForm({
  onSubmit,
  isLoading = false,
}: PinSetupFormProps) {
  const [step, setStep] = useState<Step>("enter");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string>();

  const handlePinEnter = useCallback((enteredPin: string) => {
    setPin(enteredPin);
    setStep("confirm");
    setError(undefined);
  }, []);

  const handlePinConfirm = useCallback(
    async (confirmedPin: string) => {
      if (confirmedPin !== pin) {
        setError("PIN이 일치하지 않습니다");
        return;
      }

      try {
        await onSubmit(pin);
      } catch (e) {
        setError(e instanceof Error ? e.message : "PIN 설정에 실패했습니다");
      }
    },
    [pin, onSubmit],
  );

  const handleBack = useCallback(() => {
    setStep("enter");
    setPin("");
    setError(undefined);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-[var(--color-deep-brown)]">
          {step === "enter" ? "암호화 PIN 설정" : "PIN 확인"}
        </h2>
        <p className="mt-2 text-sm text-[var(--color-soft-brown)]">
          {step === "enter"
            ? "기도 데이터를 보호할 6자리 PIN을 입력하세요"
            : "같은 PIN을 다시 입력하세요"}
        </p>
      </div>

      {step === "enter" ? (
        <PinInput
          key="enter"
          onComplete={handlePinEnter}
          disabled={isLoading}
          error={error}
        />
      ) : (
        <PinInput
          key="confirm"
          onComplete={handlePinConfirm}
          disabled={isLoading}
          error={error}
        />
      )}

      {step === "confirm" && (
        <Button variant="secondary" onClick={handleBack} disabled={isLoading}>
          다시 입력하기
        </Button>
      )}

      {isLoading && (
        <p className="text-sm text-[var(--color-soft-brown)]">
          암호화 설정 중...
        </p>
      )}
    </div>
  );
}
