import { cn } from '@/lib/utils'
import { useRef } from 'react'
import QuestionCardList from '@/components/PresentationPage/QuestionCardList/QuestionCardList'
import { useShallow } from 'zustand/shallow'
import {
  QuestionCard,
  usePresentationStore,
} from '@/store/usePresentationStore'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const QuestionCardSection = () => {
  const {
    isQuestionSelected,
    selectedQuestion,
    selectedQuestionList,
    setSelectedQuestionList,
    setIsQuestionSelected,
    setSelectedQuestion,
  } = usePresentationStore(
    useShallow((state) => ({
      isQuestionSelected: state.isQuestionSelected,
      selectedQuestion: state.selectedQuestion,
      selectedQuestionList: state.selectedQuestionList,
      setIsQuestionSelected: state.setIsQuestionSelected,
      setSelectedQuestion: state.setSelectedQuestion,
      setSelectedQuestionList: state.setSelectedQuestionList,
    }))
  )

  // Todo : 여기서 fetch 해야함
  const initialQuestionCardData = [
    {
      id: 0,
      description: 'React에서 렌더링이 되는 시점은 언제인가요?',
      createdAt: '2025-02-18T09:42:59.160Z',
      teamId: 0,
      opened: true,
    },
    {
      id: 1,
      description: 'React Fiber Node 란 무엇인가요?',
      createdAt: '2025-02-18T09:42:59.160Z',
      teamId: 0,
      opened: true,
    },
    {
      id: 2,
      description: '브라우저 렌더링에 대해 설명해주세요.',
      createdAt: '2025-02-18T09:42:59.160Z',
      teamId: 0,
      opened: true,
    },
  ]

  const queryClient = useQueryClient()

  const questionCards: QuestionCard[] = queryClient.getQueryData([
    'question-card-list',
  ])?.length
    ? queryClient.getQueryData(['question-card-list'])
    : initialQuestionCardData

  // const { questionCardData } = usePresentation()

  // 질문카드 클릭 함수
  const handleQuestionCardClick = (questionId: number) => {
    const data = questionCards.find((question) => question.id === questionId)
    if (!data) return
    const { id, description, createdAt, teamId, opened } = data
    setSelectedQuestionList([
      ...(selectedQuestionList as QuestionCard[]),
      { id, description, createdAt, teamId, opened } as QuestionCard,
    ])

    setSelectedQuestion({
      id,
      description,
      createdAt,
      teamId,
      opened,
    })
    setIsQuestionSelected(true)
  }

  return (
    <div
      className={cn(
        'w-full transition-all duration-300 ease-in-out'
        // isOpen ? 'basis-2/12' : 'h-0 basis-0'
      )}
    >
      {/* 질문카드 목록 */}
      <QuestionCardList
        questionCardData={questionCards}
        isSelectedQuestion={isQuestionSelected}
        selectedQuestion={selectedQuestion}
        selectedQuestionList={selectedQuestionList}
        handleQuestionCardClick={handleQuestionCardClick}
      />
    </div>
  )
}
export default QuestionCardSection
