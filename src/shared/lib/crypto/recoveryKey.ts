/**
 * 복구 키 생성 및 검증
 *
 * 복구 키는 사용자가 비밀번호를 잊어버렸을 때 마스터 키를 복구하는 데 사용됩니다.
 * 복구 키 원본은 사용자만 보관하고, 서버에는 해시만 저장합니다.
 */

import { uint8ArrayToBase64 } from './crypto';

const RECOVERY_KEY_LENGTH = 32; // 256 bits

/**
 * 복구 키 생성
 *
 * @returns Base64 인코딩된 복구 키 (사용자에게 1회만 표시)
 */
export function generateRecoveryKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(RECOVERY_KEY_LENGTH));
  return uint8ArrayToBase64(bytes);
}

/**
 * 복구 키 해시 생성 (SHA-256)
 *
 * 서버에 저장할 복구 키 해시를 생성합니다.
 *
 * @param recoveryKey - Base64 인코딩된 복구 키
 * @returns Base64 인코딩된 해시
 */
export async function hashRecoveryKey(recoveryKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(recoveryKey);

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return uint8ArrayToBase64(new Uint8Array(hashBuffer));
}

/**
 * 복구 키 검증 (로컬)
 *
 * 사용자가 입력한 복구 키가 저장된 해시와 일치하는지 확인합니다.
 *
 * @param recoveryKey - 사용자가 입력한 복구 키
 * @param storedHash - 서버에 저장된 해시
 * @returns 일치 여부
 */
export async function verifyRecoveryKey(
  recoveryKey: string,
  storedHash: string
): Promise<boolean> {
  const computedHash = await hashRecoveryKey(recoveryKey);
  return computedHash === storedHash;
}

/**
 * 복구 키 포맷팅 (표시용)
 *
 * 긴 Base64 문자열을 읽기 쉬운 형식으로 변환합니다.
 * 예: "XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX"
 *
 * @param recoveryKey - Base64 인코딩된 복구 키
 * @returns 포맷팅된 복구 키
 */
export function formatRecoveryKey(recoveryKey: string): string {
  // Base64에서 URL-safe하지 않은 문자 제거 후 4자리씩 그룹핑
  const clean = recoveryKey.replace(/[+/=]/g, '');
  const groups: string[] = [];

  for (let i = 0; i < clean.length; i += 4) {
    groups.push(clean.slice(i, i + 4));
  }

  return groups.join('-');
}

/**
 * 포맷팅된 복구 키를 원본으로 복원
 *
 * @param formatted - 포맷팅된 복구 키 (대시 포함)
 * @returns 원본 복구 키 (검증에 사용 불가 - 원본 Base64 필요)
 */
export function parseFormattedRecoveryKey(formatted: string): string {
  return formatted.replace(/-/g, '');
}
