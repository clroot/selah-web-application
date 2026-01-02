"use client";

import { useRouter } from "next/navigation";

import { StatCard } from "./StatCard";
import { useHomeStats } from "./useHomeStats";

/**
 * 통계 그리드 컴포넌트
 */
export function StatsGrid() {
  const router = useRouter();
  const { data, isLoading } = useHomeStats();

  const prayingCount = data?.prayingCount ?? 0;
  const answeredCount = data?.answeredCount ?? 0;

  const handlePrayingClick = () => {
    router.push("/prayer-topics?status=PRAYING");
  };

  const handleAnsweredClick = () => {
    router.push("/prayer-topics?status=ANSWERED");
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-4">
        <div className="h-24 animate-pulse rounded-2xl border border-sand bg-sand/30" />
        <div className="h-24 animate-pulse rounded-2xl border border-sand bg-sand/30" />
      </div>
    );
  }

  return (
    <section>
      <h2 className="mb-4 text-base font-medium text-deep-brown">나의 기도</h2>
      <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-4">
        <StatCard
          value={prayingCount}
          label="기도 중인 제목"
          onClick={handlePrayingClick}
        />
        <StatCard
          value={answeredCount}
          label="응답받은 기도"
          isHighlight
          onClick={handleAnsweredClick}
        />
      </div>
    </section>
  );
}
