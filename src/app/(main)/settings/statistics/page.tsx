"use client";

import { ComingSoon } from "@/shared/components";
import { PageHeader } from "@/shared/components";

export default function StatisticsPage() {
  return (
    <div className="min-h-screen bg-cream pb-safe">
      <PageHeader title="통계" showBackButton />
      <div className="px-4 md:px-6 lg:px-8">
        <ComingSoon
          title="통계 기능 준비 중입니다"
          description="기도 통계와 분석 기능이 곧 제공됩니다"
        />
      </div>
    </div>
  );
}
