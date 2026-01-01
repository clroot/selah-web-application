"use client";

import { BookOpen } from "lucide-react";

export function LookbackEmptyState() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-dashed border-sand bg-cream/50 px-5 py-[18px]">
      <BookOpen className="h-5 w-5 flex-shrink-0 text-soft-brown/50" />
      <p className="text-sm text-soft-brown">
        7일 이상 된 기도제목이 생기면 여기에 표시돼요
      </p>
    </div>
  );
}
