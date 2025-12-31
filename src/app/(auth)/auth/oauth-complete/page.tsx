'use client';

import { Suspense, useEffect, useRef } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useAuthStore } from '@/features/auth/stores/authStore';
import { memberApi } from '@/features/member/api/member.api';
import { FullPageSpinner } from '@/shared/components';

function OAuthCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const hasAttempted = useRef(false);

  useEffect(() => {
    // 이미 시도했으면 중복 실행 방지
    if (hasAttempted.current) return;
    hasAttempted.current = true;

    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const isNewMember = searchParams.get('isNewMember') === 'true';

    // 에러 처리
    if (error) {
      router.replace(`/login?error=${error}`);
      return;
    }

    // 성공이 아니면 로그인 페이지로
    if (success !== 'true') {
      router.replace('/login?error=oauth_failed');
      return;
    }

    // 백엔드에서 이미 세션 쿠키를 설정했으므로, 프로필 조회 후 상태 업데이트
    const completeLogin = async () => {
      try {
        setAuthenticated(true);

        // 프로필 조회
        const { data: profile, error: profileError } =
          await memberApi.getMyProfile();

        if (profileError) {
          console.error('프로필 조회 실패:', profileError);
          router.replace('/login?error=profile_fetch_failed');
          return;
        }

        if (profile) {
          setUser(profile);
        }

        // 신규 회원이면 암호화 설정 페이지로
        if (isNewMember) {
          router.replace('/setup-encryption');
        } else {
          router.replace('/');
        }
      } catch (e) {
        console.error('로그인 완료 처리 실패:', e);
        router.replace('/login?error=login_failed');
      }
    };

    completeLogin();
  }, [searchParams, router, setAuthenticated, setUser]);

  const error = searchParams.get('error');
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <h1 className="font-serif text-2xl font-bold text-deep-brown">
            로그인 실패
          </h1>
          <p className="text-soft-brown">소셜 로그인 중 오류가 발생했습니다.</p>
          <button
            onClick={() => router.push('/login')}
            className="text-gold hover:underline"
          >
            로그인 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <FullPageSpinner />
      <p className="mt-4 text-soft-brown">로그인 중...</p>
    </div>
  );
}

export default function OAuthCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center px-6">
          <FullPageSpinner />
          <p className="mt-4 text-soft-brown">로그인 중...</p>
        </div>
      }
    >
      <OAuthCompleteContent />
    </Suspense>
  );
}
