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
│   ├── EncryptionSetupForm.tsx    # 암호화 비밀번호 설정
│   ├── EncryptionUnlockForm.tsx   # 암호화 해제 (비밀번호 입력)
│   ├── RecoveryKeyDisplay.tsx     # 복구 키 표시/복사
│   └── RecoveryKeyInput.tsx       # 복구 키 입력
├── hooks/
│   ├── useEncryption.ts           # 암호화 상태 관리
│   ├── useCrypto.ts               # 암호화/복호화 훅
│   └── useEncryptionSetup.ts      # 설정 관련 훅
├── api/
│   └── encryption.api.ts
├── lib/
│   ├── crypto.ts                  # 순수 암호화 함수 (Web Crypto API)
│   ├── keyDerivation.ts           # PBKDF2 키 파생
│   └── recoveryKey.ts             # 복구 키 생성/검증
├── types/
│   └── encryption.types.ts
└── utils/
    └── encryption.utils.ts
```

---

## E2E 암호화 - Frontend 구현 가이드

클라이언트에서 모든 암호화/복호화를 수행합니다. **암호화 키는 절대 서버로 전송되지 않습니다.**

### 암호화 흐름

```
[암호화 설정]
1. 사용자가 암호화 비밀번호 입력
2. crypto.getRandomValues()로 Salt 생성 (32 bytes)
3. PBKDF2로 마스터 키 파생 (비밀번호 + Salt → 256-bit key)
4. 복구 키 생성 (랜덤 256-bit → Base64 인코딩)
5. 복구 키 해시 계산 (SHA-256)
6. Salt + 복구 키 해시를 서버에 저장
7. 마스터 키를 메모리/세션에 보관

[데이터 암호화]
1. 마스터 키 확인 (없으면 비밀번호 입력 요청)
2. 랜덤 IV 생성 (12 bytes for GCM)
3. AES-256-GCM으로 암호화
4. IV + 암호문을 Base64 인코딩
5. 서버로 전송

[데이터 복호화]
1. 서버에서 암호문(Base64) 수신
2. Base64 디코딩 → IV + 암호문 분리
3. AES-256-GCM으로 복호화
4. 평문 반환
```

### 핵심 암호화 함수 (lib/crypto.ts)

```typescript
// ✅ 순수 함수로 구현 - 프레임워크 독립

// 키 파생 (PBKDF2)
export async function deriveKey(
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
    false,
    ['encrypt', 'decrypt']
  );
}

// 암호화 (AES-256-GCM)
export async function encrypt(
  plaintext: string,
  key: CryptoKey
): Promise<string> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));  // 12 bytes IV

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plaintext)
  );

  // IV + ciphertext를 결합하여 Base64 인코딩
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return btoa(String.fromCharCode(...combined));
}

// 복호화 (AES-256-GCM)
export async function decrypt(
  encrypted: string,
  key: CryptoKey
): Promise<string> {
  const combined = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(plaintext);
}

// Salt 생성
export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(32));
}

// 복구 키 생성
export function generateRecoveryKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes));
}
```

### 암호화 Hook (hooks/useCrypto.ts)

```typescript
export function useCrypto() {
  const [masterKey, setMasterKey] = useState<CryptoKey | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // 암호화 설정 (최초 1회)
  const setupEncryption = useCallback(async (password: string) => {
    const salt = generateSalt();
    const key = await deriveKey(password, salt);
    const recoveryKey = generateRecoveryKey();
    const recoveryKeyHash = await hashRecoveryKey(recoveryKey);

    // 서버에 salt, recoveryKeyHash 저장
    await encryptionApi.setup({
      salt: arrayBufferToBase64(salt),
      recoveryKeyHash,
    });

    setMasterKey(key);
    setIsUnlocked(true);

    return recoveryKey;  // 사용자에게 표시 (1회만)
  }, []);

  // 암호화 해제 (세션 시작 시)
  const unlock = useCallback(async (password: string) => {
    const { data } = await encryptionApi.getSettings();
    if (!data) throw new Error('암호화 설정이 없습니다');

    const salt = base64ToArrayBuffer(data.salt);
    const key = await deriveKey(password, salt);

    setMasterKey(key);
    setIsUnlocked(true);
  }, []);

  // 데이터 암호화
  const encryptData = useCallback(async (plaintext: string) => {
    if (!masterKey) throw new Error('암호화가 해제되지 않았습니다');
    return encrypt(plaintext, masterKey);
  }, [masterKey]);

  // 데이터 복호화
  const decryptData = useCallback(async (ciphertext: string) => {
    if (!masterKey) throw new Error('암호화가 해제되지 않았습니다');
    return decrypt(ciphertext, masterKey);
  }, [masterKey]);

  return {
    isUnlocked,
    setupEncryption,
    unlock,
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
| 암호화 키를 localStorage에 저장 | XSS 공격에 취약 |
| 암호화 키를 서버로 전송 | E2E 보안 무력화 |
| 하드코딩된 IV/Salt 사용 | 보안 취약점 |
| 복구 키를 서버에 저장 요청 | 사용자만 보관해야 함 |
| 암호화 비밀번호를 상태에 저장 | 키만 저장, 비밀번호는 즉시 폐기 |

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
| 암호화 키를 localStorage에 저장 | 메모리/세션에만 보관 |
| 암호화 키를 서버로 전송 | 클라이언트에만 존재해야 함 |
| 하드코딩된 IV/Salt 사용 | 매번 랜덤 생성 필수 |

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

- [ ] 암호화 키가 메모리/세션에만 존재하는가? (localStorage 금지)
- [ ] 암호화 키가 서버로 전송되지 않는가?
- [ ] 민감 데이터(title, reflection, content) 저장 시 암호화하는가?
- [ ] 민감 데이터 조회 시 복호화하는가?
- [ ] IV/Salt가 매번 랜덤 생성되는가?
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

- 암호화 키를 localStorage/sessionStorage에 저장 (메모리 상태로만 유지)
- 암호화 키를 서버로 전송
- 하드코딩된 IV/Salt 사용
- 복구 키를 서버에 저장 요청
- 암호화 비밀번호를 상태에 저장 (즉시 키 파생 후 폐기)

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
