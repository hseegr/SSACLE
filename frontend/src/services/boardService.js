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
    const response = await httpCommon.get(BOARD_END_POINT.LIST)
    return response.data
  } catch (error) {
    console.error('API 호출 에러:', error)
    throw error
  }
}

// 게시글 상세 조회 (GET)
export const fetchBoardDetail = async (boardId) => {
  try {
    const response = await httpCommon.get(BOARD_END_POINT.DETAIL(boardId))
    return response.data
  } catch (error) {
    console.error('게시글 상세 조회 실패:', error)
    throw error
  }
}

// 게시글 수 조회 (GET)
export const fetchBoardCount = async () => {
  return httpCommon.get(BOARD_END_POINT.COUNT)
}

// 게시글 생성 (POST)
export const fetchCreateBoard = async (boardData) => {
  try {
    const response = await httpCommon.post(BOARD_END_POINT.CREATE, boardData)
    return response.data
  } catch (error) {
    console.error('게시글 생성 실패:', error)
    throw error
  }
}

// 게시글 삭제 (DELETE)
export const fetchDeleteBoard = async (boardId) => {
  try {
    const response = await httpCommon.delete(BOARD_END_POINT.DELETE(boardId))
    return response.data
  } catch (error) {
    console.error('게시글 삭제 실패:', error)
    throw error
  }
}

// 게시글 수정 (PATCH)
export const fetchUpdateBoard = async (boardId, boardData) => {
  try {
    const response = await httpCommon.patch(
      BOARD_END_POINT.UPDATE(boardId),
      boardData
    )
    return response.data
  } catch (error) {
    console.error('게시글 수정 실패:', error)
    throw error
  }
}

// 명예의 전당 게시글 구매
export const fetchPurchaseBoard = async (boardId) => {
  try {
    const response = await httpCommon.post(`/board/${boardId}/purchase`)
    return response.data
  } catch (error) {
    console.error('게시글 구매 실패', error)
    throw error
  }
}
