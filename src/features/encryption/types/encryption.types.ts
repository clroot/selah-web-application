/**
 * Encryption 도메인 타입 정의
 *
 * DEK/KEK 구조:
 * - DEK (Data Encryption Key): 실제 데이터 암호화에 사용되는 256-bit 키
 * - KEK (Key Encryption Key): 로그인 비밀번호 + Salt로 파생, DEK 암호화에 사용
 * - 복구 키: 비밀번호 분실 시 DEK 복구에 사용
 */

/** 암호화 설정 (로그인 시 조회) */
export interface EncryptionSettings {
  salt: string; // KEK 파생용 Salt (Base64)
  encryptedDEK: string; // KEK로 암호화된 DEK (Base64)
  createdAt: string;
  updatedAt: string;
}

/** 복구 설정 (비밀번호 분실 시 조회) */
export interface RecoverySettings {
  recoveryEncryptedDEK: string; // 복구 키로 암호화된 DEK (Base64)
  recoveryKeyHash: string; // 복구 키 해시 (검증용)
}

/** 암호화 설정 초기화 요청 (회원가입 시) */
export interface SetupEncryptionRequest {
  salt: string; // KEK 파생용 Salt (Base64)
  encryptedDEK: string; // KEK로 암호화된 DEK (Base64)
  recoveryEncryptedDEK: string; // 복구 키로 암호화된 DEK (Base64)
  recoveryKeyHash: string; // 복구 키 해시 (검증용)
}

/** 암호화 설정 초기화 응답 */
export interface SetupEncryptionResponse {
  salt: string;
  encryptedDEK: string;
  createdAt: string;
}

/** 암호화 키 업데이트 요청 (비밀번호 변경 시) */
export interface UpdateEncryptionRequest {
  salt: string; // 새 Salt (Base64)
  encryptedDEK: string; // 새 KEK로 암호화된 DEK (Base64)
}

/** 암호화 키 업데이트 응답 */
export interface UpdateEncryptionResponse {
  salt: string;
  encryptedDEK: string;
  updatedAt: string;
}

/** 복구 키 재생성 요청 */
export interface UpdateRecoveryKeyRequest {
  recoveryEncryptedDEK: string; // 새 복구 키로 암호화된 DEK (Base64)
  recoveryKeyHash: string; // 새 복구 키 해시
}

/** 복구 키 재생성 응답 */
export interface UpdateRecoveryKeyResponse {
  recoveryKeyHash: string;
  updatedAt: string;
}

/** 복구 키 검증 요청 */
export interface VerifyRecoveryKeyRequest {
  recoveryKeyHash: string;
}

/** 복구 키 검증 응답 */
export interface VerifyRecoveryKeyResponse {
  valid: boolean;
}
