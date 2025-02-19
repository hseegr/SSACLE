import type { FC } from 'react'
import SsaprintVoteSelector from '@/components/PresentationPage/SsaprintVoteContainer/SsaprintVoteSelector'

interface SsaprintVoteQuestionProps {
  questionRank: {
    first: string
    second: string
    third: string
  }
  setQuestionRank: (questionRank: {
    first: string
    second: string
    third: string
  }) => void
  userList: {
    username: string
    userId: string
    connectionId: string
  }[]
}

const SsaprintVoteQuestion: FC<SsaprintVoteQuestionProps> = ({
  questionRank,
  setQuestionRank,
  userList,
}) => {
  return (
    <div className="flex flex-col gap-4 animate-fade-in ">
      <h2 className="text-xl font-bold">질문 답변 평가</h2>
      <p>질문 답변 평가를 1, 2, 3등으로 선택해주세요.</p>
      <div className="flex flex-col gap-4">
        {[
          { label: '🥇 1등', step: 'first' },
          { label: '🥈 2등', step: 'second' },
          { label: '🥉 3등', step: 'third' },
        ].map(({ label, step }) => (
          <div className="flex items-center justify-center gap-4">
            <label>{label}</label>
            <SsaprintVoteSelector
              rank={questionRank[step as keyof typeof questionRank]}
              setRank={(rank) =>
                setQuestionRank({ ...questionRank, [step]: rank })
              }
              userList={userList}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
export default SsaprintVoteQuestion
