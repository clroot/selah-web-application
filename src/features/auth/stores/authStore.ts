import { create } from 'zustand';

import type { MemberProfile } from '@/features/member/types/member.types';

interface AuthState {
  user: MemberProfile | null;
  isAuthenticated: boolean;
  /** 로그인 직후 상태 (프로필 조회 전) */
  isLoggingIn: boolean;
}

interface AuthActions {
  setUser: (user: MemberProfile | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoggingIn: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoggingIn: false,
    }),

  setAuthenticated: (isAuthenticated) =>
    set({
      isAuthenticated,
      isLoggingIn: isAuthenticated,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoggingIn: false,
    }),
}));
