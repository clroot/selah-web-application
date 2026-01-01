/**
 * IndexedDB DEK Cache
 *
 * DEK를 IndexedDB에 안전하게 캐시하여 페이지 새로고침 시 PIN 재입력 방지
 *
 * 보안 전략:
 * 1. 랜덤 wrap key로 DEK를 암호화하여 IndexedDB에 저장
 * 2. wrap key는 sessionStorage에 저장 (브라우저 종료 시 자동 삭제)
 * 3. 양쪽 모두 존재할 때만 DEK 복원 가능
 */

const DB_NAME = "selah-encryption";
const DB_VERSION = 1;
const STORE_NAME = "dek-cache";
const CACHE_KEY = "wrapped-dek";
const SESSION_KEY = "selah-wrap-key";

/**
 * IndexedDB 연결
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

/**
 * Wrap key 생성 (DEK 암호화용)
 */
async function generateWrapKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "wrapKey",
    "unwrapKey",
  ]);
}

/**
 * Wrap key를 sessionStorage에 저장
 */
async function saveWrapKeyToSession(wrapKey: CryptoKey): Promise<void> {
  const exported = await crypto.subtle.exportKey("raw", wrapKey);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
  sessionStorage.setItem(SESSION_KEY, base64);
}

/**
 * sessionStorage에서 wrap key 로드
 */
async function loadWrapKeyFromSession(): Promise<CryptoKey | null> {
  const base64 = sessionStorage.getItem(SESSION_KEY);
  if (!base64) return null;

  try {
    const keyBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    return crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-GCM", length: 256 },
      true,
      ["wrapKey", "unwrapKey"],
    );
  } catch {
    return null;
  }
}

/**
 * DEK 캐시 저장
 */
export async function cacheDEK(dek: CryptoKey): Promise<void> {
  try {
    // 1. 새 wrap key 생성
    const wrapKey = await generateWrapKey();

    // 2. DEK를 wrap key로 암호화
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const wrappedKey = await crypto.subtle.wrapKey("raw", dek, wrapKey, {
      name: "AES-GCM",
      iv,
    });

    // 3. IV + wrappedKey를 IndexedDB에 저장
    const combined = new Uint8Array(iv.length + wrappedKey.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(wrappedKey), iv.length);

    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(combined, CACHE_KEY);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
    db.close();

    // 4. Wrap key를 sessionStorage에 저장
    await saveWrapKeyToSession(wrapKey);
  } catch (error) {
    console.warn("DEK 캐시 저장 실패:", error);
  }
}

/**
 * 캐시된 DEK 로드
 */
export async function loadCachedDEK(): Promise<CryptoKey | null> {
  try {
    // 1. sessionStorage에서 wrap key 로드
    const wrapKey = await loadWrapKeyFromSession();
    if (!wrapKey) return null;

    // 2. IndexedDB에서 wrapped DEK 로드
    const db = await openDB();
    const combined = await new Promise<Uint8Array | null>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(CACHE_KEY);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result ?? null);
    });
    db.close();

    if (!combined) return null;

    // 3. IV와 wrappedKey 분리
    const iv = combined.slice(0, 12);
    const wrappedKey = combined.slice(12);

    // 4. DEK 복호화
    return crypto.subtle.unwrapKey(
      "raw",
      wrappedKey,
      wrapKey,
      { name: "AES-GCM", iv },
      { name: "AES-GCM", length: 256 },
      false, // extractable: false (메모리에서만 사용)
      ["encrypt", "decrypt"],
    );
  } catch {
    return null;
  }
}

/**
 * DEK 캐시 삭제
 */
export async function clearDEKCache(): Promise<void> {
  try {
    // sessionStorage에서 wrap key 삭제
    sessionStorage.removeItem(SESSION_KEY);

    // IndexedDB에서 wrapped DEK 삭제
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(CACHE_KEY);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
    db.close();
  } catch (error) {
    console.warn("DEK 캐시 삭제 실패:", error);
  }
}

/**
 * 캐시 유효성 확인 (빠른 체크)
 */
export function hasCachedDEK(): boolean {
  return sessionStorage.getItem(SESSION_KEY) !== null;
}
