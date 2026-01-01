import { apiClient } from "@/shared/api/client";

import type {
  ApiKey,
  ChangePasswordRequest,
  CreateApiKeyRequest,
  CreateApiKeyResponse,
  MemberProfile,
  OAuthConnection,
  OAuthConnectionsResponse,
  OAuthProvider,
  SetPasswordRequest,
  UpdateProfileRequest,
} from "@/features/member/types/member.types";

/**
 * Member API
 */
export const memberApi = {
  /** 내 프로필 조회 */
  getMyProfile: () => apiClient.get<MemberProfile>("/api/v1/members/me"),

  /** 프로필 수정 */
  updateMyProfile: (data: UpdateProfileRequest) =>
    apiClient.patch<MemberProfile>("/api/v1/members/me", data),

  /** API Key 목록 조회 */
  listApiKeys: () => apiClient.get<ApiKey[]>("/api/v1/members/me/api-keys"),

  /** API Key 생성 */
  createApiKey: (data: CreateApiKeyRequest) =>
    apiClient.post<CreateApiKeyResponse>("/api/v1/members/me/api-keys", data),

  /** API Key 삭제 */
  deleteApiKey: (apiKeyId: string) =>
    apiClient.delete<void>(`/api/v1/members/me/api-keys/${apiKeyId}`),

  /** 비밀번호 변경 (기존 비밀번호가 있는 회원) */
  changePassword: (data: ChangePasswordRequest) =>
    apiClient.put<void>("/api/v1/members/me/password", data),

  /** 비밀번호 설정 (OAuth 전용 계정) */
  setPassword: (data: SetPasswordRequest) =>
    apiClient.post<void>("/api/v1/members/me/password", data),
};

/**
 * OAuth 연결 관리 API
 */
export const oauthConnectionApi = {
  /** OAuth 연결 목록 조회 */
  getConnections: () =>
    apiClient.get<OAuthConnectionsResponse>(
      "/api/v1/members/me/oauth-connections",
    ),

  /** OAuth 연결 추가 */
  connect: (data: { provider: OAuthProvider; accessToken: string }) =>
    apiClient.post<OAuthConnection>(
      "/api/v1/members/me/oauth-connections",
      data,
    ),

  /** OAuth 연결 해제 */
  disconnect: (provider: OAuthProvider) =>
    apiClient.delete<void>(`/api/v1/members/me/oauth-connections/${provider}`),
};

/**
 * 이메일 인증 API
 */
export const emailVerificationApi = {
  /** 인증 메일 발송 (재발송) */
  sendVerificationEmail: () =>
    apiClient.post<void>("/api/v1/auth/email/send-verification"),

  /** 이메일 인증 */
  verify: (token: string) =>
    apiClient.post<{ memberId: string; email: string; emailVerified: boolean }>(
      "/api/v1/auth/email/verify",
      { token },
    ),
};

/**
 * 비밀번호 재설정 API
 */
export const passwordResetApi = {
  /** 비밀번호 찾기 (재설정 요청) */
  forgotPassword: (email: string) =>
    apiClient.post<void>("/api/v1/auth/password/forgot", { email }),

  /** 토큰 검증 */
  validateToken: (token: string) =>
    apiClient.get<{ valid: boolean; email: string | null }>(
      `/api/v1/auth/password/reset/validate?token=${encodeURIComponent(token)}`,
    ),

  /** 비밀번호 재설정 */
  resetPassword: (token: string, newPassword: string) =>
    apiClient.post<void>("/api/v1/auth/password/reset", { token, newPassword }),
};
