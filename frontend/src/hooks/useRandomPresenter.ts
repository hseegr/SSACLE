import { useEffect, useRef } from 'react'
import {
  PRESENTATION_STATUS,
  PRESENTATION_STATUS_KEYS,
} from '@/constants/presentationStatus'
import { useOpenviduStateStore } from '@/store/useOpenviduStateStore'
import { usePresentationSignalStore } from '@/store/usePresentationSignalStore'
import { usePresentationStore } from '@/store/usePresentationStore'
import useRoomStateStore from '@/store/useRoomStateStore'
import { useParams } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'

export const useRandomPresenter = () => {
  const session = useOpenviduStateStore((state) => state.session)
  const { roomId } = useParams()

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

  const roomConnectionData = useRoomStateStore(
    (state) => state.roomConnectionData[roomId as string]
  )

  const questionStep = useRef<
    { userId: string; connectionId: string; isAnswer: boolean }[]
  >([])

  const answerCount = useRef(0)

  // roomConnectionData가 변경될 때마다 questionStep 업데이트
  useEffect(() => {
    if (roomConnectionData?.length > 0) {
      questionStep.current = roomConnectionData.map((item) => ({
        userId: item.userId,
        connectionId: item.connectionId,
        isAnswer: false,
      }))
    }
  }, [roomConnectionData])

  useEffect(() => {
    if (!session) return

    switch (presentationStatus) {
      case PRESENTATION_STATUS_KEYS.QUESTION_ANSWERER_INTRO:
        if (presenterInfo.connectionId !== '') return

        const validCandidates = questionStep.current.filter(
          (candidate) =>
            !candidate.isAnswer &&
            session.streamManagers.some(
              (sm) =>
                sm.stream.connection.connectionId === candidate.connectionId
            )
        )

        if (validCandidates.length > 0) {
          const selectedCandidate =
            validCandidates[Math.floor(Math.random() * validCandidates.length)]

          const candidateIndex = questionStep.current.findIndex(
            (candidate) =>
              candidate.connectionId === selectedCandidate.connectionId
          )
          questionStep.current[candidateIndex].isAnswer = true

          const presenterStreamManager = session.streamManagers.find(
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
              session.signal({
                data: JSON.stringify({
                  data: PRESENTATION_STATUS.QUESTION_ANSWERER_INTRO,
                  presenterConnectionId,
                  presenterName,
                }),
                type: 'presentationStatus',
              })
            }, 3000)

            answerCount.current += 1
            if (answerCount.current === questionStep.current.length) {
              setIsQuestionCompleted(true)
            }
          }
        } else {
          setTimeout(() => {
            session.signal({
              data: JSON.stringify({
                data: PRESENTATION_STATUS.QUESTION_END,
              }),
              type: 'end',
            })
          }, 1000)
        }
        break

      case PRESENTATION_STATUS_KEYS.START:
        const randomPresenterIndex = Math.floor(
          Math.random() * (session.streamManagers.length ?? 0)
        )
        const randomPresenter = session.streamManagers[randomPresenterIndex]

        if (randomPresenter) {
          const presenterConnectionId =
            randomPresenter.stream.connection.connectionId
          const { username: presenterName } = JSON.parse(
            randomPresenter.stream.connection.data as string
          )

          setTimeout(() => {
            session.signal({
              data: JSON.stringify({
                data: PRESENTATION_STATUS.PRESENTER_INTRO,
                presenterConnectionId,
                presenterName,
              }),
              type: 'presentationStatus',
            })
          }, 3000)
        }
        break
    }
  }, [presentationStatus, session])
}
