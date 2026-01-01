"use client";

import { cn } from "@/shared/lib/utils";

/** 필터 상태 타입 */
export type FilterStatus = "ALL" | "PRAYING" | "ANSWERED";

interface StatusFilterProps {
  value: FilterStatus;
  onChange: (status: FilterStatus) => void;
  className?: string;
}

const filters: { value: FilterStatus; label: string }[] = [
  { value: "ALL", label: "전체" },
  { value: "PRAYING", label: "기도 중" },
  { value: "ANSWERED", label: "응답받음" },
];

/**
 * 기도제목 상태 필터 컴포넌트
 *
 * 전체/기도 중/응답받음 상태를 선택할 수 있는 탭 필터입니다.
 */
export function StatusFilter({
  value,
  onChange,
  className,
}: StatusFilterProps) {
  return (
    <div
      className={cn("flex gap-2 rounded-full bg-warm-beige/50 p-1", className)}
      role="tablist"
      aria-label="기도제목 상태 필터"
    >
      {filters.map((filter) => {
        const isSelected = value === filter.value;
        return (
          <button
            key={filter.value}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(filter.value)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-deep-brown focus:ring-offset-2",
              isSelected
                ? "bg-white text-deep-brown shadow-sm"
                : "text-soft-brown hover:text-deep-brown",
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
