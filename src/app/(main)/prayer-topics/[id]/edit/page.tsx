"use client";

import { useParams, useRouter } from "next/navigation";

import { PrayerTopicForm } from "@/features/prayer-topic/components";
import {
  usePrayerTopicDetail,
  useUpdatePrayerTopic,
} from "@/features/prayer-topic/hooks";
import { FullPageSpinner, PageHeader } from "@/shared/components";

import type { PrayerTopicFormData } from "@/features/prayer-topic/utils/schemas";

export default function EditPrayerTopicPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { prayerTopic, isLoading: isLoadingDetail } = usePrayerTopicDetail(id);
  const { mutateAsync: updatePrayerTopic, isPending } = useUpdatePrayerTopic();

  const handleSubmit = async (data: PrayerTopicFormData) => {
    await updatePrayerTopic({ id, title: data.title });
    router.push(`/prayer-topics/${id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  // 로딩 중
  if (isLoadingDetail) {
    return <FullPageSpinner />;
  }

  // 기도제목을 찾을 수 없음
  if (!prayerTopic) {
    return (
      <div className="flex min-h-screen flex-col">
        <PageHeader title="수정" onBack={handleCancel} />
        <div className="flex flex-1 flex-col items-center justify-center">
          <p className="text-soft-brown">기도제목을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* 헤더 */}
      <PageHeader title="기도제목 수정" onBack={handleCancel} />

      {/* 폼 */}
      <div className="flex-1 px-4 py-6">
        <PrayerTopicForm
          initialData={{ title: prayerTopic.title }}
          onSubmit={handleSubmit}
          isLoading={isPending}
          submitLabel="수정"
        />
      </div>
    </div>
  );
}
