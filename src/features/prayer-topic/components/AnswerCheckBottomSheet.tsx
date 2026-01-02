"use client";

import { useCallback, useState } from "react";

import {
  Button,
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/shared/components";
import { cn } from "@/shared/lib/utils";

interface AnswerCheckBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reflection?: string) => void;
  isLoading?: boolean;
}

export function AnswerCheckBottomSheet({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: AnswerCheckBottomSheetProps) {
  const [reflection, setReflection] = useState("");

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onClose();
        setReflection("");
      }
    },
    [onClose],
  );

  const handleConfirm = useCallback(() => {
    onConfirm(reflection.trim() || undefined);
  }, [reflection, onConfirm]);

  return (
    <ResponsiveModal open={isOpen} onOpenChange={handleOpenChange}>
      <ResponsiveModalContent className="gap-4 rounded-t-3xl bg-white lg:gap-8 lg:rounded-lg lg:bg-cream">
        <ResponsiveModalHeader className="pb-0 lg:mb-2 lg:pb-0">
          <div className="mb-2 text-center">
            <span className="mb-2 block text-4xl" role="img" aria-label="축하">
              🎉
            </span>
          </div>
          <ResponsiveModalTitle className="font-serif text-lg font-medium text-deep-brown">
            응답을 축하합니다!
          </ResponsiveModalTitle>
        </ResponsiveModalHeader>

        <div className="px-6 lg:px-0">
          <div className="mb-6">
            <label
              htmlFor="reflection-input"
              className="mb-2 block text-sm text-soft-brown"
            >
              감사한 마음을 남겨보세요 (선택)
            </label>
            <textarea
              id="reflection-input"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="어떤 응답을 받으셨나요?"
              rows={3}
              className={cn(
                "w-full resize-none rounded-xl border-2 border-sand p-4",
                "font-serif text-base text-deep-brown",
                "placeholder:text-soft-brown/50",
                "focus:border-deep-brown focus:outline-none focus:ring-2 focus:ring-deep-brown focus:ring-offset-2",
              )}
              maxLength={1000}
            />
            <p className="mt-1 text-right text-xs text-soft-brown/60">
              {reflection.length}/1000
            </p>
          </div>
        </div>

        <ResponsiveModalFooter
          drawerClassName="flex-row gap-3 pb-8"
          dialogClassName=""
        >
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="min-w-24 flex-1 lg:flex-initial"
          >
            취소
          </Button>
          <Button
            onClick={handleConfirm}
            isLoading={isLoading}
            className="min-w-24 flex-1 lg:flex-initial"
          >
            완료
          </Button>
        </ResponsiveModalFooter>

        <div className="h-[env(safe-area-inset-bottom,0px)] bg-white lg:hidden" />
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
