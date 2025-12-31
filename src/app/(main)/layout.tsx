import type { ReactNode } from 'react';

import { BottomNavigation } from '@/shared/components';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-cream pb-16">
      {children}
      <BottomNavigation />
    </div>
  );
}
