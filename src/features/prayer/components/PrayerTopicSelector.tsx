"use client";

import { useState } from "react";

import { Check, ChevronDown, X } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface PrayerTopic {
  id: string;
  title: string;
}

interface PrayerTopicSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  prayerTopics: PrayerTopic[];
  isLoading?: boolean;
  className?: string;
}

/**
 * 기도제목 선택 컴포넌트
 *
 * 기도문 작성 시 연결할 기도제목을 선택합니다.
 * 기도 중인 기도제목만 표시됩니다.
 */
export function PrayerTopicSelector({
  selectedIds,
  onChange,
  prayerTopics,
  isLoading = false,
  className,
}: PrayerTopicSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleRemove = (id: string) => {
    onChange(selectedIds.filter((selectedId) => selectedId !== id));
  };

  const selectedTopics = prayerTopics.filter((topic) =>
    selectedIds.includes(topic.id),
  );

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <label className="text-xs font-medium text-soft-brown">
        기도할 제목
      </label>

      {/* 선택된 항목들 */}
      {selectedTopics.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTopics.map((topic) => (
            <span
              key={topic.id}
              className="inline-flex items-center gap-1 rounded-full bg-gold-soft px-3 py-1.5 text-sm text-soft-brown"
            >
              <span className="max-w-[120px] truncate">{topic.title}</span>
              <button
                type="button"
                onClick={() => handleRemove(topic.id)}
                className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-sand"
                aria-label={`${topic.title} 제거`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 드롭다운 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={cn(
          "flex items-center justify-between rounded-xl border border-sand bg-cream px-4 py-3",
          "text-sm text-soft-brown",
          "transition-colors hover:border-sand-dark",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <span>
          {isLoading
            ? "불러오는 중..."
            : selectedIds.length > 0
              ? `${selectedIds.length}개 선택됨`
              : "기도제목 선택 (선택사항)"}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {/* 드롭다운 목록 */}
      {isOpen && (
        <div className="rounded-xl border border-sand bg-white shadow-sm">
          {prayerTopics.length === 0 ? (
            <div className="px-4 py-3 text-sm text-soft-brown/60">
              기도 중인 기도제목이 없습니다
            </div>
          ) : (
            <ul className="max-h-48 overflow-y-auto py-2">
              {prayerTopics.map((topic) => {
                const isSelected = selectedIds.includes(topic.id);
                return (
                  <li key={topic.id}>
                    <button
                      type="button"
                      onClick={() => handleToggle(topic.id)}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-left",
                        "transition-colors hover:bg-cream-dark",
                        isSelected && "bg-gold-soft",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded border",
                          isSelected
                            ? "border-deep-brown bg-deep-brown"
                            : "border-sand bg-white",
                        )}
                      >
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-white" />
                        )}
                      </div>
                      <span className="flex-1 truncate text-sm text-deep-brown">
                        {topic.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
