"use client";

import { useState } from "react";

import {
  PrayerTopicList,
  StatusFilter,
} from "@/features/prayer-topic/components";
import { usePrayerTopics } from "@/features/prayer-topic/hooks";
import { PrayerTopicStatus } from "@/features/prayer-topic/types/prayerTopic.types";
import { PageHeader } from "@/shared/components";

import type { FilterStatus } from "@/features/prayer-topic/components";

export default function PrayerTopicsPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");

  // 필터 상태를 API 파라미터로 변환
  const statusParam =
    filterStatus === "ALL"
      ? undefined
      : filterStatus === "PRAYING"
        ? PrayerTopicStatus.PRAYING
        : PrayerTopicStatus.ANSWERED;

  const { prayerTopics, isLoading, isError, error } = usePrayerTopics({
    status: statusParam,
    size: 20,
  });

  return (
    <div className="flex min-h-screen flex-col">
      {/* 헤더 */}
      <PageHeader title="기도제목" showBackButton={false} />

      {/* 필터 */}
      <div className="px-4 py-3">
        <StatusFilter value={filterStatus} onChange={setFilterStatus} />
      </div>

      {/* 목록 */}
      <div className="flex-1 px-4 pb-4">
        <PrayerTopicList
          topics={prayerTopics}
          isLoading={isLoading}
          isError={isError}
          error={error}
          filterStatus={filterStatus}
        />
      </div>
    </div>
  );
}
