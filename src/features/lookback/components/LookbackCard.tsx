"use client";

import Link from "next/link";

import { ChevronRight } from "lucide-react";

import type { DecryptedLookbackResponse } from "@/features/lookback/types/lookback.types";

interface LookbackCardProps {
  lookback: DecryptedLookbackResponse;
}

export function LookbackCard({ lookback }: LookbackCardProps) {
  const { prayerTopic, daysSinceCreated } = lookback;

  return (
    <Link
      href={`/prayer-topics/${prayerTopic.id}`}
      className="flex items-center gap-4 rounded-2xl border border-sand bg-cream px-5 py-[18px] transition-colors hover:border-warm-beige hover:bg-cream/80"
    >
      <div className="h-2 w-2 flex-shrink-0 rounded-full bg-soft-brown" />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] text-deep-brown">
          {prayerTopic.title}
        </h3>
        <p className="mt-1 text-xs text-soft-brown">
          {daysSinceCreated}일 전에 작성한 기도
        </p>
      </div>
      <ChevronRight
        className="h-[18px] w-[18px] flex-shrink-0 text-soft-brown"
        strokeWidth={1.5}
      />
    </Link>
  );
}
