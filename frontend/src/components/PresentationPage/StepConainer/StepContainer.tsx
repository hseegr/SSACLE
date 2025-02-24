import {
  PRESENTATION_STATUS,
  PRESENTATION_STATUS_KEYS,
} from '@/constants/presentationStatus'
import { useOpenviduStateStore } from '@/store/useOpenviduStateStore'
import { usePresentationSignalStore } from '@/store/usePresentationSignalStore'
import useRoomStateStore from '@/store/useRoomStateStore'
import { useEffect, useRef, type FC } from 'react'
import { useShallow } from 'zustand/shallow'
import { useParams } from 'react-router-dom'
import { usePresentationStore } from '@/store/usePresentationStore'

interface StepContainerProps {}

const StepContainer: FC<StepContainerProps> = () => {
  const session = useOpenviduStateStore((state) => state.session)
  const { roomId } = useParams()

  // 발표 상태 관리
  const { presentationStatus } = usePresentationSignalStore(
    useShallow((state) => ({
      presentationStatus: state.presentationStatus,
    }))
  )

  const { setIsQuestionCompleted, presenterInfo } = usePresentationStore(
    useShallow((state) => ({
      setIsQuestionCompleted: state.setIsQuestionCompleted,
      presenterInfo: state.presenterInfo,
    }))
  )

  // 방 참여자 데이터 관리
  const roomConnectionData = useRoomStateStore(
    (state) => state.roomConnectionData[roomId as string]
  )
  // 답변자 소개 신호 전송 여부
  const questionStep = useRef<
    {
      userId: string
      connectionId: string
      isAnswer: boolean
    }[]
  >([])

  // roomConnectionData가 변경될 때마다 questionStep을 최신 데이터로 갱신
  useEffect(() => {
    if (roomConnectionData && roomConnectionData.length > 0) {
      questionStep.current = roomConnectionData.map((item) => ({
        userId: item.userId,
        connectionId: item.connectionId,
        isAnswer: false, // 발표 여부 초기값 false
      }))
    }
  }, [roomConnectionData])

  const answerCount = useRef(0)

  useEffect(() => {
    switch (presentationStatus) {
      // Todo : 질문 준비 신호 전송
      // 답변자 정하기,
      case PRESENTATION_STATUS_KEYS.QUESTION_ANSWERER_INTRO:
        // ! 발표자 정보가 이미 있을 경우 질문 준비 신호 전송 중단
        if (presenterInfo.connectionId !== '') return

        // 발표자 랜덤 선택: 이미 발표한 사람(isAnswer가 true인)을 제외한 후보 목록 생성
        const availableCandidates = questionStep.current.filter(
          (candidate) => !candidate.isAnswer
        )

        // session.streamManagers에 존재하는 후보만 필터링
        const validCandidates = availableCandidates.filter((candidate) =>
          session?.streamManagers.some(
            (sm) => sm.stream.connection.connectionId === candidate.connectionId
          )
        )

        if (validCandidates.length > 0) {
          console.log('✨ 남은 사람있음', validCandidates)
          const randomIndex = Math.floor(Math.random() * validCandidates.length)
          const selectedCandidate = validCandidates[randomIndex]

          // questionStep 내 해당 후보 표시
          const candidateIndex = questionStep.current.findIndex(
            (candidate) =>
              candidate.connectionId === selectedCandidate.connectionId
          )
          questionStep.current[candidateIndex].isAnswer = true

          // validCandidates이므로 streamManager가 존재함
          const presenterStreamManager = session?.streamManagers.find(
            (sm) =>
              sm.stream.connection.connectionId ===
              selectedCandidate.connectionId
          )
          if (presenterStreamManager) {
            const presenterConnectionId =
              presenterStreamManager.stream.connection.connectionId
            const { username: presenterName } = JSON.parse(
              presenterStreamManager.stream.connection.data as string
            )

            setTimeout(() => {
              console.log('질문 준비 신호 전송⚠️🥇')
              session?.signal({
                data: JSON.stringify({
                  data: PRESENTATION_STATUS.QUESTION_ANSWERER_INTRO,
                  presenterConnectionId,
                  presenterName,
                }),
                type: 'presentationStatus',
              })
            }, 3000)

            answerCount.current += 1
            // 마지막 후보 처리
            if (answerCount.current === questionStep.current.length) {
              console.log('마지막 답변자')
              setIsQuestionCompleted(true)
            }
            console.log('질문 전송 완료')
          }
        } else {
          // 유효한 후보가 없으면 질문 종료 신호 전송
          setTimeout(() => {
            session?.signal({
              data: JSON.stringify({
                data: PRESENTATION_STATUS.QUESTION_END,
              }),
              type: 'end',
            })
          }, 1000)
        }
        break
      // Todo 발표 시작 상태일 때 5초 후 발표자 소개 신호 전송
      case PRESENTATION_STATUS_KEYS.START:
        // 발표자 랜덤 선택
        const randomPresenter = Math.floor(
          Math.random() * (session?.streamManagers?.length ?? 0)
        )

        // 발표자 connection ID
        const presenterConnectionId =
          session?.streamManagers[randomPresenter].stream.connection
            .connectionId

        // 발표자 이름
        const { username: presenterName } = JSON.parse(
          session?.streamManagers[randomPresenter].stream.connection
            .data as string
        )

        // 발표자 소개 신호 전송
        setTimeout(() => {
          session?.signal({
            data: JSON.stringify({
              data: PRESENTATION_STATUS.PRESENTER_INTRO,
              presenterConnectionId,
              presenterName,
            }),
            type: 'presentationStatus',
          })
        }, 3000)
        break
    }
  }, [presentationStatus])
  return <div></div>
}
export default StepContainer
