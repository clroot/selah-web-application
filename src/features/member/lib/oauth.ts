/**
 * OAuth 유틸리티
 *
 * OAuth 인증은 백엔드에서 처리됩니다.
 * 프론트엔드는 백엔드의 OAuth authorize 엔드포인트로 리다이렉트만 합니다.
 */

import type { OAuthProvider } from "@/features/member/types/member.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/**
 * OAuth Authorization URL 생성
 * 백엔드의 /api/v1/auth/oauth/{provider}/authorize로 리다이렉트합니다.
 */
export function getAuthorizationUrl(provider: OAuthProvider): string {
  return `${API_BASE_URL}/api/v1/auth/oauth/${provider.toLowerCase()}/authorize`;
}

/**
 * OAuth Provider 표시 이름
 */
export const OAUTH_PROVIDER_NAMES: Record<OAuthProvider, string> = {
  GOOGLE: "Google",
  KAKAO: "Kakao",
  NAVER: "Naver",
};

/**
 * 지원하는 모든 OAuth Provider 목록
 */
export const SUPPORTED_OAUTH_PROVIDERS: OAuthProvider[] = [
  "GOOGLE",
  "KAKAO",
  "NAVER",
];
