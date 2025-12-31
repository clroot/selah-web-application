import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

import { getDaysSince } from '@/features/home/utils/date';

interface TopicCardProps {
  id: string;
  title: string;
  createdAt: string;
}

/**
 * 기도제목 카드 컴포넌트
 */
export function TopicCard({ id, title, createdAt }: TopicCardProps) {
  const days = getDaysSince(createdAt);

  return (
    <Link
      href={`/prayer-topics/${id}`}
      className="flex items-center gap-4 rounded-2xl border border-sand bg-cream px-5 py-[18px] transition-colors hover:border-warm-beige hover:bg-cream/80"
    >
      <div className="h-2 w-2 flex-shrink-0 rounded-full bg-gold" />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] text-deep-brown">{title}</h3>
        <p className="mt-1 text-xs text-soft-brown">{days}일째 기도 중</p>
      </div>
      <ChevronRight
        className="h-[18px] w-[18px] flex-shrink-0 text-soft-brown"
        strokeWidth={1.5}
      />
    </Link>
  );
}
