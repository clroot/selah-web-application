import { apiClient } from "@/shared/api/client";

import type { LookbackResponse } from "@/features/lookback/types/lookback.types";

export const lookbackApi = {
  getToday: () =>
    apiClient.get<LookbackResponse | null>(
      "/api/v1/prayer-topics/lookback/today",
    ),

  refresh: () =>
    apiClient.post<LookbackResponse>(
      "/api/v1/prayer-topics/lookback/refresh",
    ),
};
