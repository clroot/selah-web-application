"use client";

import Link from "next/link";

import { BookOpen, ListPlus } from "lucide-react";

import {
  ResponsiveModal,
  ResponsiveModalClose,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/shared/components";
import { cn } from "@/shared/lib/utils";

interface CreateActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ActionItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function ActionItem({
  href,
  icon,
  title,
  description,
  onClick,
}: ActionItemProps) {
  return (
    <ResponsiveModalClose asChild>
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "flex items-center gap-4 rounded-xl p-4",
          "bg-warm-beige/50 transition-colors",
          "hover:bg-warm-beige active:bg-sand/50",
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-deep-brown">{title}</span>
          <span className="text-sm text-soft-brown">{description}</span>
        </div>
      </Link>
    </ResponsiveModalClose>
  );
}

export function CreateActionSheet({ isOpen, onClose }: CreateActionSheetProps) {
  const actionItems = [
    {
      href: "/prayer-topics/new",
      icon: <ListPlus className="h-6 w-6 text-gold" />,
      title: "기도제목 추가",
      description: "기도할 주제를 등록해요",
    },
    {
      href: "/prayers/new",
      icon: <BookOpen className="h-6 w-6 text-gold" />,
      title: "기도문 작성",
      description: "오늘의 기도를 기록해요",
    },
  ];

  return (
    <ResponsiveModal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ResponsiveModalContent className="mx-auto max-w-120 gap-4 bg-cream lg:gap-8">
        <ResponsiveModalHeader className="pb-2 lg:mb-2 lg:pb-0">
          <ResponsiveModalTitle className="text-center text-deep-brown">
            무엇을 작성할까요?
          </ResponsiveModalTitle>
        </ResponsiveModalHeader>

        <div className="flex flex-col gap-3 px-4 pb-8 lg:px-0 lg:pb-0">
          {actionItems.map((item) => (
            <ActionItem key={item.href} {...item} onClick={onClose} />
          ))}
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
