/**
 * 시간대별 인사말 유틸리티
 */

/** 시간대 타입 */
type TimeOfDay = 'morning' | 'noon' | 'afternoon' | 'evening' | 'night';

/** 시간대별 인사말 */
const GREETINGS: Record<TimeOfDay, string> = {
  morning: '오늘 하루를 기도로 시작해보세요',
  noon: '잠시 멈추고, 기도의 시간을 가져보세요',
  afternoon: '오늘 하루, 어떤 감사가 있었나요?',
  evening: '하루를 마무리하며 기도해보세요',
  night: '고요한 밤, 주님과 대화해보세요',
};

/**
 * 현재 시간대를 반환합니다.
 */
export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 14) return 'noon';
  if (hour >= 14 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 21) return 'evening';
  return 'night';
}

/**
 * 시간대에 맞는 인사말을 반환합니다.
 */
export function getGreeting(hour: number = new Date().getHours()): string {
  const timeOfDay = getTimeOfDay(hour);
  return GREETINGS[timeOfDay];
}
