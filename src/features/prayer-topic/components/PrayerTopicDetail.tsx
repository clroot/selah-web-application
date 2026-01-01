'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';

import { Button } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { AnswerCheckBottomSheet } from './AnswerCheckBottomSheet';
import {
  formatDate,
  getStatusLabel,
  getStatusColorClass,
} from '@/features/prayer-topic/utils/prayerTopic.utils';
import {
  useMarkAsAnswered,
  useCancelAnswer,
  useDeletePrayerTopic,
} from '@/features/prayer-topic/hooks';

import type { PrayerTopic } from '@/features/prayer-topic/types/prayerTopic.types';

interface PrayerTopicDetailProps {
  topic: PrayerTopic;
  className?: string;
}

/**
 * 기도제목 상세 컴포넌트
 *
 * 기도제목의 상세 정보와 액션 버튼들을 표시합니다.
 */
export function PrayerTopicDetail({
  topic,
  className,
}: PrayerTopicDetailProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnswerSheetOpen, setIsAnswerSheetOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { mutateAsync: markAsAnswered, isPending: isMarking } =
    useMarkAsAnswered();
  const { mutateAsync: cancelAnswer, isPending: isCanceling } =
    useCancelAnswer();
  const { mutateAsync: deleteTopic, isPending: isDeleting } =
    useDeletePrayerTopic();

  const isAnswered = topic.status === 'ANSWERED';

  const handleEdit = useCallback(() => {
    setIsMenuOpen(false);
    router.push(`/prayer-topics/${topic.id}/edit`);
  }, [router, topic.id]);

  const handleDelete = useCallback(async () => {
    await deleteTopic(topic.id);
    router.push('/prayer-topics');
  }, [deleteTopic, topic.id, router]);

  const handleAnswerCheck = useCallback(
    async (reflection?: string) => {
      await markAsAnswered({ id: topic.id, reflection });
      setIsAnswerSheetOpen(false);
    },
    [markAsAnswered, topic.id]
  );

  const handleCancelAnswer = useCallback(async () => {
    await cancelAnswer(topic.id);
  }, [cancelAnswer, topic.id]);

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* 상태 배지 */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
            getStatusColorClass(topic.status)
          )}
        >
          {getStatusLabel(topic.status)}
        </span>

        {/* 더보기 메뉴 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-full p-2 text-soft-brown hover:bg-warm-beige hover:text-deep-brown"
            aria-label="더보기"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1 w-32 rounded-xl border border-sand bg-white py-1 shadow-lg">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-deep-brown hover:bg-warm-beige"
                >
                  <Edit className="h-4 w-4" />
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsDeleteConfirmOpen(true);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  삭제
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 제목 */}
      <div>
        <h2 className="font-serif text-xl font-medium leading-relaxed text-deep-brown">
          {topic.title}
        </h2>
        <p className="mt-2 text-sm text-soft-brown">
          작성일: {formatDate(topic.createdAt)}
        </p>
      </div>

      {/* 응답 정보 (응답됨 상태일 때) */}
      {isAnswered && (
        <div className="rounded-2xl bg-warm-beige/50 p-4">
          <p className="mb-1 text-sm font-medium text-deep-brown">
            응답일: {topic.answeredAt ? formatDate(topic.answeredAt) : '-'}
          </p>
          {topic.reflection && (
            <div className="mt-3">
              <p className="mb-1 text-xs text-soft-brown">응답 소감</p>
              <p className="font-serif text-base leading-relaxed text-deep-brown">
                {topic.reflection}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="mt-4">
        {isAnswered ? (
          <Button
            variant="secondary"
            onClick={handleCancelAnswer}
            isLoading={isCanceling}
          >
            응답 취소
          </Button>
        ) : (
          <Button
            onClick={() => setIsAnswerSheetOpen(true)}
            isLoading={isMarking}
          >
            응답됨으로 체크하기
          </Button>
        )}
      </div>

      {/* 응답 체크 바텀 시트 */}
      <AnswerCheckBottomSheet
        isOpen={isAnswerSheetOpen}
        onClose={() => setIsAnswerSheetOpen(false)}
        onConfirm={handleAnswerCheck}
        isLoading={isMarking}
      />

      {/* 삭제 확인 모달 */}
      {isDeleteConfirmOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setIsDeleteConfirmOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-medium text-deep-brown">
              기도제목 삭제
            </h3>
            <p className="mb-6 text-sm text-soft-brown">
              이 기도제목을 삭제하시겠습니까?
              <br />
              삭제된 기도제목은 복구할 수 없습니다.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsDeleteConfirmOpen(false)}
                disabled={isDeleting}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                isLoading={isDeleting}
                className="flex-1"
              >
                삭제
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
