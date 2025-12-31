'use client';

import { cn } from '@/shared/lib/utils';
import { LoadingSpinner } from '@/shared/components';

import { PrayerTopicCard } from './PrayerTopicCard';
import { EmptyState } from './EmptyState';

import type { FilterStatus } from './StatusFilter';
import type { PrayerTopic } from '@/features/prayer-topic/types/prayerTopic.types';

interface PrayerTopicListProps {
  topics: PrayerTopic[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  filterStatus?: FilterStatus;
  className?: string;
}

/**
 * 기도제목 목록 컴포넌트
 *
 * 기도제목 카드 목록을 렌더링합니다.
 * 로딩, 에러, 빈 상태를 처리합니다.
 */
export function PrayerTopicList({
  topics,
  isLoading = false,
  isError = false,
  error,
  filterStatus = 'ALL',
  className,
}: PrayerTopicListProps) {
  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 text-4xl">😢</div>
        <h3 className="mb-2 text-lg font-medium text-deep-brown">
          기도제목을 불러올 수 없습니다
        </h3>
        <p className="text-sm text-soft-brown">
          {error?.message ?? '잠시 후 다시 시도해주세요.'}
        </p>
      </div>
    );
  }

  // 빈 상태
  if (topics.length === 0) {
    return <EmptyState filterStatus={filterStatus} />;
  }

  // 목록 렌더링
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {topics.map((topic) => (
        <PrayerTopicCard key={topic.id} topic={topic} />
      ))}
    </div>
  );
}
