'use client';

import { useQuery } from '@tanstack/react-query';

import { useCrypto } from '@/features/encryption/hooks';
import { prayerTopicApi } from '@/features/prayer-topic/api/prayerTopic.api';

import type { PrayerTopic } from '@/features/prayer-topic/types/prayerTopic.types';

/** 복호화된 기도제목 */
export type DecryptedPrayerTopicDetail = PrayerTopic;

interface UsePrayerTopicDetailResult {
  prayerTopic: DecryptedPrayerTopicDetail | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * 기도제목 상세 조회 훅
 *
 * E2E 암호화된 기도제목을 조회하고 자동으로 복호화합니다.
 * 암호화가 해제되지 않은 상태에서는 쿼리가 비활성화됩니다.
 *
 * @param id - 기도제목 ID
 */
export function usePrayerTopicDetail(id: string): UsePrayerTopicDetailResult {
  const { decryptData, isUnlocked } = useCrypto();

  const query = useQuery({
    queryKey: ['prayerTopics', id],
    queryFn: async () => {
      const { data, error } = await prayerTopicApi.getById(id);

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return null;
      }

      // 복호화
      return {
        ...data,
        title: await decryptData(data.title),
        reflection: data.reflection
          ? await decryptData(data.reflection)
          : null,
      };
    },
    enabled: isUnlocked && !!id,
  });

  return {
    prayerTopic: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
