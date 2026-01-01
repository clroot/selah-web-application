"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { prayerApi } from "@/features/prayer/api/prayer.api";
import { useCrypto } from "@/shared/hooks/useCrypto";

import type {
  Prayer,
  PrayerListParams,
} from "@/features/prayer/types/prayer.types";

/** 복호화된 기도문 */
export type DecryptedPrayer = Prayer;

interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface UsePrayersResult {
  prayers: DecryptedPrayer[];
  pagination: Pagination | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * 기도문 목록 조회 훅
 *
 * E2E 암호화된 기도문을 조회하고 자동으로 복호화합니다.
 * 암호화가 해제되지 않은 상태에서는 쿼리가 비활성화됩니다.
 */
export function usePrayers(params?: PrayerListParams): UsePrayersResult {
  const { decryptData, isUnlocked } = useCrypto();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["prayers", params],
    queryFn: async () => {
      const { data, error } = await prayerApi.list(params);

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return { prayers: [], pagination: null };
      }

      // 복호화
      const decryptedPrayers = await Promise.all(
        data.content.map(async (prayer) => ({
          ...prayer,
          content: await decryptData(prayer.content),
        })),
      );

      return {
        prayers: decryptedPrayers,
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
    prayers: query.data?.prayers ?? [],
    pagination: query.data?.pagination ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ["prayers"] });
    },
  };
}
