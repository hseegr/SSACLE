// @ts-nocheck
import { useState, useEffect, useCallback } from 'react'
import AddQuestionButton from '@/components/SprintCommon/AddQuestionButton'
import SprintQuestionEditModal from '@/components/SprintCommon/SprintQuestionEditModal'
import SprintQuestionDeleteModal from '@/components/SprintCommon/SprintQuestionDeleteModal'
import { fetchSsaprintQuestions } from '@/services/ssaprintService'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SprintQuestionCards = ({ sprintId, teamId }) => {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState(null)

  const cardsPerPage = 4

  // 질문 목록 가져오기
  const loadQuestions = useCallback(async () => {
    try {
      const fetchedQuestions = await fetchSsaprintQuestions(sprintId)
      setQuestions(fetchedQuestions)
    } catch (error) {
      console.error('질문 목록 불러오기 실패:', error)
    }
  }, [sprintId])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  // 항상 4개 단위로 카드 유지
  // 질문이 없을 때도 4개의 빈 카드 유지
  const paddedQuestions =
    questions.length > 0 ? [...questions] : Array(cardsPerPage).fill(null)

  while (paddedQuestions.length % cardsPerPage !== 0) {
    paddedQuestions.push(null)
  }

  // 페이지별 4개씩 그룹화
  const paginatedQuestions = []
  for (let i = 0; i < paddedQuestions.length; i += cardsPerPage) {
    paginatedQuestions.push(paddedQuestions.slice(i, i + cardsPerPage))
  }

  // 다음 페이지로 이동
  const handleNext = () => {
    if (currentIndex < paginatedQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  // 이전 페이지로 이동
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  // 질문 추가 버튼 클릭 시 입력창 초기화 & 등록 제한
  const handleAddQuestion = () => {
    // 현재 팀의 질문 개수 확인
    const teamQuestionsCount = questions.filter(
      (q) => q?.teamId === teamId
    ).length

    if (teamQuestionsCount >= 2) {
      alert(
        '질문은 최대 2개까지만 등록 가능합니다. 기존 질문을 수정하거나 삭제 후 등록해주세요.'
      )
      return // 등록 불가
    }

    setSelectedQuestion(null)
    setTimeout(() => setIsEditModalOpen(true), 0) // 다음 이벤트 루프에서 실행
  }

  // 질문 수정 버튼 클릭
  const handleEdit = (question) => {
    setSelectedQuestion(question)
    setIsEditModalOpen(true)
  }

  // 질문 삭제 버튼 클릭
  const handleDelete = (question) => {
    setSelectedQuestion(question)
    setIsDeleteModalOpen(true)
  }

  // 질문 삭제 후 자동으로 이전 페이지로 이동
  const handleQuestionDeleted = async () => {
    await loadQuestions()

    // 현재 페이지가 마지막 페이지이고, 삭제 후 질문이 줄어든 경우 이전 페이지로 이동
    const totalPages = Math.ceil((questions.length - 1) / cardsPerPage)
    if (currentIndex >= totalPages) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0))
    }
  }

  return (
    <div className="mt-1 w-full flex flex-col items-start">
      <div className="flex items-center w-full ml-1 mb-3 gap-4">
        <h3 className="text-lg font-bold">질문 카드 📝</h3>
        <AddQuestionButton onClick={handleAddQuestion} />
      </div>

      <div className="flex items-center w-full">
        {/* 왼쪽 이동 버튼 */}
        <button
          onClick={handlePrev}
          className={`p-2 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 shadow-md 
            ${currentIndex === 0 ? 'opacity-50 cursor-default' : 'hover:bg-gray-200'}`}
          disabled={currentIndex === 0}
        >
          <ChevronLeft size={24} className="text-gray-600" />
        </button>

        {/* 질문 카드 리스트 */}
        <div className="flex gap-6 overflow-hidden w-full px-6 justify-center">
          {paginatedQuestions[currentIndex]?.map((q, index) => (
            <div
              key={index}
              className={`relative w-56 h-48 flex flex-col justify-between items-center rounded-lg shadow-lg transition-all p-4
                ${q ? 'bg-blue-100' : 'bg-gray-100'}`}
            >
              {q ? (
                <>
                  {/* 내 질문 표시 */}
                  {q.teamId === teamId && (
                    <div className="absolute top-4 left-3">
                      <span className="px-2 py-1 text-xs text-blue-600 font-bold border border-blue-400 rounded-md">
                        내 질문
                      </span>
                    </div>
                  )}

                  {/* 질문 내용 */}
                  <div className="flex-1 flex mt-5 items-center justify-center">
                    <p className="text-sm text-center break-words">
                      {q.description}
                    </p>
                  </div>

                  {/* 수정 / 삭제 버튼 */}
                  {q.teamId === teamId && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(q)}
                        className="px-3 py-1 bg-yellow-400 text-white text-xs rounded-md hover:bg-yellow-500 transition"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(q)}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500"></p>
              )}
            </div>
          ))}
        </div>

        {/* 오른쪽 이동 버튼 */}
        <button
          onClick={handleNext}
          className={`p-2 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 shadow-md 
            ${currentIndex >= paginatedQuestions.length - 1 ? 'opacity-50 cursor-default' : 'hover:bg-gray-200'}`}
          disabled={currentIndex >= paginatedQuestions.length - 1}
        >
          <ChevronRight size={24} className="text-gray-600" />
        </button>
      </div>

      {/* 수정 모달 */}
      {isEditModalOpen && (
        <SprintQuestionEditModal
          sprintId={sprintId}
          teamId={teamId}
          existingQuestion={selectedQuestion}
          onClose={() => setIsEditModalOpen(false)}
          onQuestionAdded={loadQuestions} // 질문 추가 후 즉시 목록 반영
          onQuestionUpdated={loadQuestions} // 질문 수정 후 즉시 목록 반영
        />
      )}

      {/* 삭제 모달 */}
      {isDeleteModalOpen && (
        <SprintQuestionDeleteModal
          question={selectedQuestion}
          onClose={() => setIsDeleteModalOpen(false)}
          onQuestionDeleted={handleQuestionDeleted}
        />
      )}
    </div>
  )
}

export default SprintQuestionCards
