'use client';

import { useCallback } from 'react';

import { encrypt, decrypt } from '@/shared/lib/crypto';
import { useEncryptionStore } from '@/shared/stores/encryptionStore';

/**
 * 암호화/복호화를 위한 훅
 *
 * encryptionStore에서 DEK를 가져와 데이터 암호화/복호화를 수행합니다.
 * DEK가 없는 경우 (암호화 미해제 상태) 에러를 throw합니다.
 */
export function useCrypto() {
  const { dek, isUnlocked } = useEncryptionStore();

  /**
   * 데이터 암호화
   *
   * @param plaintext - 암호화할 평문
   * @returns Base64 인코딩된 암호문
   * @throws 암호화 미해제 상태에서 호출 시 에러
   */
  const encryptData = useCallback(
    async (plaintext: string): Promise<string> => {
      if (!dek) {
        throw new Error('암호화가 해제되지 않았습니다');
      }
      return encrypt(plaintext, dek);
    },
    [dek]
  );

  /**
   * 데이터 복호화
   *
   * @param ciphertext - Base64 인코딩된 암호문
   * @returns 복호화된 평문
   * @throws 암호화 미해제 상태에서 호출 시 에러
   * @throws 복호화 실패 시 에러 (잘못된 키 등)
   */
  const decryptData = useCallback(
    async (ciphertext: string): Promise<string> => {
      if (!dek) {
        throw new Error('암호화가 해제되지 않았습니다');
      }
      return decrypt(ciphertext, dek);
    },
    [dek]
  );

  return {
    isUnlocked,
    encryptData,
    decryptData,
  };
}
