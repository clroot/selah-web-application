'use client';

import Link from 'next/link';

import {
  formatDate,
  getStatusLabel,
  getStatusColorClass,
} from '@/features/prayer-topic/utils/prayerTopic.utils';
import { cn } from '@/shared/lib/utils';

import type { PrayerTopic } from '@/features/prayer-topic/types/prayerTopic.types';

interface PrayerTopicCardProps {
  topic: PrayerTopic;
  className?: string;
}

/**
 * 기도제목 카드 컴포넌트
 *
 * 기도제목의 제목, 상태, 작성일을 표시합니다.
 * 클릭 시 상세 페이지로 이동합니다.
 */
export function PrayerTopicCard({ topic, className }: PrayerTopicCardProps) {
  const isAnswered = topic.status === 'ANSWERED';

  return (
    <Link
      href={`/prayer-topics/${topic.id}`}
      className={cn(
        'block rounded-2xl border border-sand bg-white p-4',
        'transition-all duration-200',
        'hover:border-soft-brown hover:shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-deep-brown focus:ring-offset-2',
        className
      )}
    >
      <div className="flex flex-col gap-3">
        {/* 상태 배지 */}
        <div className="flex items-center justify-between">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
              getStatusColorClass(topic.status)
            )}
          >
            {getStatusLabel(topic.status)}
          </span>
          {isAnswered && topic.answeredAt && (
            <span className="text-xs text-soft-brown">
              {formatDate(topic.answeredAt)} 응답
            </span>
          )}
        </div>

        {/* 제목 */}
        <h3
          className={cn(
            'text-base font-medium leading-snug',
            isAnswered ? 'text-soft-brown' : 'text-deep-brown'
          )}
        >
          {topic.title}
        </h3>

        {/* 응답 소감 (있는 경우) */}
        {isAnswered && topic.reflection && (
          <p className="line-clamp-2 text-sm text-soft-brown/80">
            {topic.reflection}
          </p>
        )}

        {/* 작성일 */}
        <span className="text-xs text-soft-brown/60">
          {formatDate(topic.createdAt)}
        </span>
      </div>
    </Link>
  );
}
