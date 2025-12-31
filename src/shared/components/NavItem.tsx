'use client';

import Link from 'next/link';

import { cn } from '@/shared/lib/utils';

import type { LucideIcon } from 'lucide-react';

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

export function NavItem({ href, icon: Icon, label, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center justify-center gap-1 px-4 py-2',
        'transition-colors duration-200',
        isActive ? 'text-gold' : 'text-soft-brown hover:text-deep-brown'
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}
