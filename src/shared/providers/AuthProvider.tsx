'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { useAuthStore } from '@/features/auth/stores/authStore';
import { memberApi } from '@/features/member/api/member.api';
import { FullPageSpinner } from '@/shared/components';

interface AuthProviderProps {
  children: ReactNode;
}

/** 인증이 필요 없는 공개 경로 */
const PUBLIC_PATHS = ['/login', '/signup', '/auth/oauth-complete'];

/** 경로가 공개 경로인지 확인 */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const hasInitialized = useRef(false);

  const isInitializing = useAuthStore((state) => state.isInitializing);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  // 앱 시작 시 세션 확인
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initializeAuth = async () => {
      try {
        // 백엔드에 세션 쿠키로 프로필 조회 시도
        const result = await memberApi.getMyProfile();
        console.log('[AuthProvider] getMyProfile result:', result);

        const { data: profile, error } = result;

        if (error || !profile) {
          // 세션이 없거나 만료됨
          console.log('[AuthProvider] No profile or error:', { error, profile });
          setInitialized();
          return;
        }

        // 세션이 유효하면 사용자 정보 설정
        console.log('[AuthProvider] Setting user:', profile);
        setUser(profile);
      } catch (e) {
        // 네트워크 오류 등
        console.error('[AuthProvider] Exception:', e);
        setInitialized();
      }
    };

    initializeAuth();
  }, [setUser, setInitialized]);

  // 인증 상태에 따른 리다이렉트
  useEffect(() => {
    // 초기화 중이면 대기
    if (isInitializing) return;

    const isPublic = isPublicPath(pathname);

    if (!isAuthenticated && !isPublic) {
      // 인증되지 않은 상태에서 보호된 페이지 접근 시 로그인으로 리다이렉트
      router.replace('/login');
    } else if (isAuthenticated && isPublic && pathname !== '/auth/oauth-complete') {
      // 인증된 상태에서 로그인/회원가입 페이지 접근 시 홈으로 리다이렉트
      router.replace('/');
    }
  }, [isInitializing, isAuthenticated, pathname, router]);

  // 초기화 중이면 로딩 화면 표시
  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <FullPageSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
