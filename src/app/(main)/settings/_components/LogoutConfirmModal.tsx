"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/shared/components/Button";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

/**
 * 로그아웃 확인 모달 (바텀시트)
 */
export function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: LogoutConfirmModalProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="text-center">
          <DrawerTitle className="font-serif text-lg text-deep-brown">
            로그아웃
          </DrawerTitle>
          <DrawerDescription className="text-soft-brown">
            정말 로그아웃 하시겠습니까?
          </DrawerDescription>
        </DrawerHeader>

        <DrawerFooter className="flex-row gap-3 px-6 pb-8">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1"
          >
            로그아웃
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
