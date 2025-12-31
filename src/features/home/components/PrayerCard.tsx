import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

import { formatDate } from '@/features/home/utils/date';

interface PrayerCardProps {
  id: string;
  content: string;
  createdAt: string;
}

/**
 * 기도문 카드 컴포넌트
 */
export function PrayerCard({ id, content, createdAt }: PrayerCardProps) {
  return (
    <Link
      href={`/prayers/${id}`}
      className="flex items-center gap-4 rounded-2xl border border-sand bg-cream px-5 py-[18px] transition-colors hover:border-warm-beige hover:bg-cream/80"
    >
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-[15px] text-deep-brown">{content}</p>
        <p className="mt-1 text-xs text-soft-brown">{formatDate(createdAt)}</p>
      </div>
      <ChevronRight
        className="h-[18px] w-[18px] flex-shrink-0 text-soft-brown"
        strokeWidth={1.5}
      />
    </Link>
  );
}
