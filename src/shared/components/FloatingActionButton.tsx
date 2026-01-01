"use client";

import Link from "next/link";

import { Plus } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface FloatingActionButtonProps {
  href?: string;
  onClick?: () => void;
}

export function FloatingActionButton({
  href = "/prayers/new",
  onClick,
}: FloatingActionButtonProps) {
  const buttonClasses = cn(
    "absolute -top-3 left-1/2 -translate-x-1/2",
    "flex h-14 w-14 items-center justify-center",
    "rounded-full bg-gold shadow-lg",
    "transition-all duration-200",
    "hover:bg-gold/90 hover:shadow-xl",
    "active:scale-95",
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={buttonClasses}
        aria-label="새 기도문 작성"
      >
        <Plus className="h-6 w-6 text-white" strokeWidth={2.5} />
      </button>
    );
  }

  return (
    <Link href={href} className={buttonClasses} aria-label="새 기도문 작성">
      <Plus className="h-6 w-6 text-white" strokeWidth={2.5} />
    </Link>
  );
}
