// 회원 기능 -> authService
export const AUTH_END_POINT = {
  // 이메일 관련 엔드포인트
  CHECK_EMAIL: (email) => `/join/check-email?email=${email}`, // 이메일 중복 확인

  // 비밀번호 & 닉네임 관련 엔드포인트
  CHECK_PASSWORD: '/join/check-password', // 비밀번호 확인
  CHECK_NICKNAME: '/join/check-nickname', // 닉네임 확인

  // 학번 중복 체크
  CHECK_STUDENT_NUMBER: '/join/check-studentNumber',

  // 관심사 체크 (변경 없음)
  CHECK_INTERESTS: (interests) =>
    `/auth/check-interest?${interests.map((i) => `interests=${i}`).join('&')}`,

  // 회원가입 & 로그인 기능
  SIGNUP: '/join', // 회원가입
  LOGIN: '/login', // 로그인
  LOGOUT: '/logout', // 로그아웃

  // 이메일 & 비밀번호 찾기 기능 추가
  FIND_EMAIL: '/login/find-email', // 이메일 찾기
  FIND_PASSWORD: '/login/find-password', // 비밀번호 찾기

  // 인증 코드 전송 (웹훅 URL 포함)
  SEND_VERIFICATION: '/join/send-verification', // 인증 코드 전송 (웹훅 URL 포함)
  CHECK_CODE: '/join/verify-ssafy', // 인증 코드 확인

  // 토큰 재발급
  REFRESH_TOKEN: '/refreshtoken', // 액세스 & 리프레시 토큰 재발급
}

// 유저 관련 -> userService
export const USER_END_POINT = {
  PROFILE: '/user/profile',
  UPDATE: '/user/update',
  DELETE: '/user/delete',
  PASSWORD: '/user/password',
}

// 메인페이지 -> mainService
export const MAIN_END_POINT = {
  // GET 요청 - 로그인한 사용자의 기본 정보 조회
  USER_INFO: `/user/summary`,

  // GET 요청 - 참여중인 싸프린트, 싸드컵 리스트 조회
  // NOW_MYSSAPRINT: '/mylist',
  NOW_MYSSAPRINT: '/user/sprint',

  // 싸프린트 관련 엔드포인트
  // POST 요청 - 관심사 기반 싸프린트 리스트 조회
  // SSAPRINT_LIST: '/ssaprint/interest',
  SSAPRINT_LIST: '/',

  // 싸드컵 관련 엔드포인트
  // POST 요청 - 관심사 기반 싸드컵 리스트 조회
  // SSADCUP_LIST: '/ssadcup/interest',
  SSADCUP_LIST: '/',

  // 싸밥 관련 엔드포인트
  // GET 요청 - 오늘의 싸밥(식단) 정보 조회
  LUNCH_INFO: '/lunch',

  // PATCH 요청 - 싸밥 투표 (투표자 전용)
  LUNCH_VOTE: '/vote',

  // GET 요청 - 싸밥 투표 결과 조회 (투표자 전용)
  LUNCH_VOTE_RESULT: '/vote/check-result',

  // AI 기사 관련
  // GET 요청 - 금일 AI 기사 전체 아티클 조회
  AI_NEWS: '/aiNews',
}

// 싸프린트 -> ssaprintService
export const SSAPRINT_END_POINT = {
  LIST: '/ssaprint', // 전체 싸프린트 목록 조회
  LIST_WITH_FILTER: (major, sub) => `/ssaprint?major=${major}&sub=${sub}`, // 조건별 싸프린트 조회
  DETAIL: (id) => `/ssaprint/${id}`, // 특정 싸프린트 상세 조회 (참가 이전/이후/완료 동일)

  CREATE: '/ssaprint', // 싸프린트 생성
  UPDATE: (id) => `/ssaprint/${id}`, // 싸프린트 수정
  DELETE: (id) => `/ssaprint/${id}`, // 싸프린트 삭제

  JOIN: (id) => `/ssaprint/${id}/join`, // 싸프린트 참가
  CANCEL: (id) => `/ssaprint/${id}/cancel`, // 싸프린트 참가 취소

  PRESENTATION_PARTICIPANTS: (id) =>
    `/ssaprint/${id}/presentation/participants`, // 발표 참가자 목록 조회
  PRESENTATION_CARDS: (id) => `/ssaprint/${id}/presentation/cards`, // 발표 질문 카드 목록 조회
  PRESENTATION_CARD_DETAIL: (id, cardId) =>
    `/ssaprint/${id}/presentation/cards/${cardId}`, // 특정 질문 카드 상세 조회
  PRESENTATION_EXIT: (id) => `/ssaprint/${id}/presentation/exit`, // 발표 종료

  TODO_STATUS: (ssaprintId, todoId) => `/ssaprint/${ssaprintId}/todo/${todoId}`, // TODO 상태 수정
}

// 싸드컵 -> ssadcupService
export const SSADCUP_END_POINT = {
  TOURNAMENTS: '/ssadcup/tournaments',
  MATCHES: '/ssadcup/matches',
  TEAMS: '/ssadcup/teams',
  PLAYERS: '/ssadcup/players',
}

// 관리자 -> adminService
export const ADMIN_END_POINT = {
  USERS: '/admin/users',
  REPORTS: '/admin/reports',
  SETTINGS: '/admin/settings',
  STATS: '/admin/statistics',
}

// 게시판 -> boardService
export const BOARD_END_POINT = {
  LIST: '/board', // 게시글 목록 조회
  DETAIL: (boardId) => `/board/${boardId}`, // 게시글 상세 조회
  COUNT: '/board/count', // 게시글 수 카운트
  CREATE: '/board/create', // 게시글 생성
  DELETE: (boardId) => `/board/${boardId}`, // 게시글 삭제
  UPDATE: (boardId) => `/board/${boardId}`, // 게시글 수정
  // SEARCH: '/board/search',
}

// 댓글 -> commentService
export const COMMENT_END_POINT = {
  // 게시글 댓글 관련
  LIST: (boardId) => `/comment/board/${boardId}`, // 게시글의 댓글 목록 조회
  CREATE: (boardId) => `/comment/board/${boardId}`, // 댓글 작성
  UPDATE: (commentId) => `/comments/${commentId}`, // 댓글 수정
  DELETE: (commentId) => `/comments/${commentId}`, // 댓글 삭제

  // 대댓글 관련
  SUB_COMMENTS: {
    LIST: (parentCommentId) => `/comment/reply/comments/${parentCommentId}`, // 대댓글 목록 조회
    CREATE: (parentCommentId) => `/comment/reply/comments/${parentCommentId}`, // 대댓글 작성
  },
}

// 노션 관련 -> notionService
export const NOTION_END_POINT = {
  PAGES: '/notion/pages',
  SYNC: '/notion/sync',
  CONTENT: '/notion/content',
}

// 아래는 예시
