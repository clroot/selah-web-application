/**
 * DEK (Data Encryption Key) 관리
 *
 * DEK는 실제 데이터를 암호화하는 키입니다.
 * DEK는 KEK(Key Encryption Key)로 암호화되어 서버에 저장됩니다.
 */

import { uint8ArrayToBase64, base64ToUint8Array } from './crypto';

const IV_LENGTH = 12; // GCM 권장 IV 길이 (96 bits)
const DEK_LENGTH = 256; // AES-256

/**
 * DEK 랜덤 생성 (회원가입 시 1회)
 *
 * @returns CryptoKey (AES-GCM, 256-bit, extractable)
 */
export async function generateDEK(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: 'AES-GCM', length: DEK_LENGTH },
    true, // extractable: true (KEK로 암호화하기 위해)
    ['encrypt', 'decrypt']
  );
}

/**
 * KEK로 DEK 암호화 (서버 저장용)
 *
 * @param dek - DEK (CryptoKey)
 * @param kek - KEK (CryptoKey with wrapKey permission)
 * @returns Base64 인코딩된 암호화된 DEK (IV + wrapped key)
 */
export async function encryptDEK(dek: CryptoKey, kek: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const wrappedKey = await crypto.subtle.wrapKey('raw', dek, kek, {
    name: 'AES-GCM',
    iv,
  });

  // IV + wrappedKey 결합
  const combined = new Uint8Array(iv.length + wrappedKey.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(wrappedKey), iv.length);

  return uint8ArrayToBase64(combined);
}

/**
 * KEK로 DEK 복호화 (로그인 시)
 *
 * @param encryptedDEK - Base64 인코딩된 암호화된 DEK
 * @param kek - KEK (CryptoKey with unwrapKey permission)
 * @returns DEK (CryptoKey, non-extractable)
 */
export async function decryptDEK(encryptedDEK: string, kek: CryptoKey): Promise<CryptoKey> {
  const combined = base64ToUint8Array(encryptedDEK);
  const iv = combined.slice(0, IV_LENGTH);
  const wrappedKey = combined.slice(IV_LENGTH);

  return crypto.subtle.unwrapKey(
    'raw',
    wrappedKey,
    kek,
    { name: 'AES-GCM', iv },
    { name: 'AES-GCM', length: DEK_LENGTH },
    false, // extractable: false (메모리에서만 사용)
    ['encrypt', 'decrypt']
  );
}

/**
 * DEK를 raw bytes로 내보내기 (복구 키로 암호화할 때 사용)
 *
 * @param dek - DEK (CryptoKey, extractable)
 * @returns DEK raw bytes (Uint8Array)
 */
export async function exportDEK(dek: CryptoKey): Promise<Uint8Array> {
  const exported = await crypto.subtle.exportKey('raw', dek);
  return new Uint8Array(exported);
}

/**
 * raw bytes에서 DEK import (복구 키로 복호화 후 사용)
 *
 * @param dekBytes - DEK raw bytes (Uint8Array)
 * @param extractable - 추출 가능 여부 (복구 키 재암호화용이면 true)
 * @returns DEK (CryptoKey)
 */
export async function importDEK(
  dekBytes: Uint8Array,
  extractable: boolean = false
): Promise<CryptoKey> {
  // Uint8Array의 데이터를 새로운 ArrayBuffer에 복사하여 BufferSource 호환성 확보
  const buffer = new ArrayBuffer(dekBytes.byteLength);
  new Uint8Array(buffer).set(dekBytes);

  return crypto.subtle.importKey(
    'raw',
    buffer,
    { name: 'AES-GCM', length: DEK_LENGTH },
    extractable,
    ['encrypt', 'decrypt']
  );
}
