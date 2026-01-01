'use client';

import Link from 'next/link';

import { formatPrayerDate, getPreviewText } from '@/features/prayer/utils';
import { cn } from '@/shared/lib/utils';

import type { Prayer } from '@/features/prayer/types/prayer.types';

interface PrayerCardProps {
  prayer: Prayer;
  prayerTopicTitles?: Map<string, string>;
  className?: string;
}

/**
 * 기도문 카드 컴포넌트
 */
export function PrayerCard({
  prayer,
  prayerTopicTitles,
  className,
}: PrayerCardProps) {
  return (
    <Link
      href={`/prayers/${prayer.id}`}
      className={cn(
        'block rounded-2xl border border-sand bg-cream p-[18px]',
        'transition-all duration-200',
        'hover:border-sand-dark hover:bg-cream-dark',
        className
      )}
    >
      {/* 날짜 */}
      <div className="mb-2.5 text-xs text-soft-brown/60">
        {formatPrayerDate(prayer.createdAt)}
      </div>

      {/* 내용 미리보기 */}
      <p className="mb-3 line-clamp-2 font-serif text-[15px] leading-relaxed text-soft-brown">
        {getPreviewText(prayer.content)}
      </p>

      {/* 연결된 기도제목 태그 */}
      {prayer.prayerTopicIds.length > 0 && prayerTopicTitles && (
        <div className="flex flex-wrap gap-1.5">
          {prayer.prayerTopicIds.map((topicId) => {
            const title = prayerTopicTitles.get(topicId);
            if (!title) return null;
            return (
              <span
                key={topicId}
                className="rounded-full bg-gold-soft px-2.5 py-1 text-[11px] text-soft-brown"
              >
                #{getPreviewText(title, 10)}
              </span>
            );
          })}
        </div>
      )}
    </Link>
  );
}
