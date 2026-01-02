"use client";

import type { ReactNode } from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface PageHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  showBackButton = true,
  onBack,
  rightAction,
  className,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-cream px-4 md:px-6 lg:px-8",
        "lg:border-b-0 border-b border-sand",
        className,
      )}
    >
      <div className="flex h-14 items-center justify-between lg:hidden">
        <div className="flex w-20 items-center">
          {showBackButton && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 text-soft-brown transition-colors hover:text-deep-brown"
              aria-label="뒤로 가기"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
        </div>

        {title && (
          <h1 className="font-serif text-lg font-medium text-deep-brown">
            {title}
          </h1>
        )}

        <div className="flex w-20 items-center justify-end">{rightAction}</div>
      </div>

      {title && (
        <div className="hidden lg:flex lg:items-center lg:justify-between lg:py-8">
          <h1 className="font-serif text-2xl font-bold text-deep-brown">
            {title}
          </h1>
          <div className="flex items-center">{rightAction}</div>
        </div>
      )}
    </header>
  );
}
