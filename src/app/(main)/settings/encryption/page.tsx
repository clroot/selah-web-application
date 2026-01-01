"use client";

import { useCallback, useState } from "react";

import Link from "next/link";

import { ArrowLeft, Key, RefreshCw, Shield, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import {
  ChangePinForm,
  RecoveryKeyDisplay,
} from "@/features/encryption/components";
import { Button } from "@/shared/components";
import { cn } from "@/shared/lib/utils";
import { useEncryptionStore } from "@/shared/stores/encryptionStore";

type ActiveModal =
  | "change-pin"
  | "regenerate-recovery"
  | "show-recovery"
  | null;

export default function EncryptionSettingsPage() {
  const { changePIN, regenerateRecoveryKey, isUnlocked } = useEncryptionStore();

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newRecoveryKey, setNewRecoveryKey] = useState<string | null>(null);

  const handleChangePIN = useCallback(
    async (newPin: string) => {
      setIsLoading(true);
      try {
        await changePIN(newPin);
        toast.success("PIN이 변경되었습니다");
        setActiveModal(null);
      } catch (e) {
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [changePIN],
  );

  const handleRegenerateRecoveryKey = useCallback(async () => {
    setIsLoading(true);
    try {
      const key = await regenerateRecoveryKey();
      setNewRecoveryKey(key);
      setActiveModal("show-recovery");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "복구 키 재생성에 실패했습니다",
      );
    } finally {
      setIsLoading(false);
    }
  }, [regenerateRecoveryKey]);

  const handleCloseRecoveryDisplay = useCallback(() => {
    setActiveModal(null);
    setNewRecoveryKey(null);
  }, []);

  if (!isUnlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-soft-brown">암호화가 해제되지 않았습니다</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-safe">
      <header className="flex items-center gap-1 px-3 pb-4 pt-14">
        <Link
          href="/settings"
          className="-ml-1 flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-sand/50"
        >
          <ArrowLeft className="h-5 w-5 text-deep-brown" strokeWidth={1.5} />
        </Link>
        <h1 className="text-base font-medium text-deep-brown">암호화 설정</h1>
      </header>

      <section className="px-6 py-4">
        <div className="flex items-center gap-4 rounded-2xl bg-green-50 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
            <ShieldCheck className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-green-800">암호화 활성화됨</p>
            <p className="text-sm text-green-600">
              모든 기도 데이터가 안전하게 보호됩니다
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="px-6 pb-3 pt-4 text-xs font-medium uppercase tracking-wide text-soft-brown/70">
          보안 설정
        </h2>

        <SettingsButton
          icon={Key}
          label="PIN 변경"
          description="암호화 해제에 사용하는 PIN을 변경합니다"
          onClick={() => setActiveModal("change-pin")}
        />

        <SettingsButton
          icon={RefreshCw}
          label="복구 키 재생성"
          description="새로운 복구 키를 발급받습니다"
          onClick={() => setActiveModal("regenerate-recovery")}
        />
      </section>

      <section className="px-6 py-6">
        <div className="rounded-xl bg-sand/30 p-4">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-soft-brown" />
            <div className="space-y-1 text-sm text-soft-brown">
              <p>
                기도 내용은 클라이언트에서 암호화되어 서버에서도 열람할 수
                없습니다.
              </p>
              <p>
                PIN과 복구 키를 분실하면 데이터를 복구할 수 없으니 안전하게
                보관해주세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {activeModal === "change-pin" && (
        <Modal onClose={() => setActiveModal(null)}>
          <ChangePinForm
            onSubmit={handleChangePIN}
            onCancel={() => setActiveModal(null)}
            isLoading={isLoading}
          />
        </Modal>
      )}

      {activeModal === "regenerate-recovery" && (
        <Modal onClose={() => setActiveModal(null)}>
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <RefreshCw className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-deep-brown">
                복구 키 재생성
              </h2>
              <p className="mt-2 text-soft-brown">
                새 복구 키를 발급받으면 기존 복구 키는 더 이상 사용할 수
                없습니다.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setActiveModal(null)}
                disabled={isLoading}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                variant="danger"
                onClick={handleRegenerateRecoveryKey}
                isLoading={isLoading}
                className="flex-1"
              >
                재생성
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === "show-recovery" && newRecoveryKey && (
        <Modal onClose={handleCloseRecoveryDisplay}>
          <RecoveryKeyDisplay
            recoveryKey={newRecoveryKey}
            onComplete={handleCloseRecoveryDisplay}
          />
        </Modal>
      )}
    </div>
  );
}

interface SettingsButtonProps {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  description: string;
  onClick: () => void;
}

function SettingsButton({
  icon: Icon,
  label,
  description,
  onClick,
}: SettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-4 px-6 py-4 text-left transition-colors hover:bg-sand/30"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sand/50">
        <Icon className="h-5 w-5 text-soft-brown" strokeWidth={1.5} />
      </div>
      <div className="flex-1">
        <p className="text-[15px] text-deep-brown">{label}</p>
        <p className="mt-0.5 text-sm text-soft-brown">{description}</p>
      </div>
    </button>
  );
}

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={0}
        aria-label="모달 닫기"
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-2xl bg-white p-6",
          "mx-4 max-h-[90vh] overflow-y-auto",
        )}
      >
        {children}
      </div>
    </div>
  );
}
