import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  href?: string;
  linkText?: string;
}

/**
 * 섹션 헤더 (제목 + 더보기 링크)
 */
export function SectionHeader({
  title,
  href,
  linkText = '전체보기',
}: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-base font-medium text-deep-brown">{title}</h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-[13px] text-soft-brown transition-colors hover:text-deep-brown"
        >
          {linkText}
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Link>
      )}
    </div>
  );
}
