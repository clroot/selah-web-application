import { create } from 'zustand';

import { encryptionApi } from '@/features/encryption/api/encryption.api';
import { uint8ArrayToBase64 } from '@/shared/lib/crypto/crypto';
import {
  generateDEK,
  encryptDEK,
  decryptDEK,
} from '@/shared/lib/crypto/dek';
import { deriveKEK, generateSalt } from '@/shared/lib/crypto/keyDerivation';
import {
  generateRecoveryKey,
  formatRecoveryKey,
  hashRecoveryKey,
  encryptDEKWithRecoveryKey,
} from '@/shared/lib/crypto/recoveryKey';

interface EncryptionState {
  isUnlocked: boolean;
  dek: CryptoKey | null;
}

interface EncryptionActions {
  /**
   * 회원가입 시 암호화 설정
   * @param password 로그인 비밀번호
   * @returns 포맷팅된 복구 키 (사용자에게 1회만 표시)
   */
  setupEncryption: (password: string) => Promise<string>;

  /**
   * 로그인 시 암호화 해제
   * @param password 로그인 비밀번호
   */
  unlockWithPassword: (password: string) => Promise<void>;

  /**
   * 비밀번호 변경 시 DEK 재암호화
   * @param newPassword 새 비밀번호
   */
  changePassword: (newPassword: string) => Promise<void>;

  /**
   * 복구 키로 DEK 복구
   * @param recoveryKey 복구 키 (포맷팅된 문자열)
   * @param newPassword 새 비밀번호
   */
  recoverWithKey: (recoveryKey: string, newPassword: string) => Promise<void>;

  /**
   * 복구 키 재생성
   * @returns 새 포맷팅된 복구 키
   */
  regenerateRecoveryKey: () => Promise<string>;

  /**
   * 암호화 잠금 (로그아웃 시)
   */
  lock: () => void;
}

export const useEncryptionStore = create<EncryptionState & EncryptionActions>(
  (set, get) => ({
    isUnlocked: false,
    dek: null,

    setupEncryption: async (password: string) => {
      // 1. DEK 랜덤 생성
      const dek = await generateDEK();

      // 2. Salt 생성 및 KEK 파생
      const salt = generateSalt();
      const kek = await deriveKEK(password, salt);

      // 3. KEK로 DEK 암호화
      const encryptedDEK = await encryptDEK(dek, kek);

      // 4. 복구 키 생성 및 DEK 암호화
      const recoveryKey = generateRecoveryKey();
      const recoveryEncryptedDEK = await encryptDEKWithRecoveryKey(
        dek,
        recoveryKey
      );
      const recoveryKeyHash = await hashRecoveryKey(recoveryKey);

      // 5. 서버에 저장
      const { error } = await encryptionApi.setup({
        salt: uint8ArrayToBase64(salt),
        encryptedDEK,
        recoveryEncryptedDEK,
        recoveryKeyHash,
      });

      if (error) {
        throw new Error(error.message);
      }

      // 6. DEK를 메모리에 저장
      set({ isUnlocked: true, dek });

      // 7. 포맷팅된 복구 키 반환
      return formatRecoveryKey(recoveryKey);
    },

    unlockWithPassword: async (password: string) => {
      const { data, error } = await encryptionApi.getSettings();
      if (error || !data) {
        throw new Error(error?.message ?? '암호화 설정을 찾을 수 없습니다');
      }

      // Salt에서 KEK 파생
      const saltBytes = Uint8Array.from(atob(data.salt), (c) => c.charCodeAt(0));
      const kek = await deriveKEK(password, saltBytes);

      // KEK로 DEK 복호화
      const dek = await decryptDEK(data.encryptedDEK, kek);

      set({ isUnlocked: true, dek });
    },

    changePassword: async (newPassword: string) => {
      const { dek } = get();
      if (!dek) {
        throw new Error('암호화가 해제되지 않았습니다');
      }

      // 새 Salt 및 KEK 생성
      const newSalt = generateSalt();
      const newKEK = await deriveKEK(newPassword, newSalt);

      // 기존 DEK를 새 KEK로 재암호화
      const newEncryptedDEK = await encryptDEK(dek, newKEK);

      const { error } = await encryptionApi.updateEncryption({
        salt: uint8ArrayToBase64(newSalt),
        encryptedDEK: newEncryptedDEK,
      });

      if (error) {
        throw new Error(error.message);
      }
    },

    recoverWithKey: async () => {
      // TODO: 복구 키로 DEK 복구 구현
      throw new Error('Not implemented');
    },

    regenerateRecoveryKey: async () => {
      const { dek } = get();
      if (!dek) {
        throw new Error('암호화가 해제되지 않았습니다');
      }

      // 새 복구 키 생성
      const newRecoveryKey = generateRecoveryKey();
      const recoveryEncryptedDEK = await encryptDEKWithRecoveryKey(
        dek,
        newRecoveryKey
      );
      const recoveryKeyHash = await hashRecoveryKey(newRecoveryKey);

      const { error } = await encryptionApi.updateRecoveryKey({
        recoveryEncryptedDEK,
        recoveryKeyHash,
      });

      if (error) {
        throw new Error(error.message);
      }

      return formatRecoveryKey(newRecoveryKey);
    },

    lock: () => {
      set({ isUnlocked: false, dek: null });
    },
  })
);
