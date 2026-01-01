'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { prayerTopicApi } from '@/features/prayer-topic/api/prayerTopic.api';
import { useCrypto } from '@/shared/hooks/useCrypto';

import type {
  PrayerTopic,
  PrayerTopicListParams,
} from '@/features/prayer-topic/types/prayerTopic.types';

/** 복호화된 기도제목 */
export type DecryptedPrayerTopic = PrayerTopic;

interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface UsePrayerTopicsResult {
  prayerTopics: DecryptedPrayerTopic[];
  pagination: Pagination | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * 기도제목 목록 조회 훅
 *
 * E2E 암호화된 기도제목을 조회하고 자동으로 복호화합니다.
 * 암호화가 해제되지 않은 상태에서는 쿼리가 비활성화됩니다.
 *
 * @param params - 목록 조회 파라미터 (page, size, status)
 */
export function usePrayerTopics(
  params?: PrayerTopicListParams
): UsePrayerTopicsResult {
  const { decryptData, isUnlocked } = useCrypto();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['prayerTopics', params],
    queryFn: async () => {
      const { data, error } = await prayerTopicApi.list(params);

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return { prayerTopics: [], pagination: null };
      }

      // 복호화
      const decryptedTopics = await Promise.all(
        data.content.map(async (topic) => ({
          ...topic,
          title: await decryptData(topic.title),
          reflection: topic.reflection
            ? await decryptData(topic.reflection)
            : null,
        }))
      );

      return {
        prayerTopics: decryptedTopics,
        pagination: {
          page: data.page,
          size: data.size,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
        },
      };
    },
    enabled: isUnlocked,
  });

  return {
    prayerTopics: query.data?.prayerTopics ?? [],
    pagination: query.data?.pagination ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ['prayerTopics'] });
    },
  };
}
