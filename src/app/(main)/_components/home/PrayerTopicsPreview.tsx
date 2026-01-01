'use client';


import { SectionHeader } from './SectionHeader';
import { TopicCard } from './TopicCard';

import type { PrayerTopic } from '@/features/prayer-topic/types/prayerTopic.types';

interface PrayerTopicsPreviewProps {
  topics: PrayerTopic[];
  isLoading?: boolean;
}

/**
 * 기도제목 미리보기 섹션
 */
export function PrayerTopicsPreview({
  topics,
  isLoading,
}: PrayerTopicsPreviewProps) {
  if (isLoading) {
    return (
      <section className="px-6">
        <SectionHeader title="기도제목" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[72px] animate-pulse rounded-2xl border border-sand bg-sand/30"
            />
          ))}
        </div>
      </section>
    );
  }

  if (topics.length === 0) {
    return null; // EmptyHomeState에서 처리
  }

  return (
    <section className="px-6">
      <SectionHeader title="기도제목" href="/prayer-topics" />
      <div className="space-y-3">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            id={topic.id}
            title={topic.title}
            createdAt={topic.createdAt}
          />
        ))}
      </div>
    </section>
  );
}
