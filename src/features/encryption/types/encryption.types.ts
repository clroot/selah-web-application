/**
 * Encryption 도메인 타입 정의
 *
 * PIN + Server Key 구조:
 * - DEK (Data Encryption Key): 실제 데이터 암호화에 사용되는 256-bit 키
 * - Client KEK: 6자리 PIN + Salt로 파생 (PBKDF2)
 * - Server Key: 서버에서 생성한 256-bit 랜덤 키 (Master Key로 암호화하여 저장)
 * - Combined KEK = HKDF(Client KEK || Server Key): DEK 암호화에 사용
 * - 복구 키: PIN 분실 시 DEK 복구에 사용
 */

/** 암호화 설정 (로그인 시 조회) */
export interface EncryptionSettings {
  salt: string; // Client KEK 파생용 Salt (Base64)
  encryptedDEK: string; // Combined KEK로 암호화된 DEK (Base64)
  serverKey: string; // 복호화된 Server Key (Base64)
}

/** 복구 설정 (비밀번호 분실 시 조회) */
export interface RecoverySettings {
  recoveryEncryptedDEK: string; // 복구 키로 암호화된 DEK (Base64)
  recoveryKeyHash: string; // 복구 키 해시 (검증용)
}

/** 암호화 설정 초기화 요청 (회원가입 시) */
export interface SetupEncryptionRequest {
  salt: string; // KEK 파생용 Salt (Base64)
  encryptedDEK: string | null; // KEK로 암호화된 DEK (Base64), 초기에는 null
  recoveryEncryptedDEK: string; // 복구 키로 암호화된 DEK (Base64)
  recoveryKeyHash: string; // 복구 키 해시 (검증용)
}

/** 암호화 설정 초기화 응답 */
export interface SetupEncryptionResponse {
  serverKey: string; // 평문 Server Key (Base64)
  createdAt: string;
}

/** 암호화 키 업데이트 요청 (PIN 변경 시) */
export interface UpdateEncryptionRequest {
  salt: string; // 새 Salt (Base64)
  encryptedDEK: string; // 새 Combined KEK로 암호화된 DEK (Base64)
}

/** 암호화 키 업데이트 응답 */
export interface UpdateEncryptionResponse {
  serverKey: string; // 새 평문 Server Key (Base64)
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
