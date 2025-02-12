// @ts-nocheck
import { useState, useEffect, useCallback } from 'react'
import AddQuestionButton from '@/components/SprintCommon/AddQuestionButton'
import SprintQuestionEditModal from '@/components/SprintCommon/SprintQuestionEditModal'
import { fetchSsaprintQuestions } from '@/services/ssaprintService'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SprintQuestionCards = ({ sprintId }) => {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const cardsPerPage = 4

  // 질문 목록 가져오기
  const loadQuestions = useCallback(async () => {
    try {
      const fetchedQuestions = await fetchSsaprintQuestions(sprintId)
      setQuestions(fetchedQuestions)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('질문 목록 불러오기 실패:', error)
    }
  }, [sprintId])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  // 항상 4개의 카드가 보이도록 빈 카드 추가
  const paddedQuestions =
    questions.length >= cardsPerPage
      ? questions
      : [...questions, ...Array(cardsPerPage - questions.length).fill(null)]

  // 페이지별 4개씩 보여주기 위해 그룹화
  const paginatedQuestions = []
  for (let i = 0; i < paddedQuestions.length; i += cardsPerPage) {
    const page = paddedQuestions.slice(i, i + cardsPerPage)
    while (page.length < cardsPerPage) {
      page.push(null)
    }
    paginatedQuestions.push(page)
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

  return (
    <div className="mt-1 w-full flex flex-col items-start">
      <div className="flex items-center w-full ml-1 mb-3 gap-4">
        <h3 className="text-lg font-bold">질문 카드 📝</h3>
        <AddQuestionButton onClick={() => setIsModalOpen(true)} />
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
              className={`w-56 h-48 flex items-center justify-center rounded-lg shadow-lg transition-all 
                ${q ? 'bg-blue-100' : 'bg-gray-100'}`}
            >
              {q ? (
                <p className="text-sm text-center px-6 break-words">
                  {q.description}
                </p>
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

      {/* 질문 추가 모달 */}
      {isModalOpen && (
        <SprintQuestionEditModal
          sprintId={sprintId}
          onClose={() => setIsModalOpen(false)}
          onQuestionAdded={loadQuestions} // 질문 추가 후 목록 갱신
        />
      )}
    </div>
  )
}

export default SprintQuestionCards
