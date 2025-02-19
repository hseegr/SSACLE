import React, { FC, useState } from 'react'
import SsaprintVotePresenter from '@/components/PresentationPage/SsaprintVoteContainer/SsaprintVotePresenter'
import SsaprintVoteQuestion from '@/components/PresentationPage/SsaprintVoteContainer/SsaprintVoteQuestion'
import SsaprintVoteAttitude from '@/components/PresentationPage/SsaprintVoteContainer/SsaprintVoteAttitude'
import { Button } from '@/components/ui/button'
import { usePresentationModalActions } from '@/store/usePresentationModalActions'
import { useShallow } from 'zustand/react/shallow'
import { PRESENTATION_STATUS } from '@/constants/presentationStatus'
import { useQueryClient } from '@tanstack/react-query'
import useRoomStateStore from '@/store/useRoomStateStore'
import { useParams } from 'react-router-dom'
import { fetchCalculateFinalScore } from '@/services/presentationService'
import { Session } from 'openvidu-browser'

interface SsaprintVoteContainerProps {
  session: Session
  sendStatusSignal: (data: string) => void
  closeModal: () => void
}

const SsaprintVoteContainer: FC<SsaprintVoteContainerProps> = ({
  session,
  sendStatusSignal,
  closeModal,
}) => {
  // 현재 단계 상태 (0: 발표자 평가, 1: 질문 답변 평가, 2: 전체적인 태도 평가)
  const [step, setStep] = useState(0)
  const { roomId } = useParams()

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

  console.log('attitudeRank', attitudeRank)

  // const { roomConnectionData } = useRoomStateStore(
  //   (state) => state.roomConnectionData
  // )

  // console.log('roomConnectionData', roomConnectionData)
  // 예시로 사용할 사용자 명단
  // const userList =
  //   (roomId && roomConnectionData[roomId as keyof typeof roomConnectionData]) ??
  //   []

  const userList = [
    {
      username: '홍길동',
      userId: '3231231',
      connectionId: 'con_MG9jBf9lVj',
    },
    {
      username: '박창조',
      userId: '1234211',
      connectionId: 'con_D6N4TrQIKj',
    },
    {
      username: '김철수',
      userId: '1233213',
      connectionId: 'con_D6N4Tr1232',
    },
  ]

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

  // const queryClient = useQueryClient()
  // const { nickname: username, id: userId } = queryClient.getQueryData([
  //   'validateToken',
  // ])

  // 최종 점수 계산
  const calculateFinalScore = () => {
    return userList.map((user) => {
      // 질문 답변 점수 계산
      const questionScore = {
        [questionRank.first]: 100,
        [questionRank.second]: 50,
        [questionRank.third]: 20,
      }

      // 태도 점수 계산
      const attitudeScore = {
        [attitudeRank.first]: 100,
        [attitudeRank.second]: 50,
        [attitudeRank.third]: 20,
      }

      // 각 유저의 총점 계산 및 반환
      return {
        userId: user.userId,
        score:
          presenterRating * 50 +
          (questionScore[user.userId] || 0) +
          (attitudeScore[user.userId] || 0),
      } as { userId: string; score: number }
    })
  }

  const test = [
    {
      teamId: '123123123',
      score: 100,
    },
    {
      teamId: '123123123',
      score: 100,
    },
    {
      teamId: '123123123',
      score: 100,
    },
  ]

  // 단계 이동 및 제출 핸들러
  const handleNext = () => setStep(Math.min(step + 1, 2))
  const handlePrev = () => setStep(Math.max(step - 1, 0))
  const handleSubmit = async () => {
    // 에러 처리
    if (presenterRating === 0) {
      alert('발표자 평가를 진행해주세요.')
      return
    }
    if (
      questionRank.first === '' ||
      questionRank.second === '' ||
      questionRank.third === ''
    ) {
      alert('질문 답변 평가를 진행해주세요.')
      return
    }
    if (
      attitudeRank.first === '' ||
      attitudeRank.second === '' ||
      attitudeRank.third === ''
    ) {
      alert('태도 평가를 진행해주세요.')
      return
    }

    alert('평가가 제출되었습니다!')

    session?.signal({
      data: JSON.stringify({
        data: calculateFinalScore(),
      }),
      type: 'vote',
    })

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
