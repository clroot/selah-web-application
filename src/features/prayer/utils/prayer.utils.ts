import { format, isSameDay, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

import type { Prayer } from "@/features/prayer/types/prayer.types";

/**
 * 기도문 날짜 포맷팅
 */
export function formatPrayerDate(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, "yyyy.MM.dd EEEE", { locale: ko });
}

/**
 * 기도문 날짜 (상세용)
 */
export function formatPrayerDateDetail(dateString: string): {
  main: string;
  sub: string;
} {
  const date = parseISO(dateString);
  return {
    main: format(date, "yyyy년 M월 d일", { locale: ko }),
    sub: format(date, "EEEE", { locale: ko }),
  };
}

/**
 * 기도문 미리보기 텍스트 (2줄)
 */
export function getPreviewText(content: string, maxLength = 100): string {
  const trimmed = content.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  return trimmed.slice(0, maxLength) + "...";
}

/**
 * 날짜별 기도문 그룹핑
 */
export function groupPrayersByDate(prayers: Prayer[]): Map<string, Prayer[]> {
  const grouped = new Map<string, Prayer[]>();

  for (const prayer of prayers) {
    const dateKey = format(parseISO(prayer.createdAt), "yyyy-MM-dd");
    const existing = grouped.get(dateKey) || [];
    grouped.set(dateKey, [...existing, prayer]);
  }

  return grouped;
}

/**
 * 특정 날짜의 기도문 필터링
 */
export function filterPrayersByDate(
  prayers: Prayer[],
  targetDate: Date,
): Prayer[] {
  return prayers.filter((prayer) =>
    isSameDay(parseISO(prayer.createdAt), targetDate),
  );
}

/**
 * 기도문이 있는 날짜 목록 추출
 */
export function getPrayerDates(prayers: Prayer[]): Set<string> {
  const dates = new Set<string>();
  for (const prayer of prayers) {
    dates.add(format(parseISO(prayer.createdAt), "yyyy-MM-dd"));
  }
  return dates;
}
