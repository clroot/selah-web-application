/**
 * 복구 키 생성 및 검증
 *
 * 복구 키는 사용자가 비밀번호를 잊어버렸을 때 DEK를 복구하는 데 사용됩니다.
 * 복구 키 원본은 사용자만 보관하고, 서버에는 해시와 recoveryEncryptedDEK만 저장합니다.
 */

import { uint8ArrayToBase64, base64ToUint8Array } from './crypto';
import { exportDEK, importDEK } from './dek';

const RECOVERY_KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 12; // GCM IV 길이

/**
 * 복구 키 생성 (랜덤 256-bit)
 *
 * @returns 복구 키 bytes (Uint8Array, 사용자에게 1회만 표시)
 */
export function generateRecoveryKey(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(RECOVERY_KEY_LENGTH));
}

/**
 * 복구 키 생성 (Base64 반환, 하위 호환용)
 *
 * @returns Base64 인코딩된 복구 키
 */
export function generateRecoveryKeyBase64(): string {
  const bytes = generateRecoveryKey();
  return uint8ArrayToBase64(bytes);
}

/**
 * 복구 키 해시 생성 (SHA-256)
 *
 * 서버에 저장할 복구 키 해시를 생성합니다.
 *
 * @param recoveryKey - 복구 키 (Uint8Array 또는 Base64 문자열)
 * @returns Base64 인코딩된 해시
 */
export async function hashRecoveryKey(recoveryKey: Uint8Array | string): Promise<string> {
  const data = typeof recoveryKey === 'string' ? base64ToUint8Array(recoveryKey) : recoveryKey;

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return uint8ArrayToBase64(new Uint8Array(hashBuffer));
}

/**
 * 복구 키 검증 (로컬)
 *
 * 사용자가 입력한 복구 키가 저장된 해시와 일치하는지 확인합니다.
 *
 * @param recoveryKey - 사용자가 입력한 복구 키 (Uint8Array 또는 Base64 문자열)
 * @param storedHash - 서버에 저장된 해시
 * @returns 일치 여부
 */
export async function verifyRecoveryKey(
  recoveryKey: Uint8Array | string,
  storedHash: string
): Promise<boolean> {
  const computedHash = await hashRecoveryKey(recoveryKey);
  return computedHash === storedHash;
}

/**
 * 복구 키 포맷팅 (표시용)
 *
 * Uint8Array를 hex 문자열로 변환 후 4자리씩 그룹핑합니다.
 * 예: "A8F2-K9D4-M3P7-X1B6-..." (64자 hex)
 *
 * @param recoveryKey - 복구 키 (Uint8Array)
 * @returns 포맷팅된 복구 키
 */
export function formatRecoveryKey(recoveryKey: Uint8Array): string {
  const hex = Array.from(recoveryKey)
    .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
    .join('');

  const groups: string[] = [];
  for (let i = 0; i < hex.length; i += 4) {
    groups.push(hex.slice(i, i + 4));
  }

  return groups.join('-');
}

/**
 * 포맷팅된 복구 키를 Uint8Array로 파싱
 *
 * @param formatted - 포맷팅된 복구 키 (대시 포함 hex 문자열)
 * @returns 복구 키 (Uint8Array)
 */
export function parseFormattedRecoveryKey(formatted: string): Uint8Array {
  const hex = formatted.replace(/-/g, '');
  const bytes = new Uint8Array(hex.length / 2);

  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }

  return bytes;
}

/**
 * 복구 키로 DEK 암호화
 *
 * @param dek - DEK (CryptoKey, extractable)
 * @param recoveryKey - 복구 키 (Uint8Array)
 * @returns Base64 인코딩된 암호화된 DEK
 */
export async function encryptDEKWithRecoveryKey(
  dek: CryptoKey,
  recoveryKey: Uint8Array
): Promise<string> {
  // 복구 키를 AES-GCM 키로 import
  const recoveryKEK = await crypto.subtle.importKey(
    'raw',
    recoveryKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['wrapKey']
  );

  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const wrappedKey = await crypto.subtle.wrapKey('raw', dek, recoveryKEK, {
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
 * 복구 키로 DEK 복호화
 *
 * @param encryptedDEK - Base64 인코딩된 암호화된 DEK
 * @param recoveryKey - 복구 키 (Uint8Array 또는 포맷된 문자열)
 * @returns DEK (CryptoKey)
 */
export async function decryptDEKWithRecoveryKey(
  encryptedDEK: string,
  recoveryKey: Uint8Array | string
): Promise<CryptoKey> {
  // 포맷된 문자열이면 파싱
  const keyBytes =
    typeof recoveryKey === 'string' ? parseFormattedRecoveryKey(recoveryKey) : recoveryKey;

  // 복구 키를 AES-GCM 키로 import
  const recoveryKEK = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM', length: 256 },
    false,
    ['unwrapKey']
  );

  const combined = base64ToUint8Array(encryptedDEK);
  const iv = combined.slice(0, IV_LENGTH);
  const wrappedKey = combined.slice(IV_LENGTH);

  return crypto.subtle.unwrapKey(
    'raw',
    wrappedKey,
    recoveryKEK,
    { name: 'AES-GCM', iv },
    { name: 'AES-GCM', length: 256 },
    true, // extractable: true (KEK로 재암호화해야 하므로)
    ['encrypt', 'decrypt']
  );
}
