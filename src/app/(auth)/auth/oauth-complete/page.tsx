"use client";

import { Suspense, useEffect, useRef } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { memberApi } from "@/features/member/api/member.api";
import { useAuthStore } from "@/features/member/stores/authStore";
import { FullPageSpinner } from "@/shared/components";

function OAuthCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasAttempted = useRef(false);

  const success = searchParams.get("success");
  const error = searchParams.get("error");
  const isNewMember = searchParams.get("isNewMember") === "true";

  // 에러 처리 또는 성공이 아닌 경우
  useEffect(() => {
    if (error) {
      router.replace(`/login?error=${error}`);
      return;
    }

    if (success !== "true") {
      router.replace("/login?error=oauth_failed");
    }
  }, [error, success, router]);

  // OAuth 성공 시 프로필 조회 및 리다이렉트
  useEffect(() => {
    if (success !== "true" || hasAttempted.current) return;
    hasAttempted.current = true;

    const completeLogin = async () => {
      try {
        // 백엔드에서 이미 세션 쿠키를 설정했으므로, 프로필 조회
        const { data: profile, error: profileError } =
          await memberApi.getMyProfile();

        if (profileError || !profile) {
          console.error("프로필 조회 실패:", profileError);
          router.replace("/login?error=profile_fetch_failed");
          return;
        }

        // 프로필 설정 (isAuthenticated도 true로 설정됨)
        setUser(profile);

        // 신규 회원이면 암호화 설정 페이지로, 아니면 홈으로
        if (isNewMember) {
          router.replace("/setup-encryption");
        } else {
          router.replace("/");
        }
      } catch (e) {
        console.error("로그인 완료 처리 실패:", e);
        router.replace("/login?error=login_failed");
      }
    };

    completeLogin();
  }, [success, isNewMember, router, setUser]);

  // 이미 인증된 상태면 홈으로 리다이렉트
  useEffect(() => {
    if (!isInitializing && isAuthenticated && success === "true") {
      if (isNewMember) {
        router.replace("/setup-encryption");
      } else {
        router.replace("/");
      }
    }
  }, [isInitializing, isAuthenticated, success, isNewMember, router]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <h1 className="font-serif text-2xl font-bold text-deep-brown">
            로그인 실패
          </h1>
          <p className="text-soft-brown">소셜 로그인 중 오류가 발생했습니다.</p>
          <button
            onClick={() => router.push("/login")}
            className="text-soft-brown hover:text-deep-brown hover:underline"
          >
            로그인 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6">
      <FullPageSpinner />
      <p className="mt-4 text-soft-brown">로그인 중...</p>
    </div>
  );
}

export default function OAuthCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6">
          <FullPageSpinner />
          <p className="mt-4 text-soft-brown">로그인 중...</p>
        </div>
      }
    >
      <OAuthCompleteContent />
    </Suspense>
  );
}
