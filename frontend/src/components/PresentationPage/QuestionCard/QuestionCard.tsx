import type { FC } from 'react'
import { cn } from '@/lib/utils'
import { QuestionCard as QuestionCardType } from '@/store/usePresentationStore'

interface QuestionCardProps {
  isSelectedQuestion: boolean
  handleQuestionCardClick: (questionId: number) => void
  question: QuestionCardType
  selectedQuestionList: QuestionCardType[] | null
  selectedQuestion: QuestionCardType | null
}

const QuestionCard: FC<QuestionCardProps> = ({
  isSelectedQuestion,
  handleQuestionCardClick,
  selectedQuestion,
  question,
  selectedQuestionList,
}) => {
  const { id, description } = question

  const isSelected = selectedQuestionList?.some(
    (question) => question.id === id
  )

  return (
    <li
      onClick={() => handleQuestionCardClick(id)}
      className={cn(
        'flex items-center justify-center rounded-md',
        'h-full flex-col transition-all',
        isSelectedQuestion
          ? isSelected
            ? 'w-full'
            : 'hidden'
          : 'hover:bg-ssacle-blue/40 py-12 px-14 bg-ssacle-blue/20 cursor-pointer',
        `${
          isSelected //
            ? selectedQuestion
              ? ''
              : 'pointer-events-none bg-ssacle-gray'
            : ''
        }`
      )}
    >
      <div className="flex items-center justify-center w-full h-full">
        {isSelectedQuestion ? (
          // 질문 카드 선택 중인 경우
          <div className="flex flex-col items-center justify-center w-full h-full gap-2 text-lg animate-in ">
            <span className="transition-all duration-300 ease-in-out text-ssacle-blue/90">
              📝 선택한 질문의 내용 📝
            </span>
            <span>" {description} "</span>
          </div>
        ) : (
          <span className="text-ssacle-black/40 ">{id}</span>
        )}
      </div>
    </li>
  )
}
export default QuestionCard
