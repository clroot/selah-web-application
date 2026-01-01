"use client";

import { useMemo, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { PrayerDetail } from "@/features/prayer/components";
import { useDeletePrayer, usePrayerDetail } from "@/features/prayer/hooks";
import { usePrayerTopics } from "@/features/prayer-topic/hooks";
import { FullPageSpinner, PageHeader } from "@/shared/components";
import { cn } from "@/shared/lib/utils";

export default function PrayerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { prayer, isLoading, isError, error } = usePrayerDetail(id);
  const { prayerTopics } = usePrayerTopics();
  const { mutateAsync: deletePrayer } = useDeletePrayer();

  // 기도제목 ID → 제목 매핑
  const prayerTopicTitles = useMemo(() => {
    const map = new Map<string, string>();
    for (const topic of prayerTopics) {
      map.set(topic.id, topic.title);
    }
    return map;
  }, [prayerTopics]);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    setIsMenuOpen(false);
    router.push(`/prayers/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm("이 기도문을 삭제하시겠습니까?")) return;

    setIsDeleting(true);
    try {
      await deletePrayer(id);
      router.push("/prayers");
    } catch {
      setIsDeleting(false);
    }
  };

  // 로딩 중
  if (isLoading) {
    return <FullPageSpinner />;
  }

  // 에러 발생
  if (isError) {
    return (
      <div className="flex min-h-screen flex-col bg-cream">
        <PageHeader onBack={handleBack} />
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <div className="mb-4 text-4xl">😢</div>
          <h2 className="mb-2 text-lg font-medium text-deep-brown">
            오류가 발생했습니다
          </h2>
          <p className="text-sm text-soft-brown">
            {error?.message ?? "잠시 후 다시 시도해주세요."}
          </p>
        </div>
      </div>
    );
  }

  // 기도문을 찾을 수 없음
  if (!prayer) {
    return (
      <div className="flex min-h-screen flex-col bg-cream">
        <PageHeader onBack={handleBack} />
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <div className="mb-4 text-4xl">🔍</div>
          <h2 className="mb-2 text-lg font-medium text-deep-brown">
            기도문을 찾을 수 없습니다
          </h2>
          <p className="text-sm text-soft-brown">
            삭제되었거나 존재하지 않는 기도문입니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {/* 헤더 */}
      <PageHeader
        onBack={handleBack}
        rightAction={
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-sand"
              aria-label="더보기"
            >
              <MoreVertical className="h-5 w-5 text-soft-brown" />
            </button>

            {/* 드롭다운 메뉴 */}
            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 top-full z-20 mt-1 w-32 overflow-hidden rounded-xl border border-sand bg-white shadow-lg">
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-deep-brown transition-colors hover:bg-cream-dark"
                  >
                    <Pencil className="h-4 w-4" />
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={cn(
                      "flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-500 transition-colors hover:bg-red-50",
                      isDeleting && "cursor-not-allowed opacity-50",
                    )}
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeleting ? "삭제 중..." : "삭제"}
                  </button>
                </div>
              </>
            )}
          </div>
        }
      />

      {/* 상세 내용 */}
      <div className="flex-1 pt-4">
        <PrayerDetail prayer={prayer} prayerTopicTitles={prayerTopicTitles} />
      </div>
    </div>
  );
}
