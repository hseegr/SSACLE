export default {
  // 문자열에 작은따옴표 사용
  singleQuote: true,

  // 세미콜론 사용하지 않음 (ESLint semi rule과 일치)
  semi: false,

  // 객체 속성에 따옴표 필요할 때만 사용
  quoteProps: 'as-needed',

  // 탭 대신 스페이스 사용
  useTabs: false,

  // 들여쓰기 너비 2칸
  tabWidth: 2,

  // 한 줄 최대 길이 120자
  printWidth: 80,

  // 화살표 함수 매개변수 항상 괄호 사용 (ESLint arrow-parens rule과 일치)
  arrowParens: 'always',

  // 객체, 배열 등의 마지막 항목에 쉼표 추가
  trailingComma: 'es5',

  // 객체 리터럴의 중괄호 앞뒤에 공백 추가
  bracketSpacing: true,

  // JSX의 마지막 `>` 를 다음 줄로 내리기
  bracketSameLine: false,

  // 개행 문자를 운영체제에 맞게 자동 설정 (ESLint prettier/prettier rule과 일치)
  endOfLine: 'auto',

  // JSX 내부 공백 추가 (ESLint react/jsx-curly-spacing rule과 일치)
  jsxSingleQuote: false,
}
