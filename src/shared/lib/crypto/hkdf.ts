/**
 * HKDF (HMAC-based Key Derivation Function)
 *
 * Client KEK와 Server Key를 결합하여 Combined KEK를 생성합니다.
 * Combined KEK = HKDF(Client KEK || Server Key)
 */

/**
 * HKDF로 두 키를 결합하여 새로운 키 생성
 *
 * @param clientKEK - Client KEK (CryptoKey from PBKDF2)
 * @param serverKeyBase64 - Base64 인코딩된 Server Key (서버에서 받은 값)
 * @param salt - Salt (Uint8Array, 32 bytes 권장)
 * @returns Combined KEK (CryptoKey with wrapKey/unwrapKey permission)
 */
export async function deriveCombinedKEK(
  clientKEK: CryptoKey,
  serverKeyBase64: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  // Client KEK를 raw bytes로 export
  const clientKEKBytes = new Uint8Array(
    await crypto.subtle.exportKey("raw", clientKEK),
  );

  // Server Key를 bytes로 변환
  const serverKeyBytes = Uint8Array.from(atob(serverKeyBase64), (c) =>
    c.charCodeAt(0),
  );

  // Client KEK || Server Key 결합
  const combined = new Uint8Array(
    clientKEKBytes.length + serverKeyBytes.length,
  );
  combined.set(clientKEKBytes);
  combined.set(serverKeyBytes, clientKEKBytes.length);

  // HKDF용 key material로 import
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    combined,
    "HKDF",
    false,
    ["deriveKey"],
  );

  // HKDF로 Combined KEK 파생
  return crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: salt.buffer as ArrayBuffer,
      info: new TextEncoder().encode("selah-combined-kek"),
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false, // extractable: false (보안상 키 추출 불가)
    ["wrapKey", "unwrapKey"],
  );
}
