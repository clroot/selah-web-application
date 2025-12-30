import { apiClient } from '@/shared/api/client';

import type {
  EncryptionSettings,
  SetupEncryptionRequest,
  SetupEncryptionResponse,
  VerifyRecoveryKeyRequest,
  VerifyRecoveryKeyResponse,
} from '@/features/encryption/types/encryption.types';

/**
 * Encryption API
 */
export const encryptionApi = {
  /** 암호화 설정 초기화 */
  setup: (data: SetupEncryptionRequest) =>
    apiClient.post<SetupEncryptionResponse>('/api/v1/encryption/setup', data),

  /** 암호화 설정 조회 */
  getSettings: () =>
    apiClient.get<EncryptionSettings>('/api/v1/encryption/settings'),

  /** 복구 키 검증 */
  verifyRecoveryKey: (data: VerifyRecoveryKeyRequest) =>
    apiClient.post<VerifyRecoveryKeyResponse>('/api/v1/encryption/verify-recovery', data),

  /** 암호화 설정 삭제 */
  deleteSettings: () =>
    apiClient.delete<void>('/api/v1/encryption/settings'),
};
