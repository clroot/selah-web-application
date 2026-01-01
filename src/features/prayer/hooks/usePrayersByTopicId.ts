"use client";

import { useQuery } from "@tanstack/react-query";

import { prayerApi } from "@/features/prayer/api/prayer.api";
import { useCrypto } from "@/shared/hooks/useCrypto";

import type { Prayer } from "@/features/prayer/types/prayer.types";

interface UsePrayersByTopicIdResult {
  prayers: Prayer[];
  totalElements: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export function usePrayersByTopicId(
  prayerTopicId: string,
  size: number = 5,
): UsePrayersByTopicIdResult {
  const { decryptData, isUnlocked } = useCrypto();

  const query = useQuery({
    queryKey: ["prayers", "byTopicId", prayerTopicId, size],
    queryFn: async () => {
      const { data, error } = await prayerApi.list({
        prayerTopicId,
        size,
        page: 0,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return { prayers: [], totalElements: 0 };
      }

      const decryptedPrayers = await Promise.all(
        data.content.map(async (prayer) => ({
          ...prayer,
          content: await decryptData(prayer.content),
        })),
      );

      return {
        prayers: decryptedPrayers,
        totalElements: data.totalElements,
      };
    },
    enabled: isUnlocked && !!prayerTopicId,
  });

  return {
    prayers: query.data?.prayers ?? [],
    totalElements: query.data?.totalElements ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
