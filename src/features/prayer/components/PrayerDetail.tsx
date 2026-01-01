"use client";

import Link from "next/link";

import { formatPrayerDateDetail } from "@/features/prayer/utils";
import { cn } from "@/shared/lib/utils";

import type { Prayer } from "@/features/prayer/types/prayer.types";

interface PrayerDetailProps {
  prayer: Prayer;
  prayerTopicTitles?: Map<string, string>;
  className?: string;
}

/**
 * 기도문 상세 컴포넌트
 */
export function PrayerDetail({
  prayer,
  prayerTopicTitles,
  className,
}: PrayerDetailProps) {
  const { main, sub } = formatPrayerDateDetail(prayer.createdAt);

  return (
    <div className={cn("px-6 pb-8", className)}>
      {/* 날짜 */}
      <div className="mb-8">
        <h1 className="mb-1 font-serif text-[28px] text-deep-brown">{main}</h1>
        <span className="text-sm text-soft-brown/60">{sub}</span>
      </div>

      {/* 기도문 내용 */}
      <div className="mb-10 whitespace-pre-wrap font-serif text-[17px] leading-loose text-deep-brown">
        {prayer.content}
      </div>

      {/* 기도한 제목 */}
      {prayer.prayerTopicIds.length > 0 && prayerTopicTitles && (
        <div className="border-t border-sand pt-6">
          <div className="mb-3 text-xs font-medium text-soft-brown/60">
            기도한 제목
          </div>
          <div className="flex flex-wrap gap-2">
            {prayer.prayerTopicIds.map((topicId) => {
              const title = prayerTopicTitles.get(topicId);
              if (!title) return null;
              return (
                <Link
                  key={topicId}
                  href={`/prayer-topics/${topicId}`}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border border-sand bg-cream-dark px-3.5 py-2.5",
                    "text-[13px] text-soft-brown",
                    "transition-colors hover:border-sand-dark",
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  {title}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
