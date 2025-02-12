import { useState } from 'react'
import { addSsaprintQuestion } from '@/services/ssaprintService'

const SprintQuestionEditModal = ({ sprintId, onClose, onQuestionAdded }) => {
  const [description, setDescription] = useState('')

  const handleAddQuestion = async () => {
    if (!description.trim()) {
      alert('질문 내용을 입력해주세요.')
      return
    }

    try {
      await addSsaprintQuestion(sprintId, description) // 질문 추가 API 호출
      alert('질문이 등록되었습니다.') // 등록 완료 알림
      setDescription('') // 입력 필드 초기화
      onQuestionAdded() // 질문 목록 업데이트 요청
      onClose() // 모달 닫기
    } catch (error) {
      alert('질문 등록에 실패했습니다.')
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-bold mb-4">질문 추가</h3>
        <textarea
          className="w-full p-2 border rounded-md resize-none"
          rows="4"
          placeholder="질문을 입력하세요..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <div className="flex justify-end mt-4 gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded-md"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleAddQuestion}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  )
}

export default SprintQuestionEditModal
