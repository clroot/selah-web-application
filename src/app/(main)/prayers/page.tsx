"use client";

import { useMemo, useState } from "react";

import { format, isSameDay } from "date-fns";

import { PrayerCalendar, PrayerList } from "@/features/prayer/components";
import { usePrayers } from "@/features/prayer/hooks";
import { filterPrayersByDate, getPrayerDates } from "@/features/prayer/utils";
import { usePrayerTopics } from "@/features/prayer-topic/hooks";
import { PageHeader } from "@/shared/components";

export default function PrayersPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { prayers, isLoading, isError, error } = usePrayers();
  const { prayerTopics } = usePrayerTopics();

  // 기도제목 ID → 제목 매핑
  const prayerTopicTitles = useMemo(() => {
    const map = new Map<string, string>();
    for (const topic of prayerTopics) {
      map.set(topic.id, topic.title);
    }
    return map;
  }, [prayerTopics]);

  // 기도문이 있는 날짜들
  const prayerDates = useMemo(() => getPrayerDates(prayers), [prayers]);

  // 선택된 날짜의 기도문
  const filteredPrayers = useMemo(
    () => filterPrayersByDate(prayers, selectedDate),
    [prayers, selectedDate],
  );

  const formattedDate = format(selectedDate, "M월 d일");
  const isToday = isSameDay(selectedDate, new Date());

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <PageHeader title="기도문 모아보기" showBackButton={false} />

      <div className="flex-1 px-4 md:px-6 lg:px-8 pb-8 pt-4">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          <div className="lg:sticky lg:top-20">
            <PrayerCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              prayerDates={prayerDates}
              className="mb-6 lg:mb-0"
            />
          </div>

          <div>
            <h2 className="mb-4 text-sm font-medium text-soft-brown">
              {formattedDate}의 기도문
            </h2>
            <PrayerList
              prayers={filteredPrayers}
              prayerTopicTitles={prayerTopicTitles}
              isLoading={isLoading}
              isError={isError}
              error={error}
              emptyMessage="이 날 작성된 기도문이 없어요"
              showWriteButton={isToday}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
