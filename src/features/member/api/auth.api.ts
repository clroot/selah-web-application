import { apiClient } from "@/shared/api/client";

import type {
  LoginRequest,
  LoginResponse,
  OAuthLoginRequest,
  RegisterRequest,
  RegisterResponse,
} from "@/features/member/types/auth.types";

/**
 * Auth API
 */
export const authApi = {
  /** 이메일 회원가입 */
  register: (data: RegisterRequest) =>
    apiClient.post<RegisterResponse>("/api/v1/auth/register", data),

  /** 이메일 로그인 */
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>("/api/v1/auth/login", data),

  /** OAuth 로그인 */
  loginWithOAuth: (data: OAuthLoginRequest) =>
    apiClient.post<LoginResponse>("/api/v1/auth/oauth/login", data),

  /** 로그아웃 */
  logout: () => apiClient.post<void>("/api/v1/auth/logout"),

  /** 전체 로그아웃 (모든 세션) */
  logoutAll: () => apiClient.post<void>("/api/v1/auth/logout/all"),
};
