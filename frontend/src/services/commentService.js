import httpCommon from './http-common'
import { COMMENT_END_POINT } from './endPoints'

// 게시글의 댓글 목록 조회 (GET)
export const fetchBoardComments = async (boardId) => {
  try {
    const response = await httpCommon.get(COMMENT_END_POINT.LIST(boardId))
    console.log('데이터 확인', response.data)
    return response.data
  } catch (error) {
    console.error('댓글 목록 조회 실패:', error)
    throw error
  }
}

// 게시글에 댓글 작성 (POST)
export const fetchCreateComment = async (boardId, content) => {
  try {
    const response = await httpCommon.post(COMMENT_END_POINT.CREATE(boardId), {
      content,
    })
    return response.data
  } catch (error) {
    console.error('댓글 작성 실패:', error)
    throw error
  }
}

export const fetchUpdateComment = async (commentId, content) => {
  const validCommentId = Number(commentId)
  console.log('PATCH 요청 - commentId:', validCommentId, 'content:', content) // 디버깅 추가

  if (!validCommentId || isNaN(validCommentId)) {
    console.error('❌ 유효하지 않은 commentId:', validCommentId)
    alert('올바른 댓글 ID가 아닙니다.')
    return
  }

  if (!content?.trim()) {
    console.error('❌ 댓글 내용이 비어 있음!')
    alert('댓글 내용을 입력하세요.')
    return
  }

  try {
    const response = await httpCommon.patch(
      COMMENT_END_POINT.UPDATE(validCommentId),
      { content }
    )
    return response.data
  } catch (error) {
    console.error('댓글 수정 실패:', error.response?.data || error)
    throw error
  }
}

// 댓글 삭제 (DELETE)
export const fetchDeleteComment = async (commentId) => {
  try {
    const response = await httpCommon.delete(
      COMMENT_END_POINT.DELETE(commentId)
    )
    return response.data
  } catch (error) {
    console.error('댓글 삭제 실패:', error)
    throw error
  }
}

// 대댓글 목록 조회 (GET)
export const fetchSubComments = async (parentCommentId) => {
  try {
    const response = await httpCommon.get(
      COMMENT_END_POINT.SUB_COMMENTS.LIST(parentCommentId)
    )
    return response.data
  } catch (error) {
    console.error('대댓글 목록 조회 실패:', error)
    throw error
  }
}

// 대댓글 생성 (POST)
export const fetchCreateSubComment = async (parentCommentId, content) => {
  try {
    const response = await httpCommon.post(
      COMMENT_END_POINT.SUB_COMMENTS.CREATE(parentCommentId),
      { content }
    )
    return response.data
  } catch (error) {
    console.error('대댓글 작성 실패:', error)
    throw error
  }
}
