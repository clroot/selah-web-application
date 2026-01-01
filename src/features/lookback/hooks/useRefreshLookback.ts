"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { lookbackApi } from "@/features/lookback/api/lookback.api";
import { useCrypto } from "@/shared/hooks/useCrypto";

import type { DecryptedLookbackResponse } from "@/features/lookback/types/lookback.types";

export function useRefreshLookback() {
  const queryClient = useQueryClient();
  const { decryptData } = useCrypto();

  return useMutation({
    mutationFn: async (): Promise<DecryptedLookbackResponse> => {
      const { data, error } = await lookbackApi.refresh();

      if (error) throw new Error(error.message);
      if (!data) throw new Error("Failed to refresh lookback");

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lookback", "today"] });
    },
  });
}
