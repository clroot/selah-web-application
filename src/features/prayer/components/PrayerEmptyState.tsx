"use client";

import Link from "next/link";

import { BookOpen, Plus } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface PrayerEmptyStateProps {
  message?: string;
  showWriteButton?: boolean;
  className?: string;
}

/**
 * 기도문 빈 상태 컴포넌트
 */
export function PrayerEmptyState({
  message = "이 날 기도한 기록이 없어요",
  showWriteButton = true,
  className,
}: PrayerEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sand">
        <BookOpen className="h-7 w-7 text-soft-brown/60" />
      </div>
      <p className="mb-4 text-sm text-soft-brown/60">{message}</p>
      {showWriteButton && (
        <Link
          href="/prayers/new"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full bg-deep-brown px-5 py-3",
            "text-[13px] font-medium text-cream",
            "transition-colors hover:bg-deep-brown/90",
          )}
        >
          <Plus className="h-4 w-4" />
          기도문 작성하기
        </Link>
      )}
    </div>
  );
}
