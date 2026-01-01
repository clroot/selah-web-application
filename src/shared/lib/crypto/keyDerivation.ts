/**
 * PBKDF2 키 파생 함수
 *
 * PIN 또는 비밀번호로부터 KEK(Key Encryption Key)를 파생합니다.
 * KEK는 DEK(Data Encryption Key)를 암호화/복호화하는 데 사용됩니다.
 * Web Crypto API의 PBKDF2 구현을 사용합니다.
 *
 * PIN 기반 암호화:
 * - Client KEK = PBKDF2(PIN, Salt)
 * - Server Key = 서버에서 생성 (256-bit)
 * - Combined KEK = HKDF(Client KEK || Server Key)
 */

const PBKDF2_ITERATIONS = 100000; // 최소 100,000 권장
const KEY_LENGTH = 256; // AES-256
const SALT_LENGTH = 32; // 32 bytes (256-bit)

/**
 * Salt 생성
 *
 * 키 파생에 사용할 랜덤 Salt를 생성합니다.
 * @returns Uint8Array (32 bytes)
 */
export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

/**
 * 비밀번호에서 KEK 파생 (PBKDF2)
 *
 * DEK를 암호화/복호화하기 위한 KEK(Key Encryption Key)를 파생합니다.
 *
 * @param password - 로그인 비밀번호
 * @param salt - Salt (Uint8Array, 32 bytes 권장)
 * @returns CryptoKey (AES-GCM, 256-bit, wrapKey/unwrapKey 권한)
 */
export async function deriveKEK(
  password: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const encoder = new TextEncoder();

  // 비밀번호를 key material로 import
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  // PBKDF2로 AES-GCM 키 파생 (wrapKey/unwrapKey 권한으로 DEK 암호화)
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: KEY_LENGTH },
    false, // extractable: false (보안상 키 추출 불가)
    ["wrapKey", "unwrapKey"],
  );
}

/**
 * 6자리 PIN에서 Client KEK 파생 (PBKDF2)
 *
 * Server Key와 결합하여 Combined KEK를 생성하기 위해 extractable하게 생성합니다.
 *
 * @param pin - 6자리 숫자 PIN
 * @param salt - Salt (Uint8Array, 32 bytes)
 * @returns CryptoKey (AES-GCM, 256-bit, extractable)
 */
export async function deriveClientKEK(
  pin: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const encoder = new TextEncoder();

  // PIN을 key material로 import
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(pin),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  // PBKDF2로 Client KEK 파생 (extractable: true - HKDF 결합용)
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: KEY_LENGTH },
    true, // extractable: true (Server Key와 HKDF 결합을 위해)
    ["encrypt", "decrypt"], // 임시 권한, HKDF 후 wrapKey/unwrapKey 사용
  );
}

/**
 * 비밀번호에서 마스터 키 파생 (PBKDF2)
 *
 * @deprecated deriveKEK 사용 권장. 데이터 직접 암호화용으로만 사용.
 * @param password - 사용자 비밀번호
 * @param salt - Salt (Uint8Array, 32 bytes 권장)
 * @returns CryptoKey (AES-GCM, 256-bit)
 */
export async function deriveKey(
  password: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const encoder = new TextEncoder();

  // 비밀번호를 key material로 import
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  // PBKDF2로 AES-GCM 키 파생
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: KEY_LENGTH },
    false, // extractable: false (보안상 키 추출 불가)
    ["encrypt", "decrypt"],
  );
}

/**
 * 비밀번호에서 키 파생 (Base64 salt 입력)
 *
 * @param password - 사용자 비밀번호
 * @param saltBase64 - Base64 인코딩된 Salt
 * @returns CryptoKey (AES-GCM, 256-bit)
 */
export async function deriveKeyFromBase64Salt(
  password: string,
  saltBase64: string,
): Promise<CryptoKey> {
  const salt = base64ToUint8Array(saltBase64);
  return deriveKey(password, salt);
}

/**
 * Base64 → Uint8Array 변환 (내부 사용)
 */
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
