/**
 * Member 도메인 타입 정의
 */

import type { OAuthProvider } from '@/features/auth/types/auth.types';

/** 회원 프로필 */
export interface MemberProfile {
  id: string;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  emailVerified: boolean;
  oauthProviders: OAuthProvider[];
  createdAt: string;
}

/** 프로필 수정 요청 */
export interface UpdateProfileRequest {
  nickname?: string;
  profileImageUrl?: string;
}

/** API Key */
export interface ApiKey {
  id: string;
  name: string;
  lastUsedAt: string | null;
  createdAt: string;
}

/** API Key 생성 요청 */
export interface CreateApiKeyRequest {
  name: string;
}

/** API Key 생성 응답 (원본 키 포함) */
export interface CreateApiKeyResponse {
  apiKey: ApiKey;
  rawKey: string;
}

/** 이메일 인증 요청 */
export interface VerifyEmailRequest {
  token: string;
}

/** 이메일 인증 응답 */
export interface VerifyEmailResponse {
  verified: boolean;
}

/** 비밀번호 재설정 요청 */
export interface RequestPasswordResetRequest {
  email: string;
}

/** 비밀번호 재설정 */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
