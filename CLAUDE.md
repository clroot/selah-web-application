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
| State Management | Zustand |
| Package Manager  | pnpm                   |
| Linting          | ESLint, Prettier       |
| Crypto           | Web Crypto API (AES-256-GCM, PBKDF2, HKDF) |

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

### Member (회원/인증)

> 📂 **구현 위치**: [`src/features/member/`](./src/features/member/)

```
features/member/
├── components/
│   ├── LoginForm.tsx           # 이메일 로그인 폼
│   ├── SignupForm.tsx          # 회원가입 폼
│   ├── SocialLoginButtons.tsx  # OAuth 소셜 로그인 버튼
│   ├── PasswordSetupForm.tsx   # 비밀번호 설정 (OAuth 후)
│   ├── PasswordStrengthMeter.tsx
│   ├── TermsAgreement.tsx      # 약관 동의
│   └── ForgotPasswordForm.tsx
├── hooks/
│   ├── useLogin.ts
│   ├── useSignup.ts
│   ├── useLogout.ts
│   └── useCurrentUser.ts
├── stores/
│   └── authStore.ts            # Zustand 인증 상태 store
├── providers/
│   └── AuthProvider.tsx        # 인증 초기화 및 라우트 보호
├── api/
│   ├── auth.api.ts
│   └── member.api.ts
├── lib/
│   └── oauth.ts                # OAuth 헬퍼 함수
├── types/
│   ├── auth.types.ts
│   └── member.types.ts
└── utils/
    └── schemas.ts              # Zod 스키마
```

### Prayer Topic (기도제목)

> 📂 **구현 위치**: [`src/features/prayer-topic/`](./src/features/prayer-topic/)

```
features/prayer-topic/
├── components/
│   ├── PrayerTopicList.tsx
│   ├── PrayerTopicCard.tsx
│   ├── PrayerTopicForm.tsx
│   ├── PrayerTopicDetail.tsx
│   ├── AnswerCheckBottomSheet.tsx
│   ├── StatusFilter.tsx
│   └── EmptyState.tsx
├── hooks/
│   ├── usePrayerTopics.ts
│   ├── usePrayerTopicDetail.ts
│   ├── usePrayerTopicMutation.ts
│   └── useAnswerCheck.ts
├── api/
│   └── prayerTopic.api.ts
├── types/
│   └── prayerTopic.types.ts
└── utils/
    ├── prayerTopic.utils.ts
    └── schemas.ts
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

> 📂 **구현 위치**: [`src/features/encryption/`](./src/features/encryption/) + [`src/shared/lib/crypto/`](./src/shared/lib/crypto/)

```
features/encryption/
├── components/
│   ├── PinInput.tsx              # 6자리 PIN 입력 컴포넌트
│   ├── PinSetupForm.tsx          # PIN 설정 폼 (회원가입 시)
│   ├── PinUnlockForm.tsx         # PIN 입력 폼 (잠금 해제)
│   └── RecoveryKeyDisplay.tsx    # 복구 키 표시/복사
└── hooks/
    └── useEncryptionSetup.ts     # 암호화 설정 훅

shared/lib/crypto/                 # 순수 암호화 함수 (프레임워크 독립)
├── crypto.ts                      # 데이터 암호화/복호화 (AES-256-GCM)
├── keyDerivation.ts               # Client KEK 파생 (PBKDF2)
├── hkdf.ts                        # Combined KEK 생성 (HKDF)
├── dek.ts                         # DEK 생성/암호화/복호화
├── recoveryKey.ts                 # 복구 키 생성/검증
└── index.ts

shared/lib/
└── dekCache.ts                    # DEK 브라우저 캐싱 (IndexedDB)

shared/stores/
└── encryptionStore.ts             # Zustand 암호화 상태 store
```

---

## E2E 암호화 - Frontend 구현 가이드

클라이언트에서 모든 암호화/복호화를 수행합니다. **암호화 키는 절대 서버로 전송되지 않습니다.**

> **📌 참고**: 전체 암호화 아키텍처는 [루트 CLAUDE.md](../CLAUDE.md#e2e-암호화-end-to-end-encryption) 참조

### UX 정책

| 정책 | Frontend 역할 |
|------|-------------|
| **E2E 필수 적용** | 암호화 비활성화 UI 제공 안함 (항상 활성화) |
| **6자리 PIN 분리** | 로그인 비밀번호와 별도의 암호화 PIN 사용 |
| **DEK 브라우저 캐시** | IndexedDB에 DEK 저장하여 매번 PIN 입력 불필요 |
| **새 기기 시 PIN 입력** | 캐시 없으면 PIN 입력 화면 표시 |
| **복구 키 1회 표시** | 회원가입 완료 직후 복구 키 표시, 이후 재확인 불가 |

### 키 구조 (PIN + Server Key)

```
┌─────────────────────────────────────────────────────────────┐
│  DEK (Data Encryption Key)                                   │
│  - 랜덤 생성된 256-bit 키 (회원가입 시 1회 생성)                  │
│  - 실제 데이터(기도제목, 기도문) 암호화에 사용                     │
│  - 브라우저(IndexedDB)에 캐시, 서버에는 암호화된 형태로 저장       │
├─────────────────────────────────────────────────────────────┤
│  Client KEK                                                  │
│  - 6자리 PIN + Salt로 파생 (PBKDF2)                           │
│  - 서버에 전송되지 않음                                         │
├─────────────────────────────────────────────────────────────┤
│  Server Key                                                  │
│  - 서버에서 랜덤 생성 (256-bit)                                 │
│  - 별도 보안 저장 (앱 레벨 암호화)                               │
│  - 오프라인 브루트포스 공격 방지                                 │
├─────────────────────────────────────────────────────────────┤
│  Combined KEK = HKDF(Client KEK || Server Key)               │
│  - Client KEK와 Server Key를 결합하여 생성                      │
│  - DEK를 암호화/복호화하는 데 사용                               │
├─────────────────────────────────────────────────────────────┤
│  복구 키 (Recovery Key)                                       │
│  - DEK 복구를 위한 별도 키                                      │
│  - 회원가입 시 1회만 표시 (이후 조회 불가)                         │
│  - PIN 분실 시 DEK 복구에 사용                                  │
└─────────────────────────────────────────────────────────────┘
```

### 회원가입 플로우

```
[회원가입/OAuth 완료]
     ↓
[약관 동의]
     ↓
[암호화 PIN 설정] - PinSetupForm 컴포넌트
  - 6자리 숫자 입력
     ↓
[클라이언트: 암호화 설정]
  1. DEK 랜덤 생성 (256-bit)
  2. Salt 생성 (32 bytes)
  3. 6자리 PIN + Salt → Client KEK 파생 (PBKDF2)
  4. 서버에 Server Key 생성 요청 → Server Key 수신
  5. Combined KEK = HKDF(Client KEK || Server Key)
  6. Combined KEK로 DEK 암호화 → encryptedDEK
  7. 복구 키 생성 + 복구 키로 DEK 암호화 → recoveryEncryptedDEK
  8. 서버에 저장: salt, encryptedDEK, recoveryEncryptedDEK
  9. DEK를 브라우저(IndexedDB)에 저장 - dekCache.ts
     ↓
[RecoveryKeyDisplay 컴포넌트]
  - 복구 키 표시 (예: XXXX-XXXX-XXXX-XXXX-XXXX-XXXX)
  - 복사 버튼 제공
  - 경고: "이 키는 지금만 확인할 수 있습니다"
  - 체크박스: "복구 키를 안전한 곳에 저장했습니다"
     ↓
[홈 화면 진입]
```

### 로그인 플로우

```
[로그인 (OAuth 또는 이메일+비밀번호)]
     ↓
[브라우저 DEK 확인] - dekCache.ts
  - IndexedDB에서 DEK 조회
     ↓
┌─────────────────┬─────────────────────────────┐
│ DEK 있음        │ DEK 없음 (새 기기/캐시 삭제) │
├─────────────────┼─────────────────────────────┤
│ 바로 사용 ✅    │ PinUnlockForm 표시           │
│                 │ 1. 6자리 PIN 입력            │
│                 │ 2. 서버에서 salt, serverKey  │
│                 │    encryptedDEK 조회         │
│                 │ 3. Client KEK 파생           │
│                 │ 4. Combined KEK 생성         │
│                 │ 5. DEK 복호화                │
│                 │ 6. DEK 브라우저 저장         │
└─────────────────┴─────────────────────────────┘
     ↓
[홈 화면 진입]
```

### 데이터 암호화/복호화 흐름

```
[데이터 암호화]
1. DEK 확인 (없으면 PIN 입력 필요)
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

### 핵심 암호화 함수 (구현 참조)

모든 암호화 함수는 순수 함수로 프레임워크와 독립적으로 구현되어 있습니다.

| 파일 | 역할 | 위치 |
|------|------|------|
| `keyDerivation.ts` | Client KEK 파생 (PIN + Salt → PBKDF2) | [`src/shared/lib/crypto/keyDerivation.ts`](./src/shared/lib/crypto/keyDerivation.ts) |
| `hkdf.ts` | Combined KEK 생성 (Client KEK + Server Key) | [`src/shared/lib/crypto/hkdf.ts`](./src/shared/lib/crypto/hkdf.ts) |
| `dek.ts` | DEK 생성/암호화/복호화 | [`src/shared/lib/crypto/dek.ts`](./src/shared/lib/crypto/dek.ts) |
| `crypto.ts` | 데이터 암호화/복호화 (AES-256-GCM) | [`src/shared/lib/crypto/crypto.ts`](./src/shared/lib/crypto/crypto.ts) |
| `recoveryKey.ts` | 복구 키 생성/검증 | [`src/shared/lib/crypto/recoveryKey.ts`](./src/shared/lib/crypto/recoveryKey.ts) |
| `dekCache.ts` | DEK 브라우저 캐싱 (IndexedDB) | [`src/shared/lib/dekCache.ts`](./src/shared/lib/dekCache.ts) |
| `encryptionStore.ts` | Zustand 암호화 상태 store | [`src/shared/stores/encryptionStore.ts`](./src/shared/stores/encryptionStore.ts) |

### ⚠️ Frontend 암호화 금지 사항

| 금지 | 이유 |
|------|------|
| DEK를 localStorage/sessionStorage에 저장 | XSS 공격에 취약 (IndexedDB 사용) |
| Client KEK/DEK를 서버로 전송 | E2E 보안 무력화 |
| 하드코딩된 IV/Salt 사용 | 보안 취약점 |
| 복구 키를 서버에 저장 요청 | 사용자만 보관해야 함 |
| PIN을 상태에 저장 | Client KEK 파생 후 즉시 폐기 |

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
import {useCurrentUser} from '@/features/member/hooks/useCurrentUser';

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
| DEK를 localStorage에 저장 | IndexedDB를 통해 dekCache.ts로 저장 |
| Client KEK/DEK를 서버로 전송 | 클라이언트에만 존재해야 함 |
| 하드코딩된 IV/Salt 사용 | 매번 랜덤 생성 필수 |

### React Hook Form + React Compiler 호환성

React Hook Form의 `watch()` 함수는 React Compiler와 호환성 문제가 있습니다.
`watch`를 그대로 사용하면 컴파일러가 최적화를 건너뛰는 경고가 발생합니다.

**해결책**: `watch`를 `useWatch`로 rename하여 사용

```typescript
// ❌ Bad - React Compiler 경고 발생
const { watch } = useForm();
const password = watch('password');

// ✅ Good - React Compiler가 hook으로 인식
const { watch: useWatch } = useForm();
const password = useWatch('password');
```

> **TODO**: react-hook-form 8.x 버전이 릴리즈되면 공식 호환성 지원 여부를 확인하고,
> 지원되면 `useWatch` rename을 제거하고 원래의 `watch`로 복원할 것.

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

- [ ] DEK가 IndexedDB(dekCache.ts)를 통해 안전하게 저장되는가?
- [ ] Client KEK/DEK가 서버로 전송되지 않는가?
- [ ] 민감 데이터(title, reflection, content) 저장 시 DEK로 암호화하는가?
- [ ] 민감 데이터 조회 시 DEK로 복호화하는가?
- [ ] IV/Salt가 매번 랜덤 생성되는가?
- [ ] DEK 캐시가 있으면 바로 사용, 없으면 PIN 입력 화면이 표시되는가?
- [ ] Combined KEK 생성 시 Server Key가 HKDF로 결합되는가?
- [ ] 복호화 실패 시 적절한 에러 처리가 되어 있는가?
- [ ] 암호화 함수가 순수 함수로 shared/lib/crypto/ 폴더에 분리되어 있는가?

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

- DEK를 localStorage/sessionStorage에 저장 (IndexedDB의 dekCache.ts 사용)
- Client KEK/DEK를 서버로 전송
- 하드코딩된 IV/Salt 사용
- 복구 키를 서버에 저장 요청
- PIN을 상태에 저장 (Client KEK 파생 후 즉시 폐기)

## Git Commit 규칙

> **📌 참고**: 커밋 메시지 형식은 [루트 CLAUDE.md](../CLAUDE.md#git-commit-규칙) 참조

프론트엔드 관련 주요 scope:
- `member`: 회원/인증 기능
- `prayer-topic`: 기도제목 기능
- `encryption`: E2E 암호화
- `ui`: UI 컴포넌트

---

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
