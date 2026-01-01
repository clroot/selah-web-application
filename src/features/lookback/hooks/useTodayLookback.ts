"use client";

import { useQuery } from "@tanstack/react-query";

import { lookbackApi } from "@/features/lookback/api/lookback.api";
import { useCrypto } from "@/shared/hooks/useCrypto";

import type { DecryptedLookbackResponse } from "@/features/lookback/types/lookback.types";

export function useTodayLookback() {
  const { decryptData, isUnlocked } = useCrypto();

  return useQuery({
    queryKey: ["lookback", "today"],
    queryFn: async (): Promise<DecryptedLookbackResponse | null> => {
      const { data, error } = await lookbackApi.getToday();

      if (error) throw new Error(error.message);
      if (!data) return null;

      const decryptedPrayerTopic = {
        ...data.prayerTopic,
        title: await decryptData(data.prayerTopic.title),
        reflection: data.prayerTopic.reflection
          ? await decryptData(data.prayerTopic.reflection)
          : null,
      };

      return {
        ...data,
        prayerTopic: decryptedPrayerTopic,
      };
    },
    enabled: isUnlocked,
  });
}
