'use client';

import { usePathname } from 'next/navigation';

import { Home, BookOpen, Check, Settings } from 'lucide-react';

import { FloatingActionButton } from './FloatingActionButton';
import { NavItem } from './NavItem';

const leftNavItems = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/prayers', icon: BookOpen, label: '기도문' },
];

const rightNavItems = [
  { href: '/prayer-topics?status=ANSWERED', icon: Check, label: '응답' },
  { href: '/settings', icon: Settings, label: '설정' },
];

export function BottomNavigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href.split('?')[0]);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-sand bg-white">
      <div className="relative mx-auto flex h-16 max-w-[480px] items-center justify-around">
        {leftNavItems.map((item) => (
          <NavItem key={item.href} {...item} isActive={isActive(item.href)} />
        ))}

        <FloatingActionButton />

        {rightNavItems.map((item) => (
          <NavItem key={item.href} {...item} isActive={isActive(item.href)} />
        ))}
      </div>

      {/* Safe area padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom,0px)] bg-white" />
    </nav>
  );
}
