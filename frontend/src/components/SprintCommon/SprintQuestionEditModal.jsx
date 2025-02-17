// @ts-nocheck
import { useState, useEffect } from 'react'
import {
  addSsaprintQuestion,
  updateSsaprintQuestion,
} from '@/services/ssaprintService'

const SprintQuestionEditModal = ({
  sprintId,
  teamId,
  existingQuestion = null,
  onClose,
  onQuestionAdded,
  onQuestionUpdated,
}) => {
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (existingQuestion) {
      setDescription(existingQuestion.description)
    } else {
      setDescription('')
    }
  }, [existingQuestion])

  const handleSubmit = async () => {
    if (!description.trim()) {
      alert('질문 내용을 입력해주세요.')
      return
    }

    try {
      if (existingQuestion) {
        // 질문 수정
        await updateSsaprintQuestion(existingQuestion.id, {
          sprintId: existingQuestion.sprintId,
          teamId: existingQuestion.teamId,
          description,
          opened: existingQuestion.opened,
        })
        alert('질문이 수정되었습니다.')
        await onQuestionUpdated?.()
      } else {
        // 질문 추가
        await addSsaprintQuestion(sprintId, teamId, description)
        alert('질문이 등록되었습니다.')
        await onQuestionAdded?.()
      }

      // 입력창 초기화 후 모달 닫기
      setDescription('')
      onClose()
    } catch (error) {
      alert('질문 처리에 실패했습니다.')
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-bold mb-4">
          {existingQuestion ? '질문 수정' : '질문 추가'}
        </h3>
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
            onClick={handleSubmit}
          >
            {existingQuestion ? '수정' : '등록'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SprintQuestionEditModal
