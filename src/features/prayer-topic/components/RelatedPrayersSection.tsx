"use client";

import Link from "next/link";

import { useQuery } from "@tanstack/react-query";

import { prayerTopicApi } from "@/features/prayer-topic/api/prayerTopic.api";
import { useCrypto } from "@/shared/hooks/useCrypto";
import { cn } from "@/shared/lib/utils";


interface RelatedPrayer {
  id: string;
  content: string;
  createdAt: string;
}

interface RelatedPrayersSectionProps {
  prayerTopicId: string;
  className?: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getPreviewText(text: string, maxLength: number = 80): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function RelatedPrayersSection({
  prayerTopicId,
  className,
}: RelatedPrayersSectionProps) {
  const { decryptData, isUnlocked } = useCrypto();

  const { data, isLoading } = useQuery({
    queryKey: ["prayers", "byTopicId", prayerTopicId],
    queryFn: async () => {
      const { data, error } = await prayerTopicApi.getRelatedPrayers(
        prayerTopicId,
        { size: 5 },
      );

      if (error) throw new Error(error.message);
      if (!data) return { prayers: [], totalElements: 0 };

      const decryptedPrayers = await Promise.all(
        data.content.map(async (prayer) => ({
          ...prayer,
          content: await decryptData(prayer.content),
        })),
      );

      return {
        prayers: decryptedPrayers,
        totalElements: data.totalElements,
      };
    },
    enabled: isUnlocked && !!prayerTopicId,
  });

  const prayers = data?.prayers ?? [];
  const totalElements = data?.totalElements ?? 0;

  if (isLoading) {
    return (
      <section className={cn("mt-8", className)}>
        <h3 className="mb-4 text-base font-medium text-deep-brown">
          관련 기도문
        </h3>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-warm-beige/50"
            />
          ))}
        </div>
      </section>
    );
  }

  if (prayers.length === 0) {
    return (
      <section className={cn("mt-8", className)}>
        <h3 className="mb-4 text-base font-medium text-deep-brown">
          관련 기도문
        </h3>
        <div className="rounded-2xl bg-warm-beige/30 p-6 text-center">
          <p className="text-sm text-soft-brown">
            아직 이 기도제목으로 작성된 기도문이 없습니다.
          </p>
          <Link
            href={`/prayers/new?prayerTopicId=${prayerTopicId}`}
            className="mt-3 inline-block text-sm font-medium text-deep-brown underline underline-offset-2"
          >
            기도문 작성하기
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("mt-8", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-medium text-deep-brown">
          관련 기도문 ({totalElements})
        </h3>
        {totalElements > 5 && (
          <Link
            href={`/prayers?prayerTopicId=${prayerTopicId}`}
            className="text-sm text-soft-brown hover:text-deep-brown"
          >
            전체보기
          </Link>
        )}
      </div>
      <div className="space-y-3">
        {prayers.map((prayer: RelatedPrayer) => (
          <Link
            key={prayer.id}
            href={`/prayers/${prayer.id}`}
            className={cn(
              "block rounded-2xl border border-sand bg-cream p-4",
              "transition-all duration-200",
              "hover:border-sand-dark hover:bg-cream-dark",
            )}
          >
            <div className="mb-2 text-xs text-soft-brown/60">
              {formatDate(prayer.createdAt)}
            </div>
            <p className="line-clamp-2 font-serif text-[15px] leading-relaxed text-soft-brown">
              {getPreviewText(prayer.content)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
