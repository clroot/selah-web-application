/**
 * Auth 도메인 타입 정의
 */

/** OAuth 제공자 */
export type OAuthProvider = 'GOOGLE' | 'APPLE' | 'KAKAO' | 'NAVER';

/** 회원가입 요청 */
export interface RegisterRequest {
  email: string;
  nickname: string;
  password: string;
}

/** 회원가입 응답 */
export interface RegisterResponse {
  memberId: string;
  nickname: string;
}

/** 이메일 로그인 요청 */
export interface LoginRequest {
  email: string;
  password: string;
}

/** OAuth 로그인 요청 */
export interface OAuthLoginRequest {
  email: string;
  nickname: string;
  provider: OAuthProvider;
  providerId: string;
  profileImageUrl?: string;
}

/** 로그인 응답 */
export interface LoginResponse {
  member: {
    id: string;
    email: string;
    nickname: string;
    profileImageUrl: string | null;
    emailVerified: boolean;
  };
  session: {
    expiresAt: string;
  };
}
