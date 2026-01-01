'use client';

import { useQuery } from '@tanstack/react-query';

import { prayerApi } from '@/features/prayer/api/prayer.api';
import { useCrypto } from '@/shared/hooks/useCrypto';

import type { Prayer } from '@/features/prayer/types/prayer.types';

interface UsePrayerDetailResult {
  prayer: Prayer | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * 기도문 상세 조회 훅
 *
 * E2E 암호화된 기도문을 조회하고 자동으로 복호화합니다.
 */
export function usePrayerDetail(id: string | null): UsePrayerDetailResult {
  const { decryptData, isUnlocked } = useCrypto();

  const query = useQuery({
    queryKey: ['prayer', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await prayerApi.getById(id);

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return null;
      }

      // 복호화
      return {
        ...data,
        content: await decryptData(data.content),
      };
    },
    enabled: isUnlocked && !!id,
  });

  return {
    prayer: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
