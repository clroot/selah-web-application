'use client';

import type { ReactNode } from 'react';

import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

interface PageHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  showBackButton = true,
  onBack,
  rightAction,
  className,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-14 items-center justify-between border-b border-sand bg-cream px-4',
        className
      )}
    >
      <div className="flex w-20 items-center">
        {showBackButton && (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1 text-soft-brown transition-colors hover:text-deep-brown"
            aria-label="뒤로 가기"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
      </div>

      {title && (
        <h1 className="font-serif text-lg font-medium text-deep-brown">{title}</h1>
      )}

      <div className="flex w-20 items-center justify-end">{rightAction}</div>
    </header>
  );
}
