import { create } from "zustand";

import { encryptionApi } from "@/shared/api/encryption.api";
import {
  base64ToUint8Array,
  decryptDEK,
  deriveClientKEK,
  deriveCombinedKEK,
  encryptDEK,
  encryptDEKWithRecoveryKey,
  formatRecoveryKey,
  generateDEK,
  generateRecoveryKey,
  generateSalt,
  hashRecoveryKey,
  uint8ArrayToBase64,
} from "@/shared/lib/crypto";
import {
  cacheDEK,
  clearDEKCache,
  hasCachedDEK,
  loadCachedDEK,
} from "@/shared/lib/dekCache";

interface EncryptionState {
  isUnlocked: boolean;
  dek: CryptoKey | null;
  isRestoring: boolean;
  /** 설정 완료 후 표시할 복구 키 (1회만 표시) */
  pendingRecoveryKey: string | null;
}

interface EncryptionActions {
  /**
   * 회원가입 시 암호화 설정
   * @param pin 6자리 숫자 PIN
   * @returns 포맷팅된 복구 키 (사용자에게 1회만 표시)
   */
  setupEncryption: (pin: string) => Promise<string>;

  /**
   * 로그인 시 암호화 해제
   * @param pin 6자리 숫자 PIN
   */
  unlockWithPIN: (pin: string) => Promise<void>;

  /**
   * 캐시에서 DEK 복원 (페이지 새로고침 시)
   * @returns 복원 성공 여부
   */
  restoreFromCache: () => Promise<boolean>;

  /**
   * 캐시 존재 여부 확인 (빠른 체크)
   */
  hasCachedSession: () => boolean;

  /**
   * PIN 변경 시 DEK 재암호화
   * @param newPIN 새 6자리 PIN
   */
  changePIN: (newPIN: string) => Promise<void>;

  /**
   * 복구 키로 DEK 복구
   * @param recoveryKey 복구 키 (포맷팅된 문자열)
   * @param newPIN 새 6자리 PIN
   */
  recoverWithKey: (recoveryKey: string, newPIN: string) => Promise<void>;

  /**
   * 복구 키 재생성
   * @returns 새 포맷팅된 복구 키
   */
  regenerateRecoveryKey: () => Promise<string>;

  /**
   * 암호화 잠금 (로그아웃 시)
   */
  lock: () => void;

  /**
   * 대기 중인 복구 키 삭제 (복구 키 확인 완료 후)
   */
  clearPendingRecoveryKey: () => void;
}

export const useEncryptionStore = create<EncryptionState & EncryptionActions>(
  (set, get) => ({
    isUnlocked: false,
    dek: null,
    isRestoring: false,
    pendingRecoveryKey: null,

    setupEncryption: async (pin: string) => {
      // 1. DEK 랜덤 생성
      const dek = await generateDEK();

      // 2. Salt 생성 및 Client KEK 파생
      const salt = generateSalt();
      const clientKEK = await deriveClientKEK(pin, salt);

      // 3. 복구 키 생성 및 DEK 암호화 (복구용)
      const recoveryKey = generateRecoveryKey();
      const recoveryEncryptedDEK = await encryptDEKWithRecoveryKey(
        dek,
        recoveryKey,
      );
      const recoveryKeyHash = await hashRecoveryKey(recoveryKey);

      // 4. 서버에 저장 (encryptedDEK는 null - 서버가 serverKey 생성)
      // 서버가 serverKey를 응답으로 반환
      const { data, error } = await encryptionApi.setup({
        salt: uint8ArrayToBase64(salt),
        encryptedDEK: null, // serverKey 반환 후 updateEncryption으로 업데이트
        recoveryEncryptedDEK,
        recoveryKeyHash,
      });

      if (error || !data) {
        throw new Error(error?.message ?? "암호화 설정 실패");
      }

      // 5. Server Key와 Client KEK를 결합하여 Combined KEK 생성
      const combinedKEK = await deriveCombinedKEK(
        clientKEK,
        data.serverKey,
        salt,
      );

      // 6. Combined KEK로 DEK 암호화
      const encryptedDEK = await encryptDEK(dek, combinedKEK);

      // 7. 암호화된 DEK를 서버에 업데이트
      const { error: updateError } = await encryptionApi.updateEncryption({
        salt: uint8ArrayToBase64(salt),
        encryptedDEK,
        rotateServerKey: false,
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      // 8. DEK를 메모리에 저장 및 캐시
      const formattedRecoveryKey = formatRecoveryKey(recoveryKey);
      set({ isUnlocked: true, dek, pendingRecoveryKey: formattedRecoveryKey });
      await cacheDEK(dek);

      // 9. 포맷팅된 복구 키 반환
      return formattedRecoveryKey;
    },

    unlockWithPIN: async (pin: string) => {
      const { data, error } = await encryptionApi.getSettings();
      if (error || !data) {
        throw new Error(error?.message ?? "암호화 설정을 찾을 수 없습니다");
      }

      // Salt에서 Client KEK 파생
      const salt = base64ToUint8Array(data.salt);
      const clientKEK = await deriveClientKEK(pin, salt);

      // Server Key와 Client KEK를 결합하여 Combined KEK 생성
      const combinedKEK = await deriveCombinedKEK(
        clientKEK,
        data.serverKey,
        salt,
      );

      // Combined KEK로 DEK 복호화
      const dek = await decryptDEK(data.encryptedDEK, combinedKEK);

      // DEK를 메모리에 저장 및 캐시
      set({ isUnlocked: true, dek });
      await cacheDEK(dek);
    },

    restoreFromCache: async () => {
      const { isUnlocked } = get();
      if (isUnlocked) return true;

      set({ isRestoring: true });
      try {
        const cachedDEK = await loadCachedDEK();
        if (cachedDEK) {
          set({ isUnlocked: true, dek: cachedDEK, isRestoring: false });
          return true;
        }
        set({ isRestoring: false });
        return false;
      } catch {
        set({ isRestoring: false });
        return false;
      }
    },

    hasCachedSession: () => {
      return hasCachedDEK();
    },

    changePIN: async (newPIN: string) => {
      const { dek } = get();
      if (!dek) {
        throw new Error("암호화가 해제되지 않았습니다");
      }

      // 새 Salt 생성 및 Client KEK 파생
      const newSalt = generateSalt();
      const newClientKEK = await deriveClientKEK(newPIN, newSalt);

      // 기존 설정 조회 (현재 Server Key 필요)
      const { data: currentSettings, error: getError } =
        await encryptionApi.getSettings();
      if (getError || !currentSettings) {
        throw new Error(getError?.message ?? "현재 설정 조회 실패");
      }

      // 새 Combined KEK 생성 (기존 Server Key 사용)
      const newCombinedKEK = await deriveCombinedKEK(
        newClientKEK,
        currentSettings.serverKey,
        newSalt,
      );

      // 기존 DEK를 새 Combined KEK로 재암호화
      const newEncryptedDEK = await encryptDEK(dek, newCombinedKEK);

      // 서버에 업데이트 요청 (Server Key 유지)
      const { error } = await encryptionApi.updateEncryption({
        salt: uint8ArrayToBase64(newSalt),
        encryptedDEK: newEncryptedDEK,
        rotateServerKey: false,
      });

      if (error) {
        throw new Error(error.message);
      }
    },

    recoverWithKey: async (recoveryKey: string, newPIN: string) => {
      // 1. 서버에서 복구 설정 조회
      const { data: recoverySettings, error: recoveryError } =
        await encryptionApi.getRecoverySettings();
      if (recoveryError || !recoverySettings) {
        throw new Error(recoveryError?.message ?? "복구 설정을 찾을 수 없습니다");
      }

      // 2. 복구 키로 DEK 복호화 (decryptDEKWithRecoveryKey는 포맷된 문자열도 처리)
      const { decryptDEKWithRecoveryKey } = await import("@/shared/lib/crypto");
      let dek: CryptoKey;
      try {
        dek = await decryptDEKWithRecoveryKey(
          recoverySettings.recoveryEncryptedDEK,
          recoveryKey,
        );
      } catch {
        throw new Error("복구 키가 올바르지 않습니다");
      }

      // 3. 서버에서 현재 설정 조회 (serverKey 획득)
      const { data: currentSettings, error: settingsError } =
        await encryptionApi.getSettings();
      if (settingsError || !currentSettings) {
        throw new Error(settingsError?.message ?? "암호화 설정 조회 실패");
      }

      // 4. 새 Salt 생성 및 Client KEK 파생
      const newSalt = generateSalt();
      const newClientKEK = await deriveClientKEK(newPIN, newSalt);

      // 5. Combined KEK 생성 (기존 Server Key 재사용)
      const combinedKEK = await deriveCombinedKEK(
        newClientKEK,
        currentSettings.serverKey,
        newSalt,
      );

      // 6. DEK 재암호화
      const newEncryptedDEK = await encryptDEK(dek, combinedKEK);

      // 7. 서버에 업데이트 (Server Key 유지)
      const { error: updateError } = await encryptionApi.updateEncryption({
        salt: uint8ArrayToBase64(newSalt),
        encryptedDEK: newEncryptedDEK,
        rotateServerKey: false,
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      // 8. DEK 캐시에 저장 및 상태 업데이트
      await cacheDEK(dek);
      set({ isUnlocked: true, dek });
    },

    regenerateRecoveryKey: async () => {
      const { dek } = get();
      if (!dek) {
        throw new Error("암호화가 해제되지 않았습니다");
      }

      // 새 복구 키 생성
      const newRecoveryKey = generateRecoveryKey();
      const recoveryEncryptedDEK = await encryptDEKWithRecoveryKey(
        dek,
        newRecoveryKey,
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
      set({
        isUnlocked: false,
        dek: null,
        isRestoring: false,
        pendingRecoveryKey: null,
      });
      // 캐시 삭제 (비동기지만 결과 대기 불필요)
      clearDEKCache();
    },

    clearPendingRecoveryKey: () => {
      set({ pendingRecoveryKey: null });
    },
  }),
);
