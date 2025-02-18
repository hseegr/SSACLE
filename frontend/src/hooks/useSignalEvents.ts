import { useMemo, useCallback, useRef, useEffect } from 'react'
import debounce from 'lodash/debounce'
import {
  getNextPresentationStatus,
  PRESENTATION_STATUS,
  PresentationStatus,
} from '@/constants/presentationStatus'
import {
  SignalStateKeys,
  usePresentationSignalStore,
} from '@/store/usePresentationSignalStore'
import { getModalStep, ModalSteps } from '@/constants/modalStep'
import { useShallow } from 'zustand/shallow'
import { SignalEvent } from 'openvidu-browser'

interface UseSignalEventsProps {
  myConnectionId: string | null
  setIsModalOpen: (isOpen: boolean) => void
  setModalStep: (step: string) => void
  modalStep: string
  targetConnectionCount: number // 목표 참가자 수
  setIsQuestionSelected: (isQuestionSelected: boolean) => void
  setSelectedQuestion: (selectedQuestion: Question) => void
}

export const useSignalEvents = ({
  myConnectionId,
  setIsModalOpen,
  setModalStep,
  targetConnectionCount,
  setIsQuestionSelected,
  setSelectedQuestion,
}: UseSignalEventsProps) => {
  // Zustand 스토어에서 필요한 메서드들을 가져옵니다
  const {
    presentationStatus,
    signalStates,
    addSignalConnection,
    setPresentationStatus,
  } = usePresentationSignalStore(
    useShallow((state) => ({
      presentationStatus: state.presentationStatus,
      signalStates: state.signalStates,
      addSignalConnection: state.addSignalConnection,
      setPresentationStatus: state.setPresentationStatus,
    }))
  )

  // debounced 함수를 ref로 관리 → 컴포넌트 라이프사이클내에 한 번만 생성되도록 보장
  const debouncedAllHandleSignal = useRef(
    debounce((signalType: PresentationStatus) => {
      const nextStatus = getNextPresentationStatus(signalType)
      const nextModalStep = getModalStep(signalType as PresentationStatus)

      if (nextModalStep) {
        setIsModalOpen(true)
        setModalStep(nextModalStep)
      } else {
        setPresentationStatus(nextStatus as PresentationStatus)
        setIsModalOpen(false)
      }
    }, 3000)
  )

  // 컴포넌트 언마운트시 pending된 debounce 호출 취소
  useEffect(() => {
    return () => {
      debouncedAllHandleSignal.current.cancel()
    }
  }, [])

  const readySignalHandler = useCallback(
    (event: SignalEvent) => {
      const {
        data: signalType,
        selectedQuestion,
        presenterInfo,
      } = JSON.parse(event.data as string)
      setPresentationStatus(signalType)
      if (signalType === PRESENTATION_STATUS.QUESTION_ANSWER) {
        // 질문 모달을 띄우기 위한 상태 변환??
        setIsQuestionSelected(true)
        setSelectedQuestion(selectedQuestion)
      }
      setIsModalOpen(false)
    },
    [
      setIsModalOpen,
      setPresentationStatus,
      setIsQuestionSelected,
      setSelectedQuestion,
    ]
  )

  const endSignalHandler = useCallback(
    (event: SignalEvent) => {
      const { data: signalType } = JSON.parse(event.data as string)

      setIsModalOpen(true)
      // 발표 종료 모달
      if (signalType === PRESENTATION_STATUS.PENDING_END)
        setModalStep(ModalSteps.PRESENTATION.PRESENTATION_END)

      // 질문 중간 종료 모달
      if (signalType === PRESENTATION_STATUS.QUESTION_ANSWER_MIDDLE_END) {
        setModalStep(ModalSteps.QUESTION.ANSWER_MIDDLE_END)
        setIsQuestionSelected(false)
      }

      // 질문 종료 모달
      if (signalType === PRESENTATION_STATUS.QUESTION_END)
        setModalStep(ModalSteps.QUESTION.ANSWER_END)
    },
    [setIsModalOpen, setModalStep, setIsQuestionSelected]
  )

  type SignalTarget = 'all' | 'individual' | 'presenter' | 'questioner'

  // OpenVidu 시그널 처리 함수
  const handleSignal = useCallback(
    (signalType: SignalStateKeys, target: SignalTarget, connectId?: string) => {
      switch (target) {
        case 'all':
          // 현재 시그널에 대한 연결 수가 목표 참가자 수에 도달했는지 확인
          if (
            signalStates[signalType as SignalStateKeys].size ===
            targetConnectionCount - 1
          ) {
            // ref를 통해 debounce 함수를 호출합니다.
            debouncedAllHandleSignal.current(signalType)
          }
          break
        case 'individual':
          // console.log('나 참여자야?', connectId)

          if (signalType === PRESENTATION_STATUS.PRESENTER_INTRO) {
            setIsModalOpen(true)
            setModalStep(ModalSteps.PRESENTATION.PRESENTATION_WAITING)
          } else if (
            signalType === PRESENTATION_STATUS.QUESTION_ANSWERER_INTRO
          ) {
            setIsModalOpen(true)
            setModalStep(ModalSteps.QUESTION.ANSWER_WAITING)
          }
          break
        case 'presenter':
          if (connectId !== myConnectionId) return // 내가 발표자가 아니면 처리하지 않음
          // console.log('나 발표자야?', connectId)

          // 여기서 질문 답변 준비 신호 보내기
          if (signalType === PRESENTATION_STATUS.PRESENTER_INTRO) {
            setModalStep(ModalSteps.PRESENTATION.PRESENTER_INTRODUCTION)
            setIsModalOpen(true)
          } else if (
            signalType === PRESENTATION_STATUS.QUESTION_ANSWERER_INTRO
          ) {
            setModalStep(ModalSteps.QUESTION.ANSWER_INTRODUCTION)
            setIsModalOpen(true)
          }
          break
      }
    },
    [
      signalStates,
      targetConnectionCount,
      myConnectionId,
      setIsModalOpen,
      setModalStep,
    ]
  )

  return {
    handleSignal,
    addSignalConnection,
    readySignalHandler,
    endSignalHandler,
  }
}
