"use client";

import { parseAsStringLiteral, useQueryState } from "nuqs";

import {
  PrayerTopicList,
  StatusFilter,
} from "@/features/prayer-topic/components";
import { usePrayerTopics } from "@/features/prayer-topic/hooks";
import { PrayerTopicStatus } from "@/features/prayer-topic/types/prayerTopic.types";
import { PageHeader } from "@/shared/components";

const statusParser = parseAsStringLiteral(["PRAYING", "ANSWERED"] as const);

export default function PrayerTopicsPage() {
  const [status, setStatus] = useQueryState("status", statusParser);
  const filterStatus = status ?? "ALL";

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

  const handleFilterChange = (value: "ALL" | "PRAYING" | "ANSWERED") => {
    setStatus(value === "ALL" ? null : value);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="기도제목" showBackButton={false} />

      <div className="px-4 py-3">
        <StatusFilter value={filterStatus} onChange={handleFilterChange} />
      </div>

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
