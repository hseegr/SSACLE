// @ts-nocheck
import { deleteSsaprintQuestion } from '@/services/ssaprintService'

const SprintQuestionDeleteModal = ({
  question,
  onClose,
  onQuestionDeleted,
}) => {
  const handleDelete = async () => {
    try {
      await deleteSsaprintQuestion(question.id)
      alert('질문이 삭제되었습니다.')
      onQuestionDeleted()
      onClose()
    } catch (error) {
      alert('질문 삭제에 실패했습니다.')
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h3 className="text-lg font-bold mb-2">질문을 삭제하시겠습니까?</h3>
        <p className="text-sm text-gray-600 mb-4">
          삭제한 질문은 되돌릴 수 없습니다.
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md"
            onClick={handleDelete}
          >
            삭제
          </button>
          <button
            className="px-4 py-2 bg-gray-300 rounded-md"
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  )
}

export default SprintQuestionDeleteModal
