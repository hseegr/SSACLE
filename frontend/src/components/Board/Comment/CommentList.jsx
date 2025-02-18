import { useState } from 'react'
import CommentForm from './CommentForm'

const CommentList = ({
  comments = [],
  currentUserId,
  onDelete,
  onEdit,
  onReply,
}) => {
  const [editingId, setEditingId] = useState(null)
  const [activeMenuId, setActiveMenuId] = useState(null)
  const [replyingTo, setReplyingTo] = useState(null)

  const handleReplyClick = (commentId) => {
    setReplyingTo(replyingTo === commentId ? null : commentId)
    setActiveMenuId(null)
    setEditingId(null)
  }

  const handleEditClick = (commentId) => {
    setEditingId(commentId)
    setActiveMenuId(null)
    setReplyingTo(null)
  }

  const handleEditCancel = () => {
    setEditingId(null)
  }

  const handleReplyCancel = () => {
    setReplyingTo(null)
  }

  const handleEditSubmit = async (commentId, newContent) => {
    try {
      await onEdit(commentId, newContent)
      setEditingId(null)
    } catch (error) {
      console.error('댓글 수정 중 오류 발생:', error)
      alert('댓글 수정에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleReplySubmit = async (parentId, content) => {
    try {
      await onReply(parentId, content)
      setReplyingTo(null)
    } catch (error) {
      console.error('답글 작성 중 오류 발생:', error)
      alert('답글 작성에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleDeleteClick = async (commentId) => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        await onDelete(commentId)
        setActiveMenuId(null)
      } catch (error) {
        console.error('댓글 삭제 중 오류 발생:', error)
        alert('댓글 삭제에 실패했습니다. 다시 시도해주세요.')
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const renderComment = (comment, depth = 0) => {
    return (
      <div
        key={comment.time} // time을 key로 사용 (고유한 값)
        className={`border-b pb-4 last:border-b-0 ${
          depth > 0 ? 'ml-8 mt-4 pl-4 border-l-2 border-gray-100' : ''
        }`}
      >
        {editingId === comment.time ? (
          <CommentForm
            isEditing
            initialValue={comment.content}
            onSubmit={(content) => handleEditSubmit(comment.time, content)}
            onCancel={handleEditCancel}
          />
        ) : (
          <div>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{comment.writerInfo}</span>
                <span className="text-gray-500 text-sm">
                  {formatDate(comment.time)}
                </span>
              </div>

              {currentUserId === comment.writerInfo && (
                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveMenuId(
                        activeMenuId === comment.time ? null : comment.time
                      )
                    }
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="댓글 메뉴"
                  >
                    <svg
                      className="w-5 h-5 text-gray-500"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <circle cx="5" cy="12" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="19" cy="12" r="2" />
                    </svg>
                  </button>

                  {activeMenuId === comment.time && (
                    <div className="absolute right-0 mt-1 w-24 bg-white border rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => handleEditClick(comment.time)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteClick(comment.time)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <p className="text-gray-800 whitespace-pre-wrap mb-2">
              {comment.content}
            </p>

            {depth === 0 && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleReplyClick(comment.time)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  답글달기
                </button>
              </div>
            )}

            {replyingTo === comment.time && (
              <div className="mt-4">
                <CommentForm
                  onSubmit={(content) =>
                    handleReplySubmit(comment.time, content)
                  }
                  onCancel={handleReplyCancel}
                  placeholder="답글을 입력하세요..."
                />
              </div>
            )}

            {comment.child?.length > 0 && (
              <div className="mt-4 space-y-4">
                {comment.child.map((reply) => renderComment(reply, 1))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const totalComments = comments.reduce(
    (acc, comment) => acc + 1 + (comment.child?.length || 0),
    0
  )

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">댓글 {totalComments}개</h3>
      <div className="space-y-6">
        {comments.map((comment) => renderComment(comment))}
      </div>
    </div>
  )
}

export default CommentList
