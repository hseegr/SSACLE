import { useState } from 'react'

const CommentForm = ({
  onSubmit,
  isEditing = false,
  initialValue = '',
  onCancel,
}) => {
  // 댓글 내용을 관리하는 state
  // 수정 모드일 경우 initialValue로 초기화됨
  const [content, setContent] = useState(initialValue)

  // 제출 중 여부를 관리하는 state
  // 중복 제출 방지를 위해 사용
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault()

    // 빈 내용이나 공백만 있는 경우 제출 방지
    if (!content.trim()) {
      return
    }

    try {
      // 제출 시작
      setIsSubmitting(true)

      // 부모 컴포넌트의 제출 함수 호출
      await onSubmit(content)

      // 새 댓글 작성 시에만 입력창 초기화
      if (!isEditing) {
        setContent('')
      }
    } catch (error) {
      console.error('댓글 제출 중 오류 발생:', error)
      alert('댓글 작성에 실패했습니다. 다시 시도해주세요.')
    } finally {
      // 제출 완료
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {/* 텍스트 입력 영역 */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
        className={`
          w-full p-3 
          border rounded-lg 
          focus:ring-2 focus:ring-blue-500 focus:border-transparent 
          resize-none
          bg-white 
          disabled:bg-gray-100
          transition-colors
          ${isSubmitting ? 'cursor-not-allowed' : ''}
        `}
        rows="3"
        placeholder={
          isEditing ? '댓글을 수정하세요...' : '댓글을 입력하세요...'
        }
        aria-label={isEditing ? '댓글 수정' : '댓글 작성'}
      />

      {/* 버튼 영역 */}
      <div className="mt-2 flex justify-end gap-2">
        {/* 수정 모드일 때만 취소 버튼 표시 */}
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className={`
              px-4 py-2 
              text-sm text-gray-600 
              hover:text-gray-800 
              disabled:text-gray-400
              transition-colors
            `}
          >
            취소
          </button>
        )}

        {/* 등록/수정 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className={`
            px-4 py-2 
            bg-blue-500 text-white 
            rounded-lg 
            hover:bg-blue-600 
            disabled:bg-gray-300 
            disabled:cursor-not-allowed 
            text-sm
            transition-all
          `}
        >
          {isSubmitting ? '처리중...' : isEditing ? '수정' : '등록'}
        </button>
      </div>
    </form>
  )
}

export default CommentForm
