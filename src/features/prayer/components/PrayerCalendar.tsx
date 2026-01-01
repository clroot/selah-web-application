"use client";

import { useMemo, useState } from "react";

import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface PrayerCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  prayerDates: Set<string>;
  className?: string;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/**
 * 기도문 캘린더 컴포넌트
 */
export function PrayerCalendar({
  selectedDate,
  onDateSelect,
  prayerDates,
  className,
}: PrayerCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const daysArray: Date[] = [];
    let day = calendarStart;
    while (day <= calendarEnd) {
      daysArray.push(day);
      day = addDays(day, 1);
    }
    return daysArray;
  }, [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const hasPrayer = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return prayerDates.has(dateKey);
  };

  return (
    <div className={cn("px-6", className)}>
      {/* Month Navigation */}
      <div className="flex items-center justify-center gap-6 py-2 pb-5">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-sand"
          aria-label="이전 달"
        >
          <ChevronLeft className="h-5 w-5 text-soft-brown" />
        </button>
        <span className="min-w-[120px] text-center text-base font-medium text-deep-brown">
          {format(currentMonth, "yyyy년 M월", { locale: ko })}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-sand"
          aria-label="다음 달"
        >
          <ChevronRight className="h-5 w-5 text-soft-brown" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-2xl border border-sand bg-cream p-4">
        {/* Weekday Headers */}
        <div className="mb-2 grid grid-cols-7">
          {WEEKDAYS.map((weekday, index) => (
            <div
              key={weekday}
              className={cn(
                "py-2 text-center text-xs font-medium",
                index === 0 ? "text-red-400" : "text-soft-brown/60",
              )}
            >
              {weekday}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = isSameDay(day, selectedDate);
            const isTodayDate = isToday(day);
            const dayOfWeek = day.getDay();
            const hasPrayerOnDay = hasPrayer(day);

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => onDateSelect(day)}
                className={cn(
                  "relative flex aspect-square flex-col items-center justify-center rounded-xl transition-all",
                  !isCurrentMonth && "opacity-30",
                  isTodayDate && !isSelected && "bg-sand",
                  isSelected && "bg-deep-brown",
                  !isSelected && "hover:bg-cream-dark",
                )}
              >
                <span
                  className={cn(
                    "text-sm",
                    isSelected && "text-cream",
                    !isSelected && dayOfWeek === 0 && "text-red-400",
                    !isSelected && dayOfWeek !== 0 && "text-deep-brown",
                  )}
                >
                  {format(day, "d")}
                </span>
                <span
                  className={cn(
                    "mt-1 h-1 w-1 rounded-full",
                    hasPrayerOnDay
                      ? isSelected
                        ? "bg-cream"
                        : "bg-gold"
                      : "opacity-0",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
