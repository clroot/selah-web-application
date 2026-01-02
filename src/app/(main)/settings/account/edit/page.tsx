"use client";

import { ComingSoon } from "@/shared/components";
import { PageHeader } from "@/shared/components";

export default function AccountEditPage() {
  return (
    <div className="min-h-screen bg-cream pb-safe">
      <PageHeader title="계정 정보 수정" showBackButton />
      <div className="px-4 md:px-6 lg:px-8">
        <ComingSoon
          title="계정 정보 수정 기능 준비 중입니다"
          description="프로필 수정 기능이 곧 제공됩니다"
        />
      </div>
    </div>
  );
}
