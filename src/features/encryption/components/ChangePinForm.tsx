"use client";

import { useCallback, useRef, useState } from "react";

import { Button } from "@/shared/components";

import type { PinInputHandle } from "./PinInput";
import { PinInput } from "./PinInput";

type Step = "new" | "confirm";

interface ChangePinFormProps {
  onSubmit: (newPin: string) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ChangePinForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: ChangePinFormProps) {
  const [step, setStep] = useState<Step>("new");
  const [newPin, setNewPin] = useState("");
  const [error, setError] = useState<string>();

  const confirmPinRef = useRef<PinInputHandle>(null);

  const handleNewPinComplete = useCallback((pin: string) => {
    setNewPin(pin);
    setStep("confirm");
    setError(undefined);
  }, []);

  const handleConfirmPinComplete = useCallback(
    async (confirmedPin: string) => {
      if (confirmedPin !== newPin) {
        setError("PIN이 일치하지 않습니다");
        confirmPinRef.current?.clear();
        return;
      }

      try {
        await onSubmit(newPin);
      } catch (e) {
        setError(e instanceof Error ? e.message : "PIN 변경에 실패했습니다");
        setStep("new");
        setNewPin("");
      }
    },
    [newPin, onSubmit],
  );

  const handleBack = useCallback(() => {
    setStep("new");
    setNewPin("");
    setError(undefined);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-deep-brown">
          {step === "new" ? "새 PIN 입력" : "PIN 확인"}
        </h2>
        <p className="mt-2 text-sm text-soft-brown">
          {step === "new"
            ? "새로운 6자리 PIN을 입력하세요"
            : "같은 PIN을 다시 입력하세요"}
        </p>
      </div>

      {step === "new" ? (
        <PinInput
          key="new"
          onComplete={handleNewPinComplete}
          disabled={isLoading}
          error={error}
          autoFocus
        />
      ) : (
        <PinInput
          key="confirm"
          ref={confirmPinRef}
          onComplete={handleConfirmPinComplete}
          disabled={isLoading}
          error={error}
          autoFocus
        />
      )}

      <div className="flex gap-3">
        {step === "confirm" && (
          <Button variant="secondary" onClick={handleBack} disabled={isLoading}>
            다시 입력
          </Button>
        )}
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            취소
          </Button>
        )}
      </div>

      {isLoading && <p className="text-sm text-soft-brown">PIN 변경 중...</p>}
    </div>
  );
}
