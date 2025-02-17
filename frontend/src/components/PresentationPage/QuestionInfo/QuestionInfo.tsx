import { usePresentationModalStateStore } from '@/store/usePresentationModalStateStore'
import { usePresentationStore } from '@/store/usePresentationStore'
import type { FC } from 'react'
import { useShallow } from 'zustand/shallow'

interface QuestionInfoProps {}

const QuestionInfo: FC<QuestionInfoProps> = ({}) => {
  const { selectedQuestion, isQuestionSelected } = usePresentationStore(
    useShallow((state) => ({
      selectedQuestion: state.selectedQuestion,
      isQuestionSelected: state.isQuestionSelected,
    }))
  )

  const { content } = selectedQuestion ?? {}

  if (!isQuestionSelected || !selectedQuestion) return null

  return (
    <div className="flex justify-between w-11/12 px-4 py-2 mx-auto text-center bg-black/20">
      <div aria-label="화이트 박스"></div>
      <div>
        <span className="mr-2 text-lg">Q.</span>
        <span className="text-lg">{content}</span>
      </div>
      <div className="flex items-center justify-center gap-3">
        <span>답변자</span>
        <span className="text-xl">000</span>
      </div>
    </div>
  )
}
export default QuestionInfo
