import React, { FC, useState } from 'react'
import SsaprintVotePresenter from '@/components/PresentationPage/SsaprintVoteContainer/SsaprintVotePresenter'
import SsaprintVoteQuestion from '@/components/PresentationPage/SsaprintVoteContainer/SsaprintVoteQuestion'
import SsaprintVoteAttitude from '@/components/PresentationPage/SsaprintVoteContainer/SsaprintVoteAttitude'
import { Button } from '@/components/ui/button'
import { usePresentationModalActions } from '@/store/usePresentationModalActions'
import { useShallow } from 'zustand/react/shallow'
import { PRESENTATION_STATUS } from '@/constants/presentationStatus'

interface SsaprintVoteContainerProps {
  sendStatusSignal: (data: string) => void
  closeModal: () => void
}

const SsaprintVoteContainer: FC<SsaprintVoteContainerProps> = ({
  sendStatusSignal,
  closeModal,
}) => {
  // 현재 단계 상태 (0: 발표자 평가, 1: 질문 답변 평가, 2: 전체적인 태도 평가)
  const [step, setStep] = useState(0)

  // 1단계: 발표자 평가 상태 (1~5 중 선택)
  const [presenterRating, setPresenterRating] = useState<number>(0)

  // 2단계: 질문 답변 평가 상태 (1, 2, 3등 선택)
  const [questionRank, setQuestionRank] = useState({
    first: '',
    second: '',
    third: '',
  })

  // 3단계: 전체적인 태도 평가 상태 (1, 2, 3등 선택)
  const [attitudeRank, setAttitudeRank] = useState({
    first: '',
    second: '',
    third: '',
  })

  // 예시로 사용할 사용자 명단
  const userList = ['User A', 'User B', 'User C', 'User D', 'User E']

  // 단계별로 렌더링할 내용 정의
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <SsaprintVotePresenter
            presenterRating={presenterRating}
            setPresenterRating={setPresenterRating}
          />
        )
      case 1:
        return (
          <SsaprintVoteQuestion
            questionRank={questionRank}
            setQuestionRank={setQuestionRank}
            userList={userList}
          />
        )
      case 2:
        return (
          <SsaprintVoteAttitude
            attitudeRank={attitudeRank}
            setAttitudeRank={setAttitudeRank}
            userList={userList}
          />
        )
      default:
        return null
    }
  }

  // 단계 이동 및 제출 핸들러
  const handleNext = () => setStep(Math.min(step + 1, 2))
  const handlePrev = () => setStep(Math.max(step - 1, 0))
  const handleSubmit = async () => {
    // 실제 데이터 처리 로직 구현 가능 (예: API 호출 등)
    console.log('발표자 평가:', presenterRating)
    console.log('질문 답변 평가:', questionRank)
    console.log('전체적인 태도 평가:', attitudeRank)
    alert('평가가 제출되었습니다!')

    sendStatusSignal(PRESENTATION_STATUS.VOTE_END)
    closeModal()
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5">
      {renderStep()}
      <div className="flex flex-row justify-center w-full gap-4">
        {step > 0 && (
          <Button
            className="w-1/4 bg-ssacle-blue/50 hover:bg-ssacle-blue/80"
            onClick={handlePrev}
          >
            이전
          </Button>
        )}
        {step < 2 && (
          <Button
            className="w-1/4 bg-ssacle-blue hover:bg-ssacle-blue/80"
            onClick={handleNext}
          >
            다음
          </Button>
        )}
        {step === 2 && (
          <Button
            className="w-1/4 bg-purple-500 hover:bg-purple-500/80"
            onClick={handleSubmit}
          >
            제출
          </Button>
        )}
      </div>
    </div>
  )
}

export default SsaprintVoteContainer
