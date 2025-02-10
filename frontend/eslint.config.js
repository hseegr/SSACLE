import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-plugin-prettier'
import importPlugin from 'eslint-plugin-import'

export default [
  // 무시할 파일 설정
  { ignores: ['dist'] },

  // 설정 블록
  {
    files: ['**/*.{js,jsx,ts,tsx}'], // 린트를 적용할 파일들
    languageOptions: {
      ecmaVersion: 2020, // ECMAScript 버전
      globals: globals.browser, // 브라우저 환경 글로벌 변수
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true }, // JSX 지원
        sourceType: 'module',
      },
    },
    settings: { react: { version: 'detect' } }, // React 버전 자동 감지
    plugins: {
      react, // react 플러그인
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier, // prettier 플러그인
      import: importPlugin, // import 플러그인 추가
    },
    rules: {
      // Prettier 설정
      // Prettier 규칙을 ESLint 오류로 표시
      'prettier/prettier': [
        'error',
        {
          // 개행 문자를 운영체제에 맞게 자동으로 설정
          endLine: 'auto',
        },
      ],

      // ESLint 기본 규칙 설정
      ...js.configs.recommended.rules,

      // React 관련 규칙 설정
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      // target="_blank" 사용 시 보안 경고 비활성화
      'react/jsx-no-target-blank': 'off',
      // Fast Refresh 관련 규칙 (상수 내보내기 허용)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // JSX 중괄호 내부 공백 규칙
      'react/jsx-curly-spacing': ['error', { when: 'never', children: true }],
      // props spreading 허용
      'react/jsx-props-no-spreading': 'off',
      // HTML 엔티티 이스케이프 경고
      'react/no-unescaped-entities': 'warn',
      // PropTypes 검사 비활성화
      'react/prop-types': 'off',
      // React import 구문 체크 비활성화
      'react/react-in-jsx-scope': 'off',

      // 변수 관련 규칙
      // 사용하지 않는 변수 경고
      'no-unused-vars': 'warn',
      // const 사용 권장
      'prefer-const': 'warn',

      // 디버깅 관련 규칙
      // console 사용 시 경고
      'no-console': 'warn',
      // 정의되지 않은 변수 사용 금지
      'no-undef': 'error',
      // 최대 연속 빈 줄 제한
      'no-multiple-empty-lines': ['error', { max: 2 }],

      // 코드 스타일 규칙
      // 세미콜론 사용 금지
      semi: ['error', 'never'],
      // 화살표 함수 매개변수 괄호 필수
      'arrow-parens': ['warn', 'always'],
      // 함수 선언 방식을 표현식으로 통일
      // 'func-style': ['warn', 'expression'],
      // 배열 괄호 내부 공백 금지
      'array-bracket-spacing': ['error', 'never'],
      // 카멜케이스 강제 (속성 제외)
      camelcase: ['error', { properties: 'never' }],

      // 코드 복잡도 관련 규칙
      // 중첩 깊이 제한
      'max-depth': ['error', 4],

      // ES6+ 관련 규칙
      // var 사용 금지
      'no-var': 'error',
      // 템플릿 리터럴 사용 권장
      'prefer-template': 'warn',
      // 구조 분해 할당 사용 권장
      'prefer-destructuring': ['warn', { array: true, object: true }],
      // 스프레드 연산자 사용 권장
      'prefer-spread': 'warn',

      // 공백과 줄바꿈 관련 규칙
      // 줄 끝 공백 금지
      'no-trailing-spaces': 'warn',

      // import/export 관련 규칙
      // import 구문 정렬 (선언 정렬 무시)
      // 'sort-imports': ['error', { ignoreDeclarationSort: true }],
      // 중복 import 금지
      'no-duplicate-imports': 'error',
      // 모듈 해석 오류 검사
      // 'import/no-unresolved': 'error',
      // named import 검사
      'import/named': 'error',

      // 'import/default': 'error',  // default import 검사
      // namespace import 검사
      // 'import/namespace': 'error',
      // 자기 자신 import 금지
      'import/no-self-import': 'error',
      // 순환 참조 금지
      'import/no-cycle': 'error',
      // 불필요한 경로 세그먼트 금지
      'import/no-useless-path-segments': 'error',
      // 사용하지 않는 모듈 import 금지
      'import/no-unused-modules': 'error',
      // import 구문을 파일 최상단에 위치
      'import/first': 'error',
      // export 구문을 파일 최하단에 위치
      // 'import/exports-last': 'error',
      // 중복 import 금지
      'import/no-duplicates': 'error',
      // import 순서 규칙
      // 'import/order': [
      //   'error',
      //   {
      //     groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      //     'newlines-between': 'always',
      //   },
      // ],
    },
  },
]
