// 회원 기능 -> authService
export const AUTH_END_POINT = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
}

// 유저 관련 -> userService
export const USER_END_POINT = {
  PROFILE: '/user/profile',
  UPDATE: '/user/update',
  DELETE: '/user/delete',
  PASSWORD: '/user/password',
}

// 부가 기능 (메인페이지) -> mainService
export const MAIN_END_POINT = {
  BANNER: '/main/banner',
  NOTICE: '/main/notice',
  FAQ: '/main/faq',
}

// 회상회의 (발표) -> presentationService
export const PRESENTATION_END_POINT = {
  // 질문 카드 관련
  QUESTION_CARDS: (sprintId) => `/sprints/${sprintId}/question-cards`,
  QUESTION_CARD: (sprintId, cardId) =>
    `/sprints/${sprintId}/question-cards/${cardId}`,

  // 회의장 관련
  ROOM: (sprintId) => `/sprints/${sprintId}/room`,
  CHATS: (sprintId) => `/sprints/${sprintId}/chats`,
  PARTICIPANTS: (sprintId) => `/sprints/${sprintId}/participants`,
  TEAMS: (sprintId) => `/sprints/${sprintId}/teams`,
}

// 싸프린트 -> sprintService
export const SPRINT_END_POINT = {
  SPRINTS: '/sprints',
  SPRINT: (sprintId) => `/sprints/${sprintId}`,
  JOIN: (sprintId) => `/sprints/${sprintId}/participants`,
  TODOS: (sprintId) => `/sprints/${sprintId}/todos`,
  TODO: (sprintId, todoId) => `/sprints/${sprintId}/todos/${todoId}`,
}

// 싸드컵 -> ssadcupService
export const SSADCUP_END_POINT = {
  SSADCUPS: '/ssadcups',
  SSADCUP: (ssadcupId) => `/ssadcups/${ssadcupId}`,
  ROUNDS: (ssadcupId) => `/ssadcups/${ssadcupId}/rounds`,
  PARTICIPANTS: (ssadcupId) => `/ssadcups/${ssadcupId}/participants`,
  TEAMS: (ssadcupId) => `/ssadcups/${ssadcupId}/teams`,
}

// 심판 관련 -> judgeService
export const JUDGE_END_POINT = {
  JUDGES: (ssadcupId) => `/ssadcups/${ssadcupId}/judges`,
  JUDGE: (ssadcupId, judgeId) => `/ssadcups/${ssadcupId}/judges/${judgeId}`,
}

// 관리자 -> adminService
export const ADMIN_END_POINT = {}

// 게시판 -> boardService
export const BOARD_END_POINT = {
  // 게시물 관련
  BOARDS: '/boards',
  BOARD: (boardId) => `/boards/${boardId}`,

  // 댓글 관련
  COMMENTS: (boardId) => `/boards/${boardId}/comments`,
  COMMENT: (boardId, commentId) => `/boards/${boardId}/comments/${commentId}`,

  // 대댓글(답글) 관련
  REPLIES: (boardId, commentId) =>
    `/boards/${boardId}/comments/${commentId}/replies`,
  REPLY: (boardId, commentId, replyId) =>
    `/boards/${boardId}/comments/${commentId}/replies/${replyId}`,

  // 검색
  SEARCH: '/boards/search',
}

// 노션 관련 -> notionService
export const NOTION_END_POINT = {
  PAGES: '/notion/pages',
  SYNC: '/notion/sync',
  CONTENT: '/notion/content',
}
