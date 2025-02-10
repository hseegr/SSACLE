import httpCommon from './http-common'
import { COMMENT_END_POINT } from './endPoints'

// 게시글의 댓글 목록 조회 (GET)
export const fetchBoardComments = async (boardId) => {
  return httpCommon.get(COMMENT_END_POINT.LIST(boardId))
}

// 게시글에 댓글 작성 (POST)
export const fetchCreateComment = async (boardId, content) => {
  return httpCommon.post(COMMENT_END_POINT.CREATE(boardId), {
    content,
  })
}

// 댓글 수정 (PATCH)
export const fetchUpdateComment = async (commentId, content) => {
  return httpCommon.patch(COMMENT_END_POINT.UPDATE(commentId), {
    content,
  })
}

// 댓글 삭제 (DELETE)
export const fetchDeleteComment = async (commentId) => {
  return httpCommon.delete(COMMENT_END_POINT.DELETE(commentId))
}

// 대댓글 목록 조회 (GET)
export const fetchSubComments = async (parentCommentId) => {
  return httpCommon.get(COMMENT_END_POINT.SUB_COMMENTS.LIST(parentCommentId))
}

// 대댓글 생성 (POST)
export const fetchCreateSubComment = async (parentCommentId, content) => {
  return httpCommon.post(
    COMMENT_END_POINT.SUB_COMMENTS.CREATE(parentCommentId),
    { content }
  )
}
