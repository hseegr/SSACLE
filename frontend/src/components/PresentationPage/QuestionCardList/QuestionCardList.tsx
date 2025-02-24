import { cn } from '@/lib/utils'
import QuestionCard from '@/components/PresentationPage/QuestionCard/QuestionCard'
import type { FC } from 'react'
import { QuestionCard as QuestionCardType } from '@/store/usePresentationStore'

interface QuestionCardListProps {
  questionCardData: { id: number; content: string }[]
  isSelectedQuestion: boolean
  selectedQuestion: QuestionCardType | null
  selectedQuestionList: number[] | null
  handleQuestionCardClick: (questionId: number) => void
}

const QuestionCardList: FC<QuestionCardListProps> = ({
  questionCardData,
  isSelectedQuestion,
  selectedQuestion,
  selectedQuestionList,
  handleQuestionCardClick,
}) => {
  return (
    <div
      className={cn(
        !isSelectedQuestion &&
          'flex items-center justify-around w-full flex-wrap h-full gap-3',
        'transition-all duration-300 ease-in-out overflow-auto'
      )}
    >
      {/* 질문카드 목록 */}
      {questionCardData.map((question) => (
        <QuestionCard
          key={question.id}
          isSelectedQuestion={isSelectedQuestion}
          selectedQuestion={selectedQuestion}
          selectedQuestionList={selectedQuestionList}
          handleQuestionCardClick={handleQuestionCardClick}
          question={question}
        />
      ))}
    </div>
  )
}
export default QuestionCardList
