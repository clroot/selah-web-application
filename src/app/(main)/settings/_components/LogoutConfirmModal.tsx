"use client";

import {
  Button,
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/shared/components";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: LogoutConfirmModalProps) {
  return (
    <ResponsiveModal open={isOpen} onOpenChange={onClose}>
      <ResponsiveModalContent className="gap-4 lg:gap-8">
        <ResponsiveModalHeader className="text-center lg:mb-2">
          <ResponsiveModalTitle className="font-serif text-lg text-deep-brown">
            로그아웃
          </ResponsiveModalTitle>
          <ResponsiveModalDescription className="text-soft-brown">
            정말 로그아웃 하시겠습니까?
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>

        <ResponsiveModalFooter
          drawerClassName="flex-row gap-3 px-6 pb-8"
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
            variant="primary"
            onClick={onConfirm}
            isLoading={isLoading}
            className="min-w-24 flex-1 lg:flex-initial"
          >
            로그아웃
          </Button>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
