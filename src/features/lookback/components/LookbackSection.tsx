"use client";

import { RefreshCw } from "lucide-react";

import {
  useRefreshLookback,
  useTodayLookback,
} from "@/features/lookback/hooks";
import { cn } from "@/shared/lib/utils";

import { LookbackCard } from "./LookbackCard";
import { LookbackEmptyState } from "./LookbackEmptyState";

export function LookbackSection() {
  const { data: lookback, isLoading } = useTodayLookback();
  const { mutate: refresh, isPending: isRefreshing } = useRefreshLookback();

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-medium text-deep-brown">
          오늘의 돌아보기
        </h2>
        {lookback && (
          <button
            type="button"
            onClick={() => refresh()}
            disabled={isRefreshing}
            className={cn(
              "flex items-center gap-1 text-[13px] text-soft-brown transition-colors hover:text-deep-brown",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
            aria-label="다른 기도제목 보기"
          >
            <RefreshCw
              className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")}
              strokeWidth={1.5}
            />
          </button>
        )}
      </div>

      {isLoading ? (
        <LookbackSkeleton />
      ) : lookback ? (
        <LookbackCard lookback={lookback} />
      ) : (
        <LookbackEmptyState />
      )}
    </section>
  );
}

function LookbackSkeleton() {
  return (
    <div className="h-[72px] animate-pulse rounded-2xl border border-sand bg-sand/30" />
  );
}
