import { apiClient } from '@/shared/api/client';

import type {
  CreatePrayerTopicRequest,
  MarkAsAnsweredRequest,
  PrayerTopic,
  PrayerTopicListParams,
  UpdatePrayerTopicRequest,
  UpdateReflectionRequest,
} from '@/features/prayer-topic/types/prayerTopic.types';
import type { PageResponse } from '@/shared/types/api.types';


/**
 * Prayer Topic API
 */
export const prayerTopicApi = {
  /** 기도제목 생성 */
  create: (data: CreatePrayerTopicRequest) =>
    apiClient.post<PrayerTopic>('/api/v1/prayer-topics', data),

  /** 기도제목 목록 조회 */
  list: (params: PrayerTopicListParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.set('page', String(params.page));
    if (params.size !== undefined) searchParams.set('size', String(params.size));
    if (params.status !== undefined) searchParams.set('status', params.status);

    const query = searchParams.toString();
    const url = query ? `/api/v1/prayer-topics?${query}` : '/api/v1/prayer-topics';

    return apiClient.get<PageResponse<PrayerTopic>>(url);
  },

  /** 기도제목 단건 조회 */
  getById: (id: string) =>
    apiClient.get<PrayerTopic>(`/api/v1/prayer-topics/${id}`),

  /** 기도제목 수정 */
  update: (id: string, data: UpdatePrayerTopicRequest) =>
    apiClient.patch<PrayerTopic>(`/api/v1/prayer-topics/${id}`, data),

  /** 기도제목 삭제 */
  delete: (id: string) =>
    apiClient.delete<void>(`/api/v1/prayer-topics/${id}`),

  /** 응답 체크 */
  markAsAnswered: (id: string, data?: MarkAsAnsweredRequest) =>
    apiClient.post<PrayerTopic>(`/api/v1/prayer-topics/${id}/answer`, data),

  /** 응답 취소 */
  cancelAnswer: (id: string) =>
    apiClient.delete<PrayerTopic>(`/api/v1/prayer-topics/${id}/answer`),

  /** 소감 수정 */
  updateReflection: (id: string, data: UpdateReflectionRequest) =>
    apiClient.patch<PrayerTopic>(`/api/v1/prayer-topics/${id}/reflection`, data),
};
