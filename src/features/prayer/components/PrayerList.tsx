'use client';

import { LoadingSpinner } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { PrayerCard } from './PrayerCard';
import { PrayerEmptyState } from './PrayerEmptyState';

import type { Prayer } from '@/features/prayer/types/prayer.types';

interface PrayerListProps {
  prayers: Prayer[];
  prayerTopicTitles?: Map<string, string>;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  emptyMessage?: string;
  showWriteButton?: boolean;
  className?: string;
}

/**
 * 기도문 목록 컴포넌트
 */
export function PrayerList({
  prayers,
  prayerTopicTitles,
  isLoading = false,
  isError = false,
  error,
  emptyMessage,
  showWriteButton = true,
  className,
}: PrayerListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-16 text-center">
        <p className="text-soft-brown">
          {error?.message ?? '기도문을 불러오는 중 오류가 발생했습니다.'}
        </p>
      </div>
    );
  }

  if (prayers.length === 0) {
    return (
      <PrayerEmptyState
        message={emptyMessage}
        showWriteButton={showWriteButton}
      />
    );
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {prayers.map((prayer) => (
        <PrayerCard
          key={prayer.id}
          prayer={prayer}
          prayerTopicTitles={prayerTopicTitles}
        />
      ))}
    </div>
  );
}
