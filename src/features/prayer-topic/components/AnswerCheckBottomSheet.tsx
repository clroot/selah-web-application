"use client";

import { useState, useCallback } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/shared/components";
import { cn } from "@/shared/lib/utils";

interface AnswerCheckBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reflection?: string) => void;
  isLoading?: boolean;
}

/**
 * 응답 체크 바텀 시트 컴포넌트
 *
 * 기도 응답 체크 시 표시되는 바텀 시트입니다.
 * 선택적으로 응답 소감을 입력할 수 있습니다.
 */
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
      }
    },
    [onClose]
  );

  // 열릴 때 입력값 초기화
  const handleAnimationEnd = useCallback(() => {
    if (isOpen) {
      setReflection("");
    }
  }, [isOpen]);

  const handleConfirm = useCallback(() => {
    onConfirm(reflection.trim() || undefined);
  }, [reflection, onConfirm]);

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent
        onAnimationEnd={handleAnimationEnd}
        className="rounded-t-3xl bg-white"
      >
        <DrawerHeader className="pb-0">
          <div className="mb-2 text-center">
            <span className="mb-2 block text-4xl" role="img" aria-label="축하">
              🎉
            </span>
            <DrawerTitle className="font-serif text-lg font-medium text-deep-brown">
              응답을 축하합니다!
            </DrawerTitle>
          </div>
        </DrawerHeader>

        <div className="px-6">
          {/* 소감 입력 */}
          <div className="mb-6">
            <label
              htmlFor="reflection-input"
              className="mb-2 block text-sm text-soft-brown"
            >
              응답 소감을 남겨주세요 (선택)
            </label>
            <textarea
              id="reflection-input"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="소감을 입력하세요..."
              rows={3}
              className={cn(
                "w-full resize-none rounded-xl border-2 border-sand p-4",
                "font-serif text-base text-deep-brown",
                "placeholder:text-soft-brown/50",
                "focus:border-deep-brown focus:outline-none focus:ring-2 focus:ring-deep-brown focus:ring-offset-2"
              )}
              maxLength={1000}
            />
            <p className="mt-1 text-right text-xs text-soft-brown/60">
              {reflection.length}/1000
            </p>
          </div>
        </div>

        <DrawerFooter className="flex-row gap-3 pb-8">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            onClick={handleConfirm}
            isLoading={isLoading}
            className="flex-1"
          >
            응답 체크
          </Button>
        </DrawerFooter>

        {/* Safe area padding for iOS */}
        <div className="h-[env(safe-area-inset-bottom,0px)] bg-white" />
      </DrawerContent>
    </Drawer>
  );
}
