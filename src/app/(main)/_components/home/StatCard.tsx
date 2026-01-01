import type { ReactNode } from "react";

interface StatCardProps {
  value: number;
  label: string;
  icon?: ReactNode;
  isHighlight?: boolean;
  onClick?: () => void;
}

/**
 * 통계 카드 컴포넌트
 */
export function StatCard({
  value,
  label,
  icon,
  isHighlight = false,
  onClick,
}: StatCardProps) {
  const baseClasses = "rounded-2xl border p-5 transition-colors cursor-pointer";
  const normalClasses = "border-sand bg-cream hover:border-warm-beige";
  const highlightClasses = "border-gold bg-gold/10 hover:border-gold";

  return (
    <div
      className={`${baseClasses} ${isHighlight ? highlightClasses : normalClasses}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {icon && <div className="mb-2 text-soft-brown">{icon}</div>}
      <p className="font-serif text-3xl font-bold leading-none text-deep-brown">
        {value}
      </p>
      <p className="mt-2 text-[13px] text-soft-brown">{label}</p>
    </div>
  );
}
