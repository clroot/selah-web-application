"use client";

import { PrayerCard } from "./PrayerCard";
import { SectionHeader } from "./SectionHeader";

import type { Prayer } from "@/features/prayer/types/prayer.types";

interface RecentPrayersPreviewProps {
  prayers: Prayer[];
  isLoading?: boolean;
}

export function RecentPrayersPreview({
  prayers,
  isLoading,
}: RecentPrayersPreviewProps) {
  if (isLoading) {
    return (
      <section>
        <SectionHeader title="최근 기도문" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-[72px] animate-pulse rounded-2xl border border-sand bg-sand/30"
            />
          ))}
        </div>
      </section>
    );
  }

  if (prayers.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionHeader title="최근 기도문" href="/prayers" />
      <div className="space-y-3">
        {prayers.map((prayer) => (
          <PrayerCard
            key={prayer.id}
            id={prayer.id}
            content={prayer.content}
            createdAt={prayer.createdAt}
          />
        ))}
      </div>
    </section>
  );
}
