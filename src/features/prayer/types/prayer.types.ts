/**
 * Prayer 도메인 타입 정의
 */

/** 기도문 */
export interface Prayer {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

/** 기도문 생성 요청 */
export interface CreatePrayerRequest {
  content: string;
}

/** 기도문 수정 요청 */
export interface UpdatePrayerRequest {
  content: string;
}

/** 기도문 목록 조회 파라미터 */
export interface PrayerListParams {
  page?: number;
  size?: number;
}
