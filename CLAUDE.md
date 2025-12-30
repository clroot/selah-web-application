# Selah Web Application - Claude Code Guidelines

> "멈추고, 묵상하고, 기록하다"
>
> 기도제목과 기도문을 기록하고, 응답받은 기도를 확인하며 믿음을 성장시키는 개인용 기도노트 서비스

## 프로젝트 컨텍스트

- React/TypeScript 기반 프론트엔드 애플리케이션
- Next.js App Router 사용
- 변경하기 쉬운 코드 작성을 최우선 목표로 함
- 패키지 매니저: pnpm
- 코드 품질 도구: ESLint, Prettier

## Tech Stack

| Category         | Technology             |
|------------------|------------------------|
| Framework        | Next.js (App Router)   |
| Language         | TypeScript             |
| UI Components    | shadcn/ui              |
| Styling          | Tailwind CSS           |
| State Management | TBD (Zustand, Jotai 등) |
| Package Manager  | pnpm                   |
| Linting          | ESLint, Prettier       |
| Crypto           | Web Crypto API (AES-256-GCM, PBKDF2) |

## 🚨 Critical Rules

### 1. 가독성 규칙

#### 함수/컴포넌트 제한

- 하나의 함수/컴포넌트는 단일 책임만 가져야 함
- 함수는 최대 20줄을 넘지 않도록 작성
- 중첩 레벨은 최대 3단계까지만 허용
- 조건문이 3개 이상 연결되면 반드시 변수로 추출

```typescript
// ✅ Good
const isEligibleUser = user.age >= 18 && user.isVerified && !user.isBanned;
if (isEligibleUser) {
    /* ... */
}

// ❌ Bad
if (user.age >= 18 && user.isVerified && !user.isBanned) {
    /* ... */
}
```

#### 네이밍 규칙

| Type       | Convention                               | Example                       |
|------------|------------------------------------------|-------------------------------|
| Boolean 변수 | `is`, `has`, `should`, `can`, `will` 접두사 | `isLoading`, `hasError`       |
| 이벤트 핸들러    | `handle` 접두사                             | `handleClick`, `handleSubmit` |
| 데이터 페칭     | `fetch`, `get`, `load` 접두사               | `fetchPrayerTopics`           |
| 변환 함수      | `format`, `parse`, `transform` 접두사       | `formatDate`                  |
| 검증 함수      | `validate`, `check` 접두사                  | `validateEmail`               |
| 컴포넌트       | PascalCase                               | `PrayerTopicCard`             |

### 2. 폴더 구조 (필수)

```
src/
├── app/                  # Next.js App Router (라우팅 전용)
│   ├── (routes)/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/           # 전역 컴포넌트
│   ├── ui/              # 🚨 shadcn/ui (외부 코드 - 수정 금지)
│   └── common/          # 프로젝트 공통 컴포넌트
│
├── features/            # 기능별 폴더 (반드시 이 구조 사용)
│   └── [feature-name]/
│       ├── components/  # UI 컴포넌트
│       ├── hooks/       # 비즈니스 로직
│       ├── api/         # API 호출
│       ├── types/       # 타입 정의
│       └── utils/       # 유틸리티
│
└── shared/              # 공통 코드
    ├── api/             # API 클라이언트
    ├── hooks/
    ├── utils/
    └── types/
```

**규칙:**

- `app/` 폴더는 라우팅 전용
- 비즈니스 로직은 `features/` 폴더에 작성
- `components/ui/` 폴더는 외부 코드 전용 (수정 금지)

### 3. 계층 의존성 규칙 (단방향만 허용)

```
Pages/Routes (app/)
    ↓
Presentation (components/)
    ↓
Application (hooks/)
    ↓
Infrastructure (api/)
```

**절대 규칙:**

- 하위 계층은 상위 계층을 import할 수 없음
- Feature 간 직접 import 금지 (shared를 통해서만 공유)
- API는 컴포넌트를 import할 수 없음

### 4. 프레임워크 의존성 관리

#### 반드시 격리해야 할 것 (프레임워크 독립)

- 비즈니스 계산 로직
- 검증 로직
- 데이터 변환 로직
- 상태 관리 로직 (Custom Hooks)
- API 호출 로직 (fetch 기반)

#### 직접 사용해도 되는 것

- Link, Image 같은 UI 컴포넌트
- 라우팅 관련 UI
- 메타데이터, SEO 관련 코드

```typescript
// ✅ Level 1: 순수 비즈니스 로직 - 반드시 격리
// features/prayer-topic/utils/prayerCalculator.ts
export function calculateAnsweredRate(topics: PrayerTopic[]): number {
    const answered = topics.filter(t => t.status === 'ANSWERED').length;
    return topics.length > 0 ? (answered / topics.length) * 100 : 0;
}

// ✅ Level 2: 상태 관리 로직 - 반드시 격리
// features/prayer-topic/hooks/usePrayerTopics.ts
export function usePrayerTopics() {
    const [topics, setTopics] = useState<PrayerTopic[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    // ...
    return {topics, isLoading, fetchTopics};
}

// ✅ Level 3: UI 컴포넌트 - Next.js 사용 OK
// features/prayer-topic/components/PrayerTopicCard.tsx
import Link from 'next/link';

export function PrayerTopicCard({topic}: Props) {
    return (
        <Link href = {`/prayer-topics/${topic.id}`
}>
    {/* ... */
    }
    </Link>
)
    ;
}
```

## Feature 구조

### Auth (인증)

```
features/auth/
├── components/
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── SocialLoginButtons.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useLogin.ts
├── api/
│   └── auth.api.ts
└── types/
    └── auth.types.ts
```

### Prayer Topic (기도제목)

```
features/prayer-topic/
├── components/
│   ├── PrayerTopicList.tsx
│   ├── PrayerTopicCard.tsx
│   ├── PrayerTopicForm.tsx
│   └── AnswerCheckButton.tsx
├── hooks/
│   ├── usePrayerTopics.ts
│   └── usePrayerTopicDetail.ts
├── api/
│   └── prayerTopic.api.ts
├── types/
│   └── prayerTopic.types.ts
└── utils/
    └── prayerTopic.utils.ts
```

### Prayer (기도문)

```
features/prayer/
├── components/
│   ├── PrayerEditor.tsx
│   ├── PrayerHistory.tsx
│   └── PrayerCard.tsx
├── hooks/
│   └── usePrayers.ts
├── api/
│   └── prayer.api.ts
└── types/
    └── prayer.types.ts
```

### Reflection (돌아보기)

```
features/reflection/
├── components/
│   ├── ReflectionCard.tsx
│   ├── AnsweredPrayerList.tsx
│   ├── TimelineView.tsx
│   └── StatsView.tsx
├── hooks/
│   ├── useReflection.ts
│   └── useStats.ts
├── api/
│   └── reflection.api.ts
└── types/
    └── reflection.types.ts
```

### Encryption (E2E 암호화)

```
features/encryption/
├── components/
│   ├── RecoveryKeyDisplay.tsx     # 복구 키 표시/복사 (회원가입 완료 후)
│   ├── RecoveryKeyInput.tsx       # 복구 키 입력 (비밀번호 분실 시)
│   ├── EncryptionStatus.tsx       # 암호화 상태 표시
│   └── RegenerateRecoveryKey.tsx  # 복구 키 재생성
├── hooks/
│   ├── useCrypto.ts               # 암호화/복호화 훅
│   └── useEncryptionSetup.ts      # 설정 관련 훅
├── stores/
│   └── encryptionStore.ts         # Zustand 암호화 상태 store
├── api/
│   └── encryption.api.ts
├── lib/
│   ├── crypto.ts                  # 순수 암호화 함수 (Web Crypto API)
│   ├── keyDerivation.ts           # PBKDF2 키 파생 (KEK)
│   ├── dek.ts                     # DEK 생성/암호화/복호화
│   └── recoveryKey.ts             # 복구 키 생성/검증
├── types/
│   └── encryption.types.ts
└── utils/
    └── encryption.utils.ts
```

---

## E2E 암호화 - Frontend 구현 가이드

클라이언트에서 모든 암호화/복호화를 수행합니다. **암호화 키는 절대 서버로 전송되지 않습니다.**

### UX 정책

| 정책 | Frontend 역할 |
|------|-------------|
| **E2E 필수 적용** | 암호화 비활성화 UI 제공 안함 (항상 활성화) |
| **투명한 암호화** | 별도 암호화 비밀번호 없음 (로그인 비밀번호 사용) |
| **자동 잠금 해제** | 로그인 성공 시 자동으로 DEK 복호화 |
| **복구 키 1회 표시** | 회원가입 완료 직후 복구 키 표시 화면으로 이동, 이후 재확인 불가 |
| **복구 키 재생성** | 설정 화면에서 재생성 가능 (기존 키 무효화 경고 필수) |
| **복구 키 보기 없음** | 설정 화면에 복구 키 조회 기능 없음 |

> **📌 참고**: 전체 UX 정책은 [루트 CLAUDE.md](../CLAUDE.md#ux-정책) 참조

### DEK/KEK 구조

```
┌─────────────────────────────────────────────────────────────┐
│  DEK (Data Encryption Key)                                   │
│  - 랜덤 생성된 256-bit 키 (회원가입 시 1회 생성)                  │
│  - 실제 데이터(기도제목, 기도문) 암호화에 사용                     │
│  - 서버에는 암호화된 형태(encryptedDEK)로만 저장                  │
│  - 클라이언트 메모리에만 평문 존재                                │
├─────────────────────────────────────────────────────────────┤
│  KEK (Key Encryption Key)                                    │
│  - 로그인 비밀번호 + Salt로 파생 (PBKDF2)                        │
│  - DEK를 암호화/복호화하는 데만 사용                              │
│  - 서버에 전송되지 않음 (메모리에서만 사용 후 폐기)                  │
├─────────────────────────────────────────────────────────────┤
│  복구 키 (Recovery Key)                                       │
│  - DEK 복구를 위한 별도 키                                      │
│  - 회원가입 시 1회만 표시 (이후 조회 불가)                         │
│  - 비밀번호 분실 시 DEK 복구에 사용                               │
└─────────────────────────────────────────────────────────────┘
```

### 회원가입 플로우

```
[회원가입 폼 입력]
  - 이메일, 비밀번호, 닉네임 입력
     ↓
[회원가입 API 호출]
     ↓
[클라이언트: 암호화 설정]
  1. DEK 랜덤 생성 (256-bit)
  2. Salt 생성 (32 bytes)
  3. 로그인 비밀번호 + Salt → KEK 파생 (PBKDF2)
  4. KEK로 DEK 암호화 → encryptedDEK
  5. 복구 키 생성 + 복구 키로 DEK 암호화 → recoveryEncryptedDEK
  6. 서버에 저장: salt, encryptedDEK, recoveryEncryptedDEK, recoveryKeyHash
  7. DEK를 메모리에 저장 (암호화 해제 상태)
     ↓
[RecoveryKeyDisplay 컴포넌트]
  - 복구 키 표시 (예: XXXX-XXXX-XXXX-XXXX-XXXX-XXXX)
  - 복사/저장 버튼
  - 경고: "이 키는 지금만 확인할 수 있습니다"
  - 체크박스: "복구 키를 안전한 곳에 저장했습니다"
  - 체크 시 "시작하기" 버튼 활성화
     ↓
[홈 화면 진입]
```

### 로그인 플로우

```
[로그인 폼 입력]
  - 이메일, 비밀번호 입력
     ↓
[로그인 API 호출]
     ↓
[클라이언트: 암호화 해제]
  1. 암호화 설정 조회 (salt, encryptedDEK)
  2. 로그인 비밀번호 + Salt → KEK 파생 (PBKDF2)
  3. KEK로 encryptedDEK 복호화 → DEK
  4. DEK를 메모리에 저장 (암호화 해제 상태)
     ↓
[홈 화면 진입]
  - 사용자는 추가 입력 없이 바로 사용 가능
```

### 데이터 암호화/복호화 흐름

```
[데이터 암호화]
1. DEK 확인 (없으면 로그인 필요)
2. 랜덤 IV 생성 (12 bytes for GCM)
3. AES-256-GCM으로 암호화 (DEK 사용)
4. IV + 암호문을 Base64 인코딩
5. 서버로 전송

[데이터 복호화]
1. 서버에서 암호문(Base64) 수신
2. Base64 디코딩 → IV + 암호문 분리
3. AES-256-GCM으로 복호화 (DEK 사용)
4. 평문 반환
```

### 핵심 암호화 함수

#### lib/keyDerivation.ts (KEK 파생)

```typescript
// ✅ 순수 함수로 구현 - 프레임워크 독립

// KEK 파생 (PBKDF2) - 로그인 비밀번호에서 KEK 생성
export async function deriveKEK(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,  // 최소 100,000 권장
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,  // extractable: DEK 암호화에 사용
    ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey']
  );
}

// Salt 생성
export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(32));
}
```

#### lib/dek.ts (DEK 관리)

```typescript
// DEK 랜덤 생성 (회원가입 시 1회)
export async function generateDEK(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,  // extractable: 암호화하여 저장하기 위해
    ['encrypt', 'decrypt']
  );
}

// KEK로 DEK 암호화 (서버 저장용)
export async function encryptDEK(
  dek: CryptoKey,
  kek: CryptoKey
): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const wrappedKey = await crypto.subtle.wrapKey('raw', dek, kek, {
    name: 'AES-GCM',
    iv,
  });

  // IV + wrappedKey를 결합하여 Base64 인코딩
  const combined = new Uint8Array(iv.length + wrappedKey.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(wrappedKey), iv.length);

  return btoa(String.fromCharCode(...combined));
}

// KEK로 DEK 복호화 (로그인 시)
export async function decryptDEK(
  encryptedDEK: string,
  kek: CryptoKey
): Promise<CryptoKey> {
  const combined = Uint8Array.from(atob(encryptedDEK), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const wrappedKey = combined.slice(12);

  return crypto.subtle.unwrapKey(
    'raw',
    wrappedKey,
    kek,
    { name: 'AES-GCM', iv },
    { name: 'AES-GCM', length: 256 },
    false,  // extractable: false (메모리에서만 사용)
    ['encrypt', 'decrypt']
  );
}
```

#### lib/crypto.ts (데이터 암호화)

```typescript
// 데이터 암호화 (AES-256-GCM, DEK 사용)
export async function encrypt(
  plaintext: string,
  dek: CryptoKey
): Promise<string> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));  // 12 bytes IV

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    dek,
    encoder.encode(plaintext)
  );

  // IV + ciphertext를 결합하여 Base64 인코딩
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return btoa(String.fromCharCode(...combined));
}

// 데이터 복호화 (AES-256-GCM, DEK 사용)
export async function decrypt(
  encrypted: string,
  dek: CryptoKey
): Promise<string> {
  const combined = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    dek,
    ciphertext
  );

  return new TextDecoder().decode(plaintext);
}
```

#### lib/recoveryKey.ts (복구 키)

```typescript
// 복구 키 생성 (랜덤 256-bit)
export function generateRecoveryKey(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(32));
}

// 복구 키 포맷 (XXXX-XXXX-XXXX-XXXX-XXXX-XXXX 형식)
export function formatRecoveryKey(key: Uint8Array): string {
  const hex = Array.from(key)
    .map(b => b.toString(16).padStart(2, '0').toUpperCase())
    .join('');
  return hex.match(/.{4}/g)?.join('-') ?? hex;
}

// 복구 키 해시 (서버 저장용)
export async function hashRecoveryKey(key: Uint8Array): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', key);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

// 복구 키로 DEK 암호화
export async function encryptDEKWithRecoveryKey(
  dek: CryptoKey,
  recoveryKey: Uint8Array
): Promise<string> {
  // 복구 키에서 KEK 파생 (Salt 없이, 복구 키 자체가 충분히 랜덤)
  const recoveryKEK = await crypto.subtle.importKey(
    'raw',
    recoveryKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['wrapKey']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const wrappedKey = await crypto.subtle.wrapKey('raw', dek, recoveryKEK, {
    name: 'AES-GCM',
    iv,
  });

  const combined = new Uint8Array(iv.length + wrappedKey.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(wrappedKey), iv.length);

  return btoa(String.fromCharCode(...combined));
}
```

### Zustand Store (stores/encryptionStore.ts)

```typescript
import { create } from 'zustand';
import { deriveKEK, generateSalt } from '../lib/keyDerivation';
import { generateDEK, encryptDEK, decryptDEK } from '../lib/dek';
import { generateRecoveryKey, formatRecoveryKey, hashRecoveryKey, encryptDEKWithRecoveryKey } from '../lib/recoveryKey';
import { encryptionApi } from '../api/encryption.api';

interface EncryptionState {
  isUnlocked: boolean;
  dek: CryptoKey | null;
}

interface EncryptionActions {
  // 회원가입 시 암호화 설정 (로그인 비밀번호 사용)
  setupEncryption: (loginPassword: string) => Promise<string>;
  // 로그인 시 암호화 해제 (로그인 비밀번호 사용)
  unlockWithPassword: (loginPassword: string) => Promise<void>;
  // 비밀번호 변경 시 DEK 재암호화
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  // 복구 키로 복구
  recoverWithKey: (recoveryKey: string, newPassword: string) => Promise<void>;
  // 복구 키 재생성
  regenerateRecoveryKey: (password: string) => Promise<string>;
  // 잠금
  lock: () => void;
}

export const useEncryptionStore = create<EncryptionState & EncryptionActions>((set, get) => ({
  isUnlocked: false,
  dek: null,

  setupEncryption: async (loginPassword: string) => {
    // 1. DEK 랜덤 생성
    const dek = await generateDEK();

    // 2. Salt 생성 및 KEK 파생
    const salt = generateSalt();
    const kek = await deriveKEK(loginPassword, salt);

    // 3. KEK로 DEK 암호화
    const encryptedDEK = await encryptDEK(dek, kek);

    // 4. 복구 키 생성 및 DEK 암호화
    const recoveryKey = generateRecoveryKey();
    const recoveryEncryptedDEK = await encryptDEKWithRecoveryKey(dek, recoveryKey);
    const recoveryKeyHash = await hashRecoveryKey(recoveryKey);

    // 5. 서버에 저장
    await encryptionApi.setup({
      salt: btoa(String.fromCharCode(...salt)),
      encryptedDEK,
      recoveryEncryptedDEK,
      recoveryKeyHash,
    });

    // 6. DEK를 메모리에 저장
    set({ isUnlocked: true, dek });

    // 7. 복구 키 반환 (1회만 표시)
    return formatRecoveryKey(recoveryKey);
  },

  unlockWithPassword: async (loginPassword: string) => {
    const { data } = await encryptionApi.getSettings();
    if (!data) throw new Error('암호화 설정이 없습니다');

    // KEK 파생 및 DEK 복호화
    const salt = Uint8Array.from(atob(data.salt), c => c.charCodeAt(0));
    const kek = await deriveKEK(loginPassword, salt);
    const dek = await decryptDEK(data.encryptedDEK, kek);

    set({ isUnlocked: true, dek });
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    const { dek } = get();
    if (!dek) throw new Error('암호화가 해제되지 않았습니다');

    // 새 Salt 및 KEK 생성
    const newSalt = generateSalt();
    const newKEK = await deriveKEK(newPassword, newSalt);

    // 기존 DEK를 새 KEK로 재암호화 (DEK 자체는 변경 안됨!)
    const newEncryptedDEK = await encryptDEK(dek, newKEK);

    await encryptionApi.updateEncryption({
      salt: btoa(String.fromCharCode(...newSalt)),
      encryptedDEK: newEncryptedDEK,
    });
  },

  lock: () => {
    set({ isUnlocked: false, dek: null });
  },

  // ... recoverWithKey, regenerateRecoveryKey 구현
}));
```

### 암호화 Hook (hooks/useCrypto.ts)

```typescript
import { useCallback } from 'react';
import { useEncryptionStore } from '../stores/encryptionStore';
import { encrypt, decrypt } from '../lib/crypto';

export function useCrypto() {
  const { dek, isUnlocked } = useEncryptionStore();

  // 데이터 암호화
  const encryptData = useCallback(async (plaintext: string) => {
    if (!dek) throw new Error('암호화가 해제되지 않았습니다');
    return encrypt(plaintext, dek);
  }, [dek]);

  // 데이터 복호화
  const decryptData = useCallback(async (ciphertext: string) => {
    if (!dek) throw new Error('암호화가 해제되지 않았습니다');
    return decrypt(ciphertext, dek);
  }, [dek]);

  return {
    isUnlocked,
    encryptData,
    decryptData,
  };
}
```

### 기도제목 API 연동 예시

```typescript
// features/prayer-topic/hooks/usePrayerTopics.ts
export function usePrayerTopics() {
  const { encryptData, decryptData, isUnlocked } = useCrypto();
  const [topics, setTopics] = useState<PrayerTopic[]>([]);

  // 조회 시 복호화
  const fetchTopics = useCallback(async () => {
    const { data } = await prayerTopicApi.getAll();
    if (!data) return;

    const decrypted = await Promise.all(
      data.map(async (topic) => ({
        ...topic,
        title: await decryptData(topic.title),
        reflection: topic.reflection
          ? await decryptData(topic.reflection)
          : null,
      }))
    );
    setTopics(decrypted);
  }, [decryptData]);

  // 저장 시 암호화
  const createTopic = useCallback(async (title: string) => {
    const encryptedTitle = await encryptData(title);
    return prayerTopicApi.create({ title: encryptedTitle });
  }, [encryptData]);

  return { topics, fetchTopics, createTopic, isUnlocked };
}
```

### ⚠️ Frontend 암호화 금지 사항

| 금지 | 이유 |
|------|------|
| DEK를 localStorage/sessionStorage에 저장 | XSS 공격에 취약 |
| DEK/KEK를 서버로 전송 | E2E 보안 무력화 |
| 하드코딩된 IV/Salt 사용 | 보안 취약점 |
| 복구 키를 서버에 저장 요청 | 사용자만 보관해야 함 |
| 비밀번호를 상태에 저장 | KEK 파생 후 즉시 폐기 |
| 별도 암호화 비밀번호 UI 제공 | 로그인 비밀번호 사용이 정책 |

---

## 코딩 컨벤션

### 컴포넌트 패턴

```typescript
// 일반 컴포넌트
interface PrayerTopicCardProps {
  topic: PrayerTopic;
  onAnswer?: (id: string) => void;
}

export function PrayerTopicCard({ topic, onAnswer }: PrayerTopicCardProps) {
  // 1. hooks
  // 2. 이벤트 핸들러
  // 3. 조건부 렌더링
  // 4. 메인 렌더링
}

// Next.js 페이지 컴포넌트
interface PageProps {
  params: { id: string };
}

// Server Component (기본)
export default async function Page({ params }: PageProps) {
  const data = await fetchData(params.id);
  return <div>{/* ... */}</div>;
}

// Client Component (필요시)
'use client';

export default function Page({ params }: PageProps) {
  const [state, setState] = useState();
  return <div>{/* ... */}</div>;
}
```

### Hook 패턴

```typescript
export function usePrayerTopics() {
  const [topics, setTopics] = useState<PrayerTopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTopics = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await prayerTopicApi.getAll();
      if (error) throw error;
      setTopics(data ?? []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  return { topics, isLoading, error, refetch: fetchTopics };
}
```

### API 패턴 (필수)

```typescript
// shared/api/client.ts
const apiClient = {
  async get<T>(url: string): Promise<{ data: T | null; error: Error | null }> {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },
  // post, put, delete 동일 패턴
};

// features/prayer-topic/api/prayerTopic.api.ts
export const prayerTopicApi = {
  getAll: () => apiClient.get<PrayerTopic[]>('/api/prayer-topics'),
  getById: (id: string) => apiClient.get<PrayerTopic>(`/api/prayer-topics/${id}`),
  create: (data: CreatePrayerTopicDto) => apiClient.post('/api/prayer-topics', data),
  markAsAnswered: (id: string, reflection?: string) =>
    apiClient.patch(`/api/prayer-topics/${id}/answer`, { reflection }),
};
```

### 타입 정의 규칙

```typescript
// ✅ interface는 객체 타입에만
interface PrayerTopic {
  id: string;
  title: string;
  status: PrayerStatus;
  createdAt: string;
  answeredAt?: string;
  reflection?: string;
}

// ✅ type은 union, 함수 타입에
type PrayerStatus = 'PRAYING' | 'ANSWERED';

// ✅ enum 대신 as const 사용
export const PrayerStatus = {
  PRAYING: 'PRAYING',
  ANSWERED: 'ANSWERED',
} as const;
export type PrayerStatus = (typeof PrayerStatus)[keyof typeof PrayerStatus];
```

### Import 순서

```typescript
// 1. React/Framework
import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';

// 2. 외부 라이브러리
import {z} from 'zod';
import {format} from 'date-fns';

// 3. 절대 경로 imports (@/)
import {Button} from '@/components/ui/button';
import {useAuth} from '@/features/auth/hooks/useAuth';

// 4. 상대 경로 imports
import {PrayerTopicCard} from './PrayerTopicCard';

// 5. 타입 imports
import type {PrayerTopic} from '../types';

// 6. 스타일 imports
import styles from './PrayerTopic.module.css';
```

## 에러 처리

### Next.js 에러 파일

```typescript
// app/[route]/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>문제가 발생했습니다</h2>
      <button onClick={() => reset()}>다시 시도</button>
    </div>
  );
}

// app/not-found.tsx
export default function NotFound() {
  return <div>페이지를 찾을 수 없습니다</div>;
}
```

## 코드 품질 검사

### 작업 순서 (필수)

1. **환경 확인**
   ```bash
   # lock 파일 확인
   ls pnpm-lock.yaml
   ```

2. **코드 작성** (위 규칙 준수)

3. **린트 검사**
   ```bash
   pnpm lint
   pnpm lint:fix
   ```

4. **타입 체크**
   ```bash
   pnpm build  # 또는
   pnpm tsc --noEmit
   ```

5. **포맷팅**
   ```bash
   pnpm format
   ```

## ⚠️ Common Pitfalls (자주 하는 실수)

| 실수                  | 올바른 방법           |
|---------------------|------------------|
| `any` 타입 사용         | 구체적인 타입 정의       |
| `@ts-ignore` 사용     | 타입 에러 해결         |
| `eslint-disable` 사용 | 규칙 준수 (외부 코드 제외) |
| props 5개 초과         | 객체로 묶거나 컴포넌트 분리  |
| 중첩 3단계 초과           | 함수/컴포넌트 분리       |
| Feature 간 직접 import | shared를 통해 공유    |
| shadcn/ui 직접 수정     | 래퍼 컴포넌트 생성       |
| API 직접 fetch        | api 레이어 사용       |
| 콘솔 로그 남김            | 제거 또는 개발 환경 조건부  |
| 매직 넘버 사용            | 상수로 추출           |
| DEK를 localStorage에 저장 | 메모리에만 보관 |
| DEK/KEK를 서버로 전송 | 클라이언트에만 존재해야 함 |
| 하드코딩된 IV/Salt 사용 | 매번 랜덤 생성 필수 |
| 별도 암호화 비밀번호 요구 | 로그인 비밀번호에서 KEK 파생 |

## 코드 생성 시 체크리스트

### 기본 체크리스트

- [ ] 함수/컴포넌트가 20줄 이하인가?
- [ ] 중첩 레벨이 3단계 이하인가?
- [ ] props가 5개 이하인가?
- [ ] 네이밍이 명확하고 일관적인가?
- [ ] 에러 처리가 되어 있는가?
- [ ] TypeScript 타입이 명시되어 있는가?
- [ ] feature 폴더 구조를 따르는가?
- [ ] ESLint 규칙을 통과하는가?

### 아키텍처 체크리스트

- [ ] 계층 간 의존성이 단방향인가?
- [ ] Feature 간 직접 import가 없는가?
- [ ] API 호출이 표준 패턴을 따르는가?
- [ ] 외부 코드(shadcn/ui)를 수정하지 않았는가?
- [ ] 비즈니스 로직이 프레임워크에서 분리되었는가?

### E2E 암호화 체크리스트

- [ ] DEK가 메모리에만 존재하는가? (localStorage/sessionStorage 금지)
- [ ] DEK/KEK가 서버로 전송되지 않는가?
- [ ] 민감 데이터(title, reflection, content) 저장 시 DEK로 암호화하는가?
- [ ] 민감 데이터 조회 시 DEK로 복호화하는가?
- [ ] IV/Salt가 매번 랜덤 생성되는가?
- [ ] 로그인 시 자동으로 DEK가 복호화되는가? (별도 암호화 비밀번호 없음)
- [ ] 복호화 실패 시 적절한 에러 처리가 되어 있는가?
- [ ] 암호화 함수가 순수 함수로 lib/ 폴더에 분리되어 있는가?

## 금지 사항

- `any` 타입 사용
- `@ts-ignore` 사용
- `eslint-disable` 주석 사용 (외부 코드 제외)
- 콘솔 로그 남기기
- 매직 넘버
- 중첩된 삼항 연산자
- index를 key로 사용 (정적 리스트 제외)
- 패키지 매니저 혼용 (pnpm만 사용)
- 외부 코드(shadcn/ui) 직접 수정

### E2E 암호화 금지 사항

- DEK를 localStorage/sessionStorage에 저장 (메모리 상태로만 유지)
- DEK/KEK를 서버로 전송
- 하드코딩된 IV/Salt 사용
- 복구 키를 서버에 저장 요청
- 비밀번호를 상태에 저장 (KEK 파생 후 즉시 폐기)
- 별도 암호화 비밀번호 UI 제공 (로그인 비밀번호에서 KEK 파생)

## 빠른 참조 명령어

```bash
# 개발 서버
pnpm dev

# 빌드
pnpm build

# 린팅
pnpm lint
pnpm lint:fix

# 포맷팅
pnpm format

# 타입 체크
pnpm tsc --noEmit

# shadcn/ui 컴포넌트 추가
pnpm dlx shadcn-ui@latest add [component-name]
```

---

**핵심**: 가독성과 간단함을 우선하되, 비즈니스 로직은 프레임워크로부터 격리하세요.
