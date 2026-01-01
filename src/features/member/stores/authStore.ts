import { create } from "zustand";

import type { MemberProfile } from "@/features/member/types/member.types";

interface AuthState {
  user: MemberProfile | null;
  isAuthenticated: boolean;
  /** 앱 시작 시 세션 확인 중 */
  isInitializing: boolean;
  /** 로그인 직후 상태 (프로필 조회 전) */
  isLoggingIn: boolean;
}

interface AuthActions {
  setUser: (user: MemberProfile | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setInitialized: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  isLoggingIn: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isInitializing: false,
      isLoggingIn: false,
    }),

  setAuthenticated: (isAuthenticated) =>
    set({
      isAuthenticated,
      isLoggingIn: isAuthenticated,
    }),

  setInitialized: () =>
    set({
      isInitializing: false,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoggingIn: false,
    }),
}));
