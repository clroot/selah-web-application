'use client';

import { useMemo } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { PrayerEditor } from '@/features/prayer/components';
import { usePrayerDetail, useUpdatePrayer } from '@/features/prayer/hooks';
import { formatPrayerDateDetail } from '@/features/prayer/utils';
import { usePrayerTopics } from '@/features/prayer-topic/hooks';
import { PrayerTopicStatus } from '@/features/prayer-topic/types/prayerTopic.types';
import { FullPageSpinner, PageHeader } from '@/shared/components';

import type { PrayerFormData } from '@/features/prayer/utils/schemas';

export default function EditPrayerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { prayer, isLoading: isLoadingDetail } = usePrayerDetail(id);
  const { mutateAsync: updatePrayer, isPending } = useUpdatePrayer();
  const { prayerTopics, isLoading: isLoadingTopics } = usePrayerTopics({
    status: PrayerTopicStatus.PRAYING,
  });

  // PrayerEditor에 전달할 형태로 변환
  const topicsForSelector = useMemo(
    () => prayerTopics.map((t) => ({ id: t.id, title: t.title })),
    [prayerTopics]
  );

  const initialData = useMemo((): PrayerFormData | undefined => {
    if (!prayer) return undefined;
    return {
      content: prayer.content,
      prayerTopicIds: prayer.prayerTopicIds,
    };
  }, [prayer]);

  const handleSubmit = async (data: PrayerFormData) => {
    await updatePrayer({
      id,
      data: {
        content: data.content,
        prayerTopicIds: data.prayerTopicIds,
      },
    });
    router.push(`/prayers/${id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  // 로딩 중
  if (isLoadingDetail) {
    return <FullPageSpinner />;
  }

  // 기도문을 찾을 수 없음
  if (!prayer) {
    return (
      <div className="flex min-h-screen flex-col bg-cream">
        <PageHeader title="기도문 수정" onBack={handleCancel} />
        <div className="flex flex-1 flex-col items-center justify-center">
          <p className="text-soft-brown">기도문을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const { main, sub } = formatPrayerDateDetail(prayer.createdAt);

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {/* 헤더 */}
      <PageHeader title="기도문 수정" onBack={handleCancel} />

      {/* 날짜 표시 */}
      <div className="px-6 py-4">
        <span className="text-sm text-soft-brown/60">
          {main} {sub}
        </span>
      </div>

      {/* 에디터 */}
      <div className="flex-1 px-4 pb-8">
        <PrayerEditor
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={isPending}
          submitLabel="수정"
          prayerTopics={topicsForSelector}
          isLoadingTopics={isLoadingTopics}
        />
      </div>
    </div>
  );
}
