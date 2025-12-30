/**
 * Encryption 도메인 타입 정의
 */

/** 암호화 설정 */
export interface EncryptionSettings {
  salt: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 암호화 설정 요청 */
export interface SetupEncryptionRequest {
  salt: string;
  recoveryKeyHash: string;
}

/** 암호화 설정 응답 */
export interface SetupEncryptionResponse {
  salt: string;
  isEnabled: boolean;
  createdAt: string;
}

/** 복구 키 검증 요청 */
export interface VerifyRecoveryKeyRequest {
  recoveryKeyHash: string;
}

/** 복구 키 검증 응답 */
export interface VerifyRecoveryKeyResponse {
  valid: boolean;
}
