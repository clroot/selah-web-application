import { apiClient } from "@/shared/api/client";

import type {
  CreatePrayerRequest,
  Prayer,
  PrayerListParams,
  UpdatePrayerRequest,
} from "@/features/prayer/types/prayer.types";
import type { PageResponse } from "@/shared/types/api.types";

/**
 * Prayer API
 */
export const prayerApi = {
  /** 기도문 생성 */
  create: (data: CreatePrayerRequest) =>
    apiClient.post<Prayer>("/api/v1/prayers", data),

  /** 기도문 목록 조회 */
  list: (params: PrayerListParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined)
      searchParams.set("page", String(params.page));
    if (params.size !== undefined)
      searchParams.set("size", String(params.size));
    if (params.prayerTopicId !== undefined)
      searchParams.set("prayerTopicId", params.prayerTopicId);

    const query = searchParams.toString();
    const url = query ? `/api/v1/prayers?${query}` : "/api/v1/prayers";

    return apiClient.get<PageResponse<Prayer>>(url);
  },

  /** 기도문 단건 조회 */
  getById: (id: string) => apiClient.get<Prayer>(`/api/v1/prayers/${id}`),

  /** 기도문 수정 */
  update: (id: string, data: UpdatePrayerRequest) =>
    apiClient.patch<Prayer>(`/api/v1/prayers/${id}`, data),

  /** 기도문 삭제 */
  delete: (id: string) => apiClient.delete<void>(`/api/v1/prayers/${id}`),
};
