'use client';

import { useParams, useRouter } from 'next/navigation';

import { PrayerTopicDetail } from '@/features/prayer-topic/components';
import { usePrayerTopicDetail } from '@/features/prayer-topic/hooks';
import { FullPageSpinner, PageHeader } from '@/shared/components';

export default function PrayerTopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { prayerTopic, isLoading, isError, error } = usePrayerTopicDetail(id);

  const handleBack = () => {
    router.back();
  };

  // 로딩 중
  if (isLoading) {
    return <FullPageSpinner />;
  }

  // 에러 발생
  if (isError) {
    return (
      <div className="flex min-h-screen flex-col">
        <PageHeader onBack={handleBack} />
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <div className="mb-4 text-4xl">😢</div>
          <h2 className="mb-2 text-lg font-medium text-deep-brown">
            오류가 발생했습니다
          </h2>
          <p className="text-sm text-soft-brown">
            {error?.message ?? '잠시 후 다시 시도해주세요.'}
          </p>
        </div>
      </div>
    );
  }

  // 기도제목을 찾을 수 없음
  if (!prayerTopic) {
    return (
      <div className="flex min-h-screen flex-col">
        <PageHeader onBack={handleBack} />
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <div className="mb-4 text-4xl">🔍</div>
          <h2 className="mb-2 text-lg font-medium text-deep-brown">
            기도제목을 찾을 수 없습니다
          </h2>
          <p className="text-sm text-soft-brown">
            삭제되었거나 존재하지 않는 기도제목입니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* 헤더 */}
      <PageHeader onBack={handleBack} />

      {/* 상세 내용 */}
      <div className="flex-1 px-4 py-6">
        <PrayerTopicDetail topic={prayerTopic} />
      </div>
    </div>
  );
}
