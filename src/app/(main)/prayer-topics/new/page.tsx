'use client';

import { useRouter } from 'next/navigation';

import { PrayerTopicForm } from '@/features/prayer-topic/components';
import { useCreatePrayerTopic } from '@/features/prayer-topic/hooks';
import { PageHeader } from '@/shared/components';

import type { PrayerTopicFormData } from '@/features/prayer-topic/utils/schemas';

export default function NewPrayerTopicPage() {
  const router = useRouter();
  const { mutateAsync: createPrayerTopic, isPending } = useCreatePrayerTopic();

  const handleSubmit = async (data: PrayerTopicFormData) => {
    await createPrayerTopic(data.title);
    router.push('/prayer-topics');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* 헤더 */}
      <PageHeader
        title="새 기도제목"
        onBack={handleCancel}
      />

      {/* 폼 */}
      <div className="flex-1 px-4 py-6">
        <PrayerTopicForm
          onSubmit={handleSubmit}
          isLoading={isPending}
          submitLabel="저장"
        />
      </div>
    </div>
  );
}
