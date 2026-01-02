# 기도 데이터를 지키는 방법

> 기도는 개인적인 영역입니다. 서버 운영자조차도 사용자의 기도 내용을 볼 수 없어야 한다고 생각했습니다. 이 문서는 그 목표를 달성하기 위한 E2E 암호화 설계 과정을 정리합니다.

## 왜 E2E 암호화인가?

### 민감한 데이터의 본질

기도제목과 기도문에는 사용자의 가장 개인적인 고민, 감사, 간구가 담깁니다. 이런 데이터가 서버에 평문으로 저장된다면:

- 서버 운영자가 언제든 열람 가능
- 데이터베이스 유출 시 모든 내용 노출
- 백업 파일에도 평문으로 존재

**서버를 신뢰할 수 없는 환경으로 가정**하고 설계해야 했습니다. 서버가 해킹당하더라도, 심지어 서버 운영자(나 자신)라도 사용자의 기도 내용을 볼 수 없어야 합니다.

---

## 마주친 문제들

### 문제 1: OAuth와 E2E 암호화의 충돌

Selah는 Google, 카카오 OAuth 로그인을 지원하고 싶었습니다. 소셜 로그인은 사용자 경험이 좋고, 비밀번호 관리 부담을 줄여줍니다.

하지만 OAuth 사용자는 **Selah에 비밀번호가 없습니다.** 암호화 키를 어디서 파생해야 할까요?

```
이메일 로그인 사용자: 비밀번호 있음 → 키 파생 가능
OAuth 로그인 사용자: 비밀번호 없음 → 키 파생 불가 ❌
```

두 가지 선택지가 있었습니다:

1. **OAuth 사용자에게도 별도 비밀번호 요구** → 소셜 로그인의 편의성 상실
2. **인증과 암호화를 분리** → 별도의 암호화 PIN 도입

### 문제 2: 6자리 PIN의 취약성

그래서 별도의 "암호화 PIN"을 도입하기로 했습니다. 사용성을 위해 6자리 숫자로 제한했습니다.

하지만 6자리 PIN은 1,000,000가지 조합밖에 없습니다:

```
Salt + 암호화된 DEK가 유출되면?
    ↓
공격자가 오프라인에서 100만 번 시도
    ↓
몇 초 만에 PIN 크랙 가능 ❌
```

### 문제 3: 멀티 기기 지원

사용자가 여러 기기에서 동일한 데이터에 접근하려면 **DEK를 복원할 수 있어야** 합니다. 하지만 DEK를 서버에 평문으로 저장하면 E2E가 무너집니다.

---

## 해결: PIN + Server Key 하이브리드

### 핵심 아이디어

**클라이언트만 아는 것(PIN)**과 **서버만 아는 것(Server Key)**을 결합합니다.

```
┌─────────────────────────────────────────────────────────────┐
│  Hybrid Key Derivation                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   [6-digit PIN] + [Salt]                                    │
│         │                                                   │
│         ▼ PBKDF2 (600,000 iterations)                       │
│   [Client KEK] ──────┐                                      │
│                      │                                      │
│   [Server Key] ──────┼──▶ HKDF ──▶ [Combined KEK]           │
│   (From Server)      │              │                       │
│                                     ▼                       │
│                            AES-256-GCM Encryption           │
│                                     │                       │
│                              [Encrypted DEK]                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 왜 이 방식이 안전한가?

| 공격 시나리오       | 공격자가 가진 것           | 부족한 것           | 결과                         |
|---------------|---------------------|-----------------|----------------------------|
| DB 유출         | Salt, Encrypted DEK | Server Key, PIN | 복호화 불가                     |
| 서버 침해         | Server Key          | PIN             | 복호화 불가                     |
| DB + 서버 동시 침해 | 모든 서버 데이터           | PIN             | 온라인 브루트포스만 가능 (Rate Limit) |

**Server Key가 없으면 오프라인 브루트포스가 불가능합니다.** 공격자가 DB를 통째로 가져가도 로컬에서 PIN을 시도해볼 수 없습니다.

---

## 키 계층 구조

### 전체 그림

```
┌─────────────────────────────────────────────────────────────┐
│                        Key Hierarchy                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [DEK] Data Encryption Key (256-bit AES)                    │
│    │                                                        │
│    │  - Generated once at signup                            │
│    │  - Used to encrypt prayer data                         │
│    │  - Cached in browser IndexedDB                         │
│    │                                                        │
│    ├──▶ Encrypted with [Combined KEK] → encryptedDEK        │
│    └──▶ Encrypted with [Recovery Key] → recoveryEncryptedDEK│
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Client KEK] = PBKDF2(6-digit PIN + Salt)                  │
│    │                                                        │
│    │  - Generated only on client                            │
│    │  - Never sent to server                                │
│    │  - Discarded after use                                 │
│    │                                                        │
│    └──▶ Combined with [Server Key] → Combined KEK           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Server Key] Random 256-bit key from server                │
│                                                             │
│       - Encrypted with Master Key, stored in DB             │
│       - Re-issued on PIN change                             │
│       - Prevents offline brute-force attacks                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Recovery Key] High-entropy random string                  │
│                                                             │
│       - Shown only once at signup                           │
│       - Only hash stored on server                          │
│       - Used to recover DEK if PIN is lost                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 키별 저장 위치

| 키            | 저장 위치           | 서버가 평문을 아는가?          |
|--------------|-----------------|-----------------------|
| DEK          | 클라이언트 IndexedDB | ❌ 암호문만 저장             |
| Client KEK   | 메모리 (일시적)       | ❌ 전송 안함               |
| Server Key   | 서버 DB (암호화)     | ⚠️ Master Key로 복호화 가능 |
| Combined KEK | 메모리 (일시적)       | ❌ 생성 안함               |
| Recovery Key | 사용자 보관          | ❌ 해시만 저장              |
| Salt         | 서버 DB           | ✅ (암호화 키 아님)          |

---

## 암호화 알고리즘

| 용도              | 알고리즘          | 파라미터                             |
|-----------------|---------------|----------------------------------|
| Client KEK 파생   | PBKDF2-SHA256 | 600,000 iterations, 32-byte salt |
| Combined KEK 생성 | HKDF-SHA256   | 32-byte output                   |
| DEK 암호화         | AES-256-GCM   | 12-byte IV, 128-bit auth tag     |
| 데이터 암호화         | AES-256-GCM   | 12-byte IV, 128-bit auth tag     |

---

## 플로우

### 회원가입: 암호화 설정

```
[Signup / OAuth Complete]
        ↓
[Set 6-digit Encryption PIN]
        ↓
┌─────────────────────────────────────────────────────────────┐
│ Client                                                      │
│   1. Generate random DEK (256-bit)                          │
│   2. Generate random Salt (32-byte)                         │
│   3. PIN + Salt → Client KEK (PBKDF2)                       │
│   4. Generate random Recovery Key                           │
└─────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────┐
│ Server Request: Generate Server Key                         │
│   - Server generates 256-bit Server Key                     │
│   - Encrypts with Master Key, stores in DB                  │
│   - Returns plaintext Server Key to client                  │
└─────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────┐
│ Client                                                      │
│   5. Combined KEK = HKDF(Client KEK || Server Key)          │
│   6. encryptedDEK = AES-GCM(DEK, Combined KEK)              │
│   7. recoveryEncryptedDEK = AES-GCM(DEK, Recovery Key)      │
│   8. recoveryKeyHash = SHA256(Recovery Key)                 │
└─────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────┐
│ Server Storage                                              │
│   - salt                                                    │
│   - encryptedDEK                                            │
│   - recoveryEncryptedDEK                                    │
│   - recoveryKeyHash                                         │
└─────────────────────────────────────────────────────────────┘
        ↓
[Show Recovery Key] - "This key can only be viewed now"
        ↓
[Cache DEK in IndexedDB]
        ↓
[Enter Home Screen]
```

### 로그인: 잠금 해제

```
[Login (OAuth or Email)]
        ↓
[Check DEK cache in IndexedDB]
        ↓
┌───────────────────────────┬───────────────────────────────────┐
│  DEK exists (cached)      │  DEK not found (new device)       │
├───────────────────────────┼───────────────────────────────────┤
│                           │                                   │
│  Use immediately ✓        │  Show PIN input screen            │
│                           │         ↓                         │
│                           │  Fetch salt, encryptedDEK,        │
│                           │  serverKey from server            │
│                           │         ↓                         │
│                           │  Derive Client KEK                │
│                           │         ↓                         │
│                           │  Generate Combined KEK            │
│                           │         ↓                         │
│                           │  Decrypt DEK                      │
│                           │         ↓                         │
│                           │  Cache DEK in IndexedDB           │
│                           │                                   │
└───────────────────────────┴───────────────────────────────────┘
        ↓
[Enter Home Screen]
```

### 데이터 암호화/복호화

```
[저장]
평문 → DEK로 AES-256-GCM 암호화 → IV + 암호문 + AuthTag → Base64 → 서버 전송

[조회]
서버에서 Base64 수신 → 디코딩 → IV/암호문/AuthTag 분리 → DEK로 복호화 → 평문
```

### 암호화 대상 필드

| Entity      | 암호화 필드                |
|-------------|-----------------------|
| PrayerTopic | `title`, `reflection` |
| Prayer      | `content`             |

---

## 복구 메커니즘

### PIN 분실 시

```
[PIN을 잊어버렸어요]
     ↓
[Recovery Key 입력]
     ↓
서버에서 recoveryKeyHash로 검증
     ↓
서버에서 recoveryEncryptedDEK 조회
     ↓
클라이언트에서 Recovery Key로 DEK 복호화
     ↓
[새 PIN 설정]
     ↓
새 Salt, 새 Server Key로 DEK 재암호화
```

### PIN + Recovery Key 모두 분실 시

**데이터를 복구할 수 없습니다.**

이는 의도된 제약입니다. Zero-Knowledge 원칙을 지키려면 서버도 데이터를 복구할 수 없어야 합니다.

---

## 한계 및 Trade-off

E2E 암호화는 공짜가 아닙니다. 보안을 얻는 대신 포기해야 하는 것들이 있습니다.

### 1. 복구 불가능성

**한계**: PIN과 Recovery Key를 모두 분실하면 데이터를 영구히 잃습니다. 서버 운영자도 복구해줄 수 없습니다.

**왜 받아들였는가**: 이것이 바로 E2E 암호화의 본질입니다. 서버가 데이터를 복구할 수 있다면, 해커도 서버를 통해 복구할 수 있다는 의미입니다.

```
"서버가 복구해줄 수 있다" = "서버가 데이터에 접근할 수 있다"
                        = "E2E가 아니다"
```

사용자에게 Recovery Key의 중요성을 명확히 안내하고, 안전한 곳에 보관하도록 권장합니다. 데이터의 최종 책임은 사용자에게 있습니다. 이것이 진정한 프라이버시의 대가입니다.

### 2. 서버 의존성

**한계**: 새 기기에서 DEK를 복원하려면 Server Key가 필요합니다. 서버가 다운되면 새 기기에서 로그인할 수 없습니다.

**왜 받아들였는가**: 6자리 PIN만으로는 오프라인 브루트포스에 취약합니다. Server Key는 이 공격을 막기 위한 필수 요소입니다.

| 선택지              | 오프라인 공격 방어 | 서버 의존성        |
|------------------|------------|---------------|
| PIN만 사용          | ❌ 몇 초면 크랙  | 없음            |
| 긴 비밀번호 사용        | ✅          | 없음, 하지만 UX 저하 |
| PIN + Server Key | ✅          | 있음            |

긴 비밀번호를 요구하면 사용성이 떨어지고, OAuth 사용자에게 또 다른 비밀번호를 외우라고 할 수 없었습니다. Server Key 의존성은 보안과 사용성 사이의 균형점입니다.

**완화책**: DEK가 이미 IndexedDB에 캐시된 기기에서는 서버 없이도 암호화/복호화가 가능합니다.

### 3. 서버 측 기능 제한

**한계**: 서버는 암호문만 저장하므로 서버 측에서 할 수 있는 일이 제한됩니다.

| 기능                       | 가능 여부 | 이유     |
|--------------------------|-------|--------|
| 전문 검색 (Full-text search) | ❌     | 평문을 모름 |
| 데이터 분석/통계                | ❌     | 평문을 모름 |
| 푸시 알림에 내용 포함             | ❌     | 평문을 모름 |
| AI 기반 기능                 | ❌     | 평문을 모름 |

**왜 받아들였는가**: 이 기능들은 "서버가 데이터를 읽을 수 있어야" 가능합니다. E2E를 선택한 순간 이미 포기한 것들입니다.

Selah는 개인 기도 노트입니다. 수천 개의 기도제목을 검색할 일은 드물고, 클라이언트 측 검색으로 충분합니다. AI 분석보다 프라이버시가 더 중요하다고 판단했습니다.

### 4. Server Key 관리 책임

**한계**: Server Key가 손실되면 해당 사용자는 새 기기에서 DEK를 복원할 수 없습니다.

**왜 받아들였는가**: 이건 진짜 한계입니다. 운영 실수로 Server Key를 잃으면 사용자 데이터가 잠깁니다.

**완화책**:

- Server Key는 Master Key로 암호화되어 DB에 저장
- 정기적인 DB 백업
- 향후 AWS KMS / GCP Cloud HSM으로 업그레이드 검토

### 5. 브라우저 저장소 의존성

**한계**: DEK는 IndexedDB에 캐시됩니다. 브라우저 데이터를 삭제하면 PIN을 다시 입력해야 합니다.

**왜 받아들였는가**: DEK를 매번 서버에서 받아오면 네트워크 지연이 발생하고, 오프라인 사용이 불가능합니다.

IndexedDB는 localStorage보다 안전합니다:

- 동일 출처 정책(Same-origin policy) 적용
- XSS 공격에 상대적으로 강함
- 용량 제한이 넉넉함

---

## 그럼에도 이 설계를 선택한 이유

모든 한계를 알고도 이 설계를 선택한 이유는 하나입니다:

> **사용자의 가장 개인적인 기록은 본인만 볼 수 있어야 합니다.**

서버 운영자인 내가 사용자의 기록을 열람할 수 있다면, 사용자는 진심을 담아 기록하기 어렵습니다. 불편함을 감수하더라도 프라이버시를 지키는 것이 이 서비스의 핵심 가치입니다.

| 포기한 것     | 얻은 것              |
|-----------|-------------------|
| 서버 측 검색   | 완전한 프라이버시         |
| 관리자 복구 기능 | Zero-Knowledge 보장 |
| 일부 편의 기능  | 데이터 유출 시에도 안전     |

---

## 구현 참조

| 파일                                       | 역할                        |
|------------------------------------------|---------------------------|
| `src/shared/lib/crypto/keyDerivation.ts` | Client KEK 파생 (PBKDF2)    |
| `src/shared/lib/crypto/hkdf.ts`          | Combined KEK 생성           |
| `src/shared/lib/crypto/dek.ts`           | DEK 생성/암호화/복호화            |
| `src/shared/lib/crypto/crypto.ts`        | 데이터 암호화/복호화 (AES-256-GCM) |
| `src/shared/lib/crypto/recoveryKey.ts`   | Recovery Key 생성/검증        |
| `src/shared/lib/dekCache.ts`             | DEK 브라우저 캐싱 (IndexedDB)   |

---

## 결론

Selah의 E2E 암호화는 **"서버를 신뢰하지 않는다"**는 전제에서 출발했습니다.

1. **OAuth 호환**: 로그인 비밀번호 대신 별도의 6자리 PIN 사용
2. **오프라인 공격 방지**: PIN + Server Key 하이브리드로 브루트포스 차단
3. **Zero-Knowledge**: 서버는 평문 데이터와 암호화 키 모두 알 수 없음

이 설계로 사용자의 기도 데이터는 본인만 볼 수 있습니다. 서버 운영자도, 데이터베이스가 유출되어도, 사용자의 기도 내용은 안전합니다.
