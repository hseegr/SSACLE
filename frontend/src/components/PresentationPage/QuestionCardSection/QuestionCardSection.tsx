import { cn } from '@/lib/utils'
import { useRef } from 'react'
import QuestionCardList from '@/components/PresentationPage/QuestionCardList/QuestionCardList'
import { useShallow } from 'zustand/shallow'
import { usePresentationStore } from '@/store/usePresentationStore'
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

  const queryClient = useQueryClient()

  const questionCards = queryClient.getQueryData(['question-card-list'])

  // Todo : 여기서 fetch 해야함
  const initialQuestionCardData = [
    { id: 1, content: '질문내용1' },
    { id: 2, content: '질문내용2' },
    { id: 3, content: '질문내용3' },
    { id: 4, content: '질문내용4' },
    { id: 5, content: '질문내용5' },
  ]

  // Todo : 여기서 fetch 한 내용을 넣어줌
  const questionCardData = useRef<{ id: number; content: string }[]>(
    isSuccess && questionCards ? questionCards : initialQuestionCardData
  )

  // const { questionCardData } = usePresentation()

  // 질문카드 클릭 함수
  const handleQuestionCardClick = (questionId: number) => {
    const { id, content } = questionCardData.current.find(
      (question) => question.id === questionId
    )
    console.log('content', content)
    setSelectedQuestionList([...selectedQuestionList, { id, content }])
    setSelectedQuestion({
      id,
      content,
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
        questionCardData={questionCardData.current}
        isSelectedQuestion={isQuestionSelected}
        selectedQuestion={selectedQuestion}
        selectedQuestionList={selectedQuestionList}
        handleQuestionCardClick={handleQuestionCardClick}
      />
    </div>
  )
}
export default QuestionCardSection
