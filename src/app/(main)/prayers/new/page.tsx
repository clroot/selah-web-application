"use client";

import { useMemo } from "react";

import { useRouter } from "next/navigation";

import { format } from "date-fns";
import { ko } from "date-fns/locale";

import { PrayerEditor } from "@/features/prayer/components";
import { useCreatePrayer } from "@/features/prayer/hooks";
import { usePrayerTopics } from "@/features/prayer-topic/hooks";
import { PrayerTopicStatus } from "@/features/prayer-topic/types/prayerTopic.types";
import { PageHeader } from "@/shared/components";

import type { PrayerFormData } from "@/features/prayer/utils/schemas";

export default function NewPrayerPage() {
  const router = useRouter();
  const { mutateAsync: createPrayer, isPending } = useCreatePrayer();
  const { prayerTopics, isLoading: isLoadingTopics } = usePrayerTopics({
    status: PrayerTopicStatus.PRAYING,
  });

  // PrayerEditor에 전달할 형태로 변환
  const topicsForSelector = useMemo(
    () => prayerTopics.map((t) => ({ id: t.id, title: t.title })),
    [prayerTopics],
  );

  const today = new Date();
  const formattedDate = format(today, "yyyy년 M월 d일 EEEE", { locale: ko });

  const handleSubmit = async (data: PrayerFormData) => {
    await createPrayer({
      content: data.content,
      prayerTopicIds: data.prayerTopicIds,
    });
    router.push("/prayers");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {/* 헤더 */}
      <PageHeader title="기도문 작성" onBack={handleCancel} />

      {/* 오늘 날짜 */}
      <div className="px-6 py-4">
        <span className="text-sm text-soft-brown/60">{formattedDate}</span>
      </div>

      {/* 에디터 */}
      <div className="flex-1 px-4 pb-8">
        <PrayerEditor
          onSubmit={handleSubmit}
          isLoading={isPending}
          submitLabel="저장"
          prayerTopics={topicsForSelector}
          isLoadingTopics={isLoadingTopics}
        />
      </div>
    </div>
  );
}
