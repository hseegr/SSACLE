import httpCommon from './http-common'
import { COMMENT_END_POINT } from './endPoints'

// 게시글의 댓글 목록 조회 (GET)
export const fetchBoardComments = async (boardId) => {
  try {
    const response = await httpCommon.get(COMMENT_END_POINT.LIST(boardId))
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

// 댓글 수정 (PATCH)
export const fetchUpdateComment = async (commentId, content) => {
  try {
    const response = await httpCommon.patch(
      COMMENT_END_POINT.UPDATE(commentId),
      {
        content,
      }
    )
    return response.data
  } catch (error) {
    console.error('댓글 수정 실패:', error)
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
