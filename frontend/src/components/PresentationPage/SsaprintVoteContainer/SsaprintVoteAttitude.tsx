import { useState, type FC } from 'react'
import SsaprintVoteSelector from '@/components/PresentationPage/SsaprintVoteContainer/SsaprintVoteSelector'

interface SsaprintVoteAttitudeProps {
  attitudeRank: {
    first: string
    second: string
    third: string
  }
  setAttitudeRank: (attitudeRank: {
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

const SsaprintVoteAttitude: FC<SsaprintVoteAttitudeProps> = ({
  attitudeRank,
  setAttitudeRank,
  userList,
}) => {
  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <h2 className="text-xl font-bold">전체적인 태도 평가</h2>
      <p>전체적인 태도를 1, 2, 3등으로 선택해주세요.</p>
      <div className="flex flex-col gap-4">
        {[
          { label: '🥇 1등', step: 'first' },
          { label: '🥈 2등', step: 'second' },
          { label: '🥉 3등', step: 'third' },
        ].map(({ label, step }) => (
          <div className="flex items-center justify-center gap-4">
            <label>{label}</label>
            <SsaprintVoteSelector
              rank={attitudeRank[step as keyof typeof attitudeRank]}
              setRank={(rank) =>
                setAttitudeRank({ ...attitudeRank, [step]: rank })
              }
              userList={userList}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
export default SsaprintVoteAttitude
