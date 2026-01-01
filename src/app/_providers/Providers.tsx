'use client';

import type { ReactNode } from 'react';

import { AuthProvider } from '@/features/member/providers/AuthProvider';
import { QueryProvider } from '@/shared/providers/QueryProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
}
