"use client";

import { LookbackSection } from "@/features/lookback/components";

import {
  EmptyHomeState,
  HomeHeader,
  PrayerTopicsPreview,
  RecentPrayersPreview,
  StatsGrid,
  useHomeData,
} from "./_components/home";

export default function HomePage() {
  const { data, isLoading } = useHomeData();

  const prayerTopics = data?.prayerTopics ?? [];
  const recentPrayers = data?.recentPrayers ?? [];
  const isEmpty = prayerTopics.length === 0 && recentPrayers.length === 0;

  return (
    <div className="pb-8">
      <HomeHeader />

      <div className="space-y-8 px-4 md:px-6 lg:px-8">
        <StatsGrid />
        <LookbackSection />

        {isLoading ? (
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0 space-y-8">
            <PrayerTopicsPreview topics={[]} isLoading />
            <RecentPrayersPreview prayers={[]} isLoading />
          </div>
        ) : isEmpty ? (
          <EmptyHomeState />
        ) : (
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0 space-y-8">
            <PrayerTopicsPreview topics={prayerTopics} />
            <RecentPrayersPreview prayers={recentPrayers} />
          </div>
        )}
      </div>
    </div>
  );
}
