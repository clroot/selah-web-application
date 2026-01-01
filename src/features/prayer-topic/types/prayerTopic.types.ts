/**
 * Prayer Topic 도메인 타입 정의
 */

/** 기도제목 상태 */
export const PrayerTopicStatus = {
  PRAYING: "PRAYING",
  ANSWERED: "ANSWERED",
} as const;

export type PrayerTopicStatus =
  (typeof PrayerTopicStatus)[keyof typeof PrayerTopicStatus];

/** 기도제목 */
export interface PrayerTopic {
  id: string;
  title: string;
  status: PrayerTopicStatus;
  answeredAt: string | null;
  reflection: string | null;
  createdAt: string;
  updatedAt: string;
}

/** 기도제목 생성 요청 */
export interface CreatePrayerTopicRequest {
  title: string;
}

/** 기도제목 수정 요청 */
export interface UpdatePrayerTopicRequest {
  title: string;
}

/** 응답 체크 요청 */
export interface MarkAsAnsweredRequest {
  reflection?: string;
}

/** 소감 수정 요청 */
export interface UpdateReflectionRequest {
  reflection: string | null;
}

/** 기도제목 목록 조회 필터 */
export interface PrayerTopicListParams {
  page?: number;
  size?: number;
  status?: PrayerTopicStatus;
}
