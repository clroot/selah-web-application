import { apiClient } from "@/shared/api/client";

import type {
  EncryptionSettings,
  RecoverySettings,
  SetupEncryptionRequest,
  SetupEncryptionResponse,
  UpdateEncryptionRequest,
  UpdateEncryptionResponse,
  UpdateRecoveryKeyRequest,
  UpdateRecoveryKeyResponse,
  VerifyRecoveryKeyRequest,
  VerifyRecoveryKeyResponse,
} from "@/shared/types/encryption.types";

/**
 * Encryption API
 *
 * DEK/KEK 구조 기반 E2E 암호화 설정 API
 */
export const encryptionApi = {
  /** 암호화 설정 초기화 (회원가입 시) */
  setup: (data: SetupEncryptionRequest) =>
    apiClient.post<SetupEncryptionResponse>("/api/v1/encryption/setup", data),

  /** 암호화 설정 조회 (로그인 시 DEK 복호화용) */
  getSettings: () =>
    apiClient.get<EncryptionSettings>("/api/v1/encryption/settings"),

  /** 복구 설정 조회 (비밀번호 분실 시 DEK 복구용) */
  getRecoverySettings: () =>
    apiClient.get<RecoverySettings>("/api/v1/encryption/recovery-settings"),

  /** 암호화 키 업데이트 (비밀번호 변경 시) */
  updateEncryption: (data: UpdateEncryptionRequest) =>
    apiClient.put<UpdateEncryptionResponse>(
      "/api/v1/encryption/encryption",
      data,
    ),

  /** 복구 키 재생성 */
  updateRecoveryKey: (data: UpdateRecoveryKeyRequest) =>
    apiClient.put<UpdateRecoveryKeyResponse>(
      "/api/v1/encryption/recovery-key",
      data,
    ),

  /** 복구 키 검증 */
  verifyRecoveryKey: (data: VerifyRecoveryKeyRequest) =>
    apiClient.post<VerifyRecoveryKeyResponse>(
      "/api/v1/encryption/verify-recovery",
      data,
    ),

  /** 암호화 설정 삭제 */
  deleteSettings: () => apiClient.delete<void>("/api/v1/encryption/settings"),
};
