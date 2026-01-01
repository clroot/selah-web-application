import Link from "next/link";

import { ChevronRight, type LucideIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface SettingsMenuItemProps {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
}

/**
 * 설정 메뉴 아이템 컴포넌트
 */
export function SettingsMenuItem({
  icon: Icon,
  label,
  href,
  onClick,
  danger = false,
}: SettingsMenuItemProps) {
  const content = (
    <div
      className={cn(
        "flex w-full items-center justify-between px-6 py-4",
        "transition-colors hover:bg-sand/30",
        danger && "text-red-600",
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            danger ? "bg-red-50" : "bg-sand/50",
          )}
        >
          <Icon
            className={cn(
              "h-5 w-5",
              danger ? "text-red-500" : "text-soft-brown",
            )}
            strokeWidth={1.5}
          />
        </div>
        <span className="text-[15px]">{label}</span>
      </div>
      {href && (
        <ChevronRight
          className="h-5 w-5 text-soft-brown/50"
          strokeWidth={1.5}
        />
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return (
    <button type="button" onClick={onClick} className="w-full text-left">
      {content}
    </button>
  );
}
