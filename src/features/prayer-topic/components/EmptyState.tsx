"use client";

import Link from "next/link";

import { Button } from "@/shared/components";
import { cn } from "@/shared/lib/utils";

import type { FilterStatus } from "./StatusFilter";

interface EmptyStateProps {
  filterStatus?: FilterStatus;
  className?: string;
}

/**
 * 기도제목 빈 상태 컴포넌트
 *
 * 기도제목이 없을 때 표시되는 안내 메시지와 생성 버튼을 제공합니다.
 * 필터 상태에 따라 다른 메시지를 표시합니다.
 */
export function EmptyState({
  filterStatus = "ALL",
  className,
}: EmptyStateProps) {
  const message = getEmptyMessage(filterStatus);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className,
      )}
    >
      <div className="mb-4 text-5xl" role="img" aria-label="기도 아이콘">
        🙏
      </div>
      <h3 className="mb-2 text-lg font-medium text-deep-brown">
        {message.title}
      </h3>
      <p className="mb-6 text-sm text-soft-brown">{message.description}</p>
      {filterStatus === "ALL" && (
        <Link href="/prayer-topics/new">
          <Button size="sm">기도제목 추가하기</Button>
        </Link>
      )}
    </div>
  );
}

function getEmptyMessage(filterStatus: FilterStatus): {
  title: string;
  description: string;
} {
  switch (filterStatus) {
    case "PRAYING":
      return {
        title: "기도 중인 제목이 없어요",
        description: "새로운 기도제목을 추가해보세요.",
      };
    case "ANSWERED":
      return {
        title: "응답받은 기도가 없어요",
        description: "기도 응답을 기대하며 계속 기도해보세요.",
      };
    default:
      return {
        title: "아직 기도제목이 없어요",
        description: "첫 번째 기도제목을 추가해보세요.",
      };
  }
}
