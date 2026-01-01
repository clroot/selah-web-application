/**
 * Auth 도메인 타입 정의
 */

import type { OAuthProvider } from "@/features/member/types/member.types";

// Re-export OAuthProvider for backward compatibility
export type { OAuthProvider };

/** 회원가입 요청 */
export interface RegisterRequest {
  email: string;
  nickname: string;
  password: string;
}

/** 회원가입 응답 (Backend RegisterResponse와 일치) */
export interface RegisterResponse {
  memberId: string;
  nickname: string;
}

/** 이메일 로그인 요청 */
export interface LoginRequest {
  email: string;
  password: string;
}

/** OAuth 로그인 요청 (Backend LoginWithOAuthRequest와 일치) */
export interface OAuthLoginRequest {
  email: string;
  nickname: string;
  provider: OAuthProvider;
  providerId: string;
  profileImageUrl?: string;
}

/** 로그인 응답 (Backend LoginResponse와 일치) */
export interface LoginResponse {
  memberId: string;
  nickname: string;
  isNewMember: boolean;
  expiresAt: string;
}
