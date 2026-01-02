"use client";

import { Construction } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface ComingSoonProps {
  title?: string;
  description?: string;
  className?: string;
}

export function ComingSoon({
  title = "준비 중입니다",
  description = "더 나은 서비스로 곧 찾아뵙겠습니다",
  className,
}: ComingSoonProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center gap-4 px-4",
        className,
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-warm-beige/50">
        <Construction className="h-8 w-8 text-soft-brown" strokeWidth={1.5} />
      </div>
      <div className="text-center">
        <h2 className="mb-2 font-serif text-xl font-medium text-deep-brown">
          {title}
        </h2>
        <p className="text-sm text-soft-brown">{description}</p>
      </div>
    </div>
  );
}
