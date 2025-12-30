/**
 * E2E 암호화 핵심 함수
 *
 * Web Crypto API를 사용한 AES-256-GCM 암호화/복호화
 * 모든 함수는 순수 함수로 프레임워크 독립적입니다.
 */

const IV_LENGTH = 12; // GCM 권장 IV 길이 (96 bits)
const SALT_LENGTH = 32; // Salt 길이 (256 bits)

/**
 * AES-256-GCM 암호화
 *
 * @param plaintext - 암호화할 평문
 * @param key - CryptoKey (AES-GCM, 256-bit)
 * @returns Base64 인코딩된 암호문 (IV + ciphertext)
 */
export async function encrypt(plaintext: string, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plaintext)
  );

  // IV + ciphertext 결합
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return uint8ArrayToBase64(combined);
}

/**
 * AES-256-GCM 복호화
 *
 * @param encrypted - Base64 인코딩된 암호문 (IV + ciphertext)
 * @param key - CryptoKey (AES-GCM, 256-bit)
 * @returns 복호화된 평문
 * @throws 복호화 실패 시 에러
 */
export async function decrypt(encrypted: string, key: CryptoKey): Promise<string> {
  const combined = base64ToUint8Array(encrypted);
  const iv = combined.slice(0, IV_LENGTH);
  const ciphertext = combined.slice(IV_LENGTH);

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(plaintext);
}

/**
 * Salt 생성 (32 bytes)
 *
 * @returns 랜덤 Salt (Uint8Array)
 */
export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

/**
 * Uint8Array → Base64 변환
 */
export function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Base64 → Uint8Array 변환
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * 두 Uint8Array 비교 (timing-safe하지 않음 - 복구 키 검증에만 사용)
 */
export function compareUint8Arrays(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
