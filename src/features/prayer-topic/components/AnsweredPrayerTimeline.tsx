"use client";

import Link from "next/link";

import {
  formatDate,
  formatDaysPrayed,
  getDaysPrayed,
  groupByYearMonth,
} from "@/features/prayer-topic/utils/prayerTopic.utils";
import { cn } from "@/shared/lib/utils";

import type { PrayerTopic } from "@/features/prayer-topic/types/prayerTopic.types";

interface AnsweredPrayerTimelineProps {
  topics: PrayerTopic[];
  className?: string;
}

interface TimelineItemProps {
  topic: PrayerTopic;
  isLast: boolean;
}

function TimelineItem({ topic, isLast }: TimelineItemProps) {
  const daysPrayed =
    topic.answeredAt && getDaysPrayed(topic.createdAt, topic.answeredAt);

  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sand text-sm">
          ✓
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-sand" />}
      </div>

      <Link
        href={`/prayer-topics/${topic.id}`}
        className={cn(
          "mb-4 flex-1 rounded-2xl border border-sand bg-white p-4",
          "transition-all duration-200",
          "hover:border-soft-brown hover:shadow-sm",
        )}
      >
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {daysPrayed && (
              <span className="rounded-full bg-warm-beige px-2.5 py-0.5 text-xs font-medium text-soft-brown">
                {formatDaysPrayed(daysPrayed)}
              </span>
            )}
            <span className="text-xs text-soft-brown/60">
              🙏 {topic.prayerCount}
            </span>
          </div>
          <span className="text-xs text-soft-brown/60">
            {topic.answeredAt && formatDate(topic.answeredAt)}
          </span>
        </div>

        <h3 className="mb-1 text-base font-medium leading-snug text-deep-brown">
          {topic.title}
        </h3>

        {topic.reflection && (
          <p className="line-clamp-2 text-sm text-soft-brown/80">
            {topic.reflection}
          </p>
        )}

        <div className="mt-2 text-xs text-soft-brown/50">
          시작: {formatDate(topic.createdAt)}
        </div>
      </Link>
    </div>
  );
}

export function AnsweredPrayerTimeline({
  topics,
  className,
}: AnsweredPrayerTimelineProps) {
  const groupedByMonth = groupByYearMonth(topics);
  const sortedMonths = Array.from(groupedByMonth.keys()).sort((a, b) =>
    a.localeCompare(b),
  );

  return (
    <div className={cn("flex flex-col", className)}>
      {sortedMonths.map((month) => {
        const monthTopics = groupedByMonth.get(month) ?? [];
        const sortedTopics = [...monthTopics].sort((a, b) => {
          const dateA = a.answeredAt ? new Date(a.answeredAt).getTime() : 0;
          const dateB = b.answeredAt ? new Date(b.answeredAt).getTime() : 0;
          return dateA - dateB;
        });

        return (
          <div key={month} className="mb-6">
            <h2 className="mb-4 text-sm font-semibold text-deep-brown">
              {month}
            </h2>
            <div className="flex flex-col">
              {sortedTopics.map((topic, index) => (
                <TimelineItem
                  key={topic.id}
                  topic={topic}
                  isLast={index === sortedTopics.length - 1}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
