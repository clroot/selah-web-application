import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import boundaries from 'eslint-plugin-boundaries';

const eslintConfig = [
  ...nextVitals,
  ...nextTs,

  // Import 순서 규칙 + Resolver 설정
  {
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
    rules: {
      // 상위 디렉터리 상대 경로 금지 (../ 사용 금지, @/ 절대 경로 사용 강제)
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*', '../**'],
              message: '상위 디렉터리 상대 경로 대신 @/ 절대 경로를 사용하세요.',
            },
          ],
        },
      ],

      // import 순서 규칙
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type', 'unknown'],
          pathGroups: [
            {
              pattern: '{react*,react*/**}',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '{next*,next*/**}',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '{@/app/**}',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '{@/components/**}',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '{@/features/**}',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '{@/shared/**}',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: './*',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['next', 'react', 'unknown'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },

  // Boundaries 플러그인 설정
  {
    plugins: {
      boundaries,
    },
    settings: {
      // Boundaries 요소 정의
      'boundaries/include': ['src/app/**/*', 'src/features/**/*', 'src/shared/**/*', 'src/components/**/*'],
      'boundaries/elements': [
        // app - Next.js App Router (최상위)
        {
          type: 'app',
          pattern: 'src/app/**',
          mode: 'full',
        },
        // features - 기능별 모듈
        {
          type: 'feature',
          pattern: 'src/features/*/**',
          capture: ['featureName'],
          mode: 'full',
        },
        // shared - 공통 코드
        {
          type: 'shared',
          pattern: 'src/shared/**',
          mode: 'full',
        },
        // components/ui - 외부 라이브러리 (shadcn/ui)
        {
          type: 'ui',
          pattern: 'src/components/ui/**',
          mode: 'full',
        },
        // components/common - 프로젝트 공통 컴포넌트
        {
          type: 'common',
          pattern: 'src/components/common/**',
          mode: 'full',
        },
      ],
    },
    rules: {
      // ==========================================
      // Boundaries 규칙 - 아키텍처 의존성 검증
      // ==========================================
      //
      // 계층 구조:
      // app → feature, shared, ui, common
      // feature → feature, shared, ui, common (다른 feature 허용, 순환만 금지)
      // common → shared, ui, common
      // shared → ui
      // ui → shared (cn 함수 등)

      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            // app: 모든 곳에서 import 가능
            {
              from: ['app'],
              allow: ['app', 'feature', 'shared', 'ui', 'common'],
            },
            // feature: 다른 feature 허용 (순환은 별도 도구로 검출)
            {
              from: ['feature'],
              allow: ['feature', 'shared', 'ui', 'common'],
            },
            // common: shared, ui, 다른 common만 허용
            {
              from: ['common'],
              allow: ['shared', 'ui', 'common'],
            },
            // shared: ui 허용
            {
              from: ['shared'],
              allow: ['shared', 'ui'],
            },
            // ui: shared만 (cn 유틸리티 함수)
            {
              from: ['ui'],
              allow: ['ui', 'shared'],
            },
          ],
        },
      ],

      // 알 수 없는 파일 경고
      'boundaries/no-unknown-files': ['warn'],
    },
  },

  // 설정/테스트 파일에서 boundaries 비활성화
  {
    files: ['**/*.config.*', '**/*.test.*', '**/*.spec.*', '**/test/**', '**/tests/**'],
    rules: {
      'boundaries/element-types': 'off',
      'boundaries/no-unknown-files': 'off',
    },
  },
];

export default eslintConfig;
