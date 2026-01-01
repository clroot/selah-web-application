# Selah Web Application

> "멈추고, 묵상하고, 기록하다"

기도제목과 기도문을 기록하고, 응답받은 기도를 확인하며 믿음을 성장시키는 **개인용 기도노트 서비스** Selah의 웹 애플리케이션입니다.

---

## 프로젝트 개요

### 핵심 가치

| Value        | Description                 |
|--------------|------------------------------|
| **간편한 기록**   | 기도제목을 제목만으로 빠르게 기록          |
| **기도 습관 형성** | 매일 기도문을 작성하며 기도 생활 유지       |
| **믿음 성장**    | 응답받은 기도를 확인하며 하나님에 대한 신뢰 강화 |

### 주요 기능

- **기도제목 관리**: 기도제목 CRUD, 응답 체크, 소감 작성
- **기도문 관리**: 기도문 작성 (하루 여러 개 가능), 히스토리 조회
- **돌아보기**: 과거 기도제목 리마인드, 랜덤/주기적 선정
- **통계**: 응답된 기도 통계, 타임라인 뷰
- **인증**: 소셜 로그인 (Google, Apple, 카카오) + 이메일/비밀번호
- **E2E 암호화**: 6자리 PIN + Server Key 기반 클라이언트 암호화

---

## Tech Stack

| Category         | Technology        |
|------------------|-------------------|
| Framework        | Next.js 16 (App Router) |
| Language         | TypeScript        |
| UI Components    | shadcn/ui         |
| Styling          | Tailwind CSS 4    |
| State Management | Zustand |
| Package Manager  | pnpm              |
| Linting          | ESLint            |

---

## Architecture

### Feature-based 폴더 구조

```
src/
├── app/                  # Next.js App Router (라우팅 전용)
│   ├── (routes)/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/           # 전역 컴포넌트
│   ├── ui/              # shadcn/ui (외부 코드)
│   └── common/          # 프로젝트 공통 컴포넌트
│
├── features/            # 기능별 폴더
│   ├── member/          # 회원/인증 기능
│   ├── encryption/      # E2E 암호화 기능
│   ├── prayer-topic/    # 기도제목 기능
│   ├── prayer/          # 기도문 기능
│   └── reflection/      # 돌아보기 기능
│
└── shared/              # 공통 코드
    ├── api/             # API 클라이언트
    ├── hooks/
    ├── utils/
    └── types/
```

### 계층 의존성

```
Pages/Routes (app/)
    ↓
Presentation (components/)
    ↓
Application (hooks/)
    ↓
Infrastructure (api/)
```

- 하위 계층은 상위 계층을 import할 수 없음
- Feature 간 직접 import 금지 (shared를 통해서만 공유)

---

## 화면 구성

| 화면 | 설명 |
|------|------|
| **홈** | 오늘의 기도 작성 + 돌아볼 기도 카드 + 기도제목 목록 |
| **기도문 작성** | 기도제목 목록 보면서 기도문 작성 |
| **기도제목 관리** | 기도제목 추가/수정/삭제 |
| **응답된 기도** | 리스트/타임라인/통계 뷰 |
| **설정** | 알림 설정, 계정 관리 |

### 오늘의 기도 인사말

| 시간대 | 시간 | 문구 |
|--------|------|------|
| 아침 | 05:00 ~ 11:59 | "오늘 하루를 기도로 시작해보세요" |
| 점심 | 12:00 ~ 13:59 | "잠시 멈추고, 기도의 시간을 가져보세요" |
| 오후 | 14:00 ~ 17:59 | "오늘 하루, 어떤 감사가 있었나요?" |
| 저녁 | 18:00 ~ 20:59 | "하루를 마무리하며 기도해보세요" |
| 밤 | 21:00 ~ 04:59 | "고요한 밤, 주님과 대화해보세요" |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Run Locally

```bash
# 1. Clone repository
git clone https://github.com/clroot/selah-web-application.git
cd selah-web-application

# 2. Install dependencies
pnpm install

# 3. Run development server
pnpm dev

# 4. Access application
open http://localhost:3000
```

### Build

```bash
# Build
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint
```

---

## Development Guidelines

자세한 개발 가이드라인은 [CLAUDE.md](./CLAUDE.md) 참조

### 핵심 규칙

- `app/` 폴더는 라우팅 전용
- 비즈니스 로직은 `features/` 폴더에 작성
- `components/ui/` 폴더는 외부 코드 전용 (수정 금지)
- Feature 간 직접 import 금지
- 비즈니스 로직은 프레임워크에서 분리

---

## Design System

### 브랜드 컬러

| Color | Hex | Usage |
|-------|-----|-------|
| Sand | `#D4C4B0` | Primary 배경 |
| Warm Beige | `#E8DFD4` | Secondary 배경 |
| Deep Brown | `#5C4A3D` | Primary 텍스트 |
| Soft Brown | `#8B7355` | Secondary 텍스트 |
| Cream White | `#FAF7F2` | 카드/입력 배경 |

### 디자인 원칙

- **Soft UI**: 부드러운 그림자, 둥근 모서리
- **미니멀**: 여백 충분히, 필수 요소만
- **차분함**: 부드러운 전환 효과, 눈에 편한 색상

---

## Related Projects

| Project | Description |
|---------|-------------|
| [selah-api-server](../selah-api-server) | Kotlin/Spring Boot 백엔드 API |
| selah-mobile (예정) | React Native 모바일 앱 |

---

## License

MIT License
