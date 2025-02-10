import httpCommon from './http-common'
import { BOARD_END_POINT } from './endPoints'

// 게시글 목록 조회 (GET)
// export const fetchBoardList = async () => {
//   return httpCommon.get(BOARD_END_POINT.LIST)
// }

// 디버깅용
// 게시글 목록 조회 (GET)
export const fetchBoardList = async () => {
  try {
    console.log('API 호출 시작')
    const response = await httpCommon.get(BOARD_END_POINT.LIST)
    console.log('API 응답 데이터:', response.data)
    return response.data
  } catch (error) {
    console.error('API 호출 에러:', error)
    throw error
  }
}

// 게시글 상세 조회 (GET)
export const fetchBoardDetail = async (boardId) => {
  return httpCommon.get(BOARD_END_POINT.DETAIL(boardId))
}

// 게시글 수 조회 (GET)
export const fetchBoardCount = async () => {
  return httpCommon.get(BOARD_END_POINT.COUNT)
}

// 게시글 생성 (POST)
export const fetchCreateBoard = async (boardData) => {
  return httpCommon.post(BOARD_END_POINT.CREATE, boardData)
}

// 게시글 삭제 (DELETE)
export const fetchDeleteBoard = async (boardId) => {
  return httpCommon.delete(BOARD_END_POINT.DELETE(boardId))
}

// 게시글 수정 (PATCH)
export const fetchUpdateBoard = async (boardId, boardData) => {
  return httpCommon.patch(BOARD_END_POINT.UPDATE(boardId), boardData)
}
