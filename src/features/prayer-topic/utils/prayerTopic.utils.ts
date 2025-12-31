import type {
  PrayerTopic,
  PrayerTopicStatus,
} from '@/features/prayer-topic/types/prayerTopic.types';

/**
 * 날짜 문자열을 포맷팅된 문자열로 변환
 *
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns 'YYYY.MM.DD' 형식의 날짜 문자열
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

/**
 * 기도제목 상태에 따른 레이블 반환
 *
 * @param status - 기도제목 상태
 * @returns 상태 레이블
 */
export function getStatusLabel(status: PrayerTopicStatus): string {
  switch (status) {
    case 'PRAYING':
      return '기도 중';
    case 'ANSWERED':
      return '응답됨';
    default:
      return status;
  }
}

/**
 * 기도제목 상태에 따른 색상 클래스 반환
 *
 * @param status - 기도제목 상태
 * @returns Tailwind CSS 색상 클래스
 */
export function getStatusColorClass(status: PrayerTopicStatus): string {
  switch (status) {
    case 'PRAYING':
      return 'text-soft-brown bg-warm-beige';
    case 'ANSWERED':
      return 'text-deep-brown bg-sand';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

/**
 * 응답된 기도 비율 계산
 *
 * @param topics - 기도제목 배열
 * @returns 응답된 기도 비율 (0-100)
 */
export function calculateAnsweredRate(topics: PrayerTopic[]): number {
  if (topics.length === 0) return 0;
  const answered = topics.filter((t) => t.status === 'ANSWERED').length;
  return Math.round((answered / topics.length) * 100);
}

/**
 * 상대적 시간 표시 (예: '3일 전', '방금 전')
 *
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns 상대적 시간 문자열
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return '방금 전';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }
  if (diffDays < 7) {
    return `${diffDays}일 전`;
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks}주 전`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months}개월 전`;
  }
  const years = Math.floor(diffDays / 365);
  return `${years}년 전`;
}

/**
 * 기도제목을 상태별로 그룹화
 *
 * @param topics - 기도제목 배열
 * @returns 상태별로 그룹화된 기도제목 객체
 */
export function groupByStatus(topics: PrayerTopic[]): {
  praying: PrayerTopic[];
  answered: PrayerTopic[];
} {
  return {
    praying: topics.filter((t) => t.status === 'PRAYING'),
    answered: topics.filter((t) => t.status === 'ANSWERED'),
  };
}
