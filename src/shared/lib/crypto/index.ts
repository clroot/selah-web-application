/**
 * E2E 암호화 라이브러리 (DEK/KEK 구조)
 *
 * Web Crypto API 기반 클라이언트 측 암호화 유틸리티
 *
 * 암호화 구조:
 * - DEK (Data Encryption Key): 실제 데이터 암호화 키, 랜덤 생성
 * - KEK (Key Encryption Key): 로그인 비밀번호에서 파생, DEK 암호화에 사용
 * - Recovery Key: 복구 키, DEK 복구용, 회원가입 시 1회만 표시
 */

// Core encryption (데이터 암호화/복호화)
export { encrypt, decrypt, generateSalt, uint8ArrayToBase64, base64ToUint8Array } from './crypto';

// Key derivation (KEK 파생)
export { deriveKEK, deriveKey, deriveKeyFromBase64Salt } from './keyDerivation';

// DEK management (DEK 생성/암호화/복호화)
export { generateDEK, encryptDEK, decryptDEK, exportDEK, importDEK } from './dek';

// Recovery key (복구 키 관리)
export {
  generateRecoveryKey,
  generateRecoveryKeyBase64,
  hashRecoveryKey,
  verifyRecoveryKey,
  formatRecoveryKey,
  parseFormattedRecoveryKey,
  encryptDEKWithRecoveryKey,
  decryptDEKWithRecoveryKey,
} from './recoveryKey';
