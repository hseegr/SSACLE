import { ModalSteps } from '@/constants/modalStep'
import { usePresentationModalStateStore } from '@/store/usePresentationModalStateStore'
import { usePresentationStore } from '@/store/usePresentationStore'
import { useStreamStore } from '@/store/useStreamStore'
import { useMemo, type FC } from 'react'
import { useShallow } from 'zustand/shallow'
import { usePresentationSignalStore } from '@/store/usePresentationSignalStore'
import {
  PRESENTATION_STATUS,
  PresentationStatus,
} from '@/constants/presentationStatus'
import { useOpenviduStateStore } from '@/store/useOpenviduStateStore'

interface PresentationStatusBarProps {}

const PresentationStatusBar: FC<PresentationStatusBarProps> = ({}) => {
  const myConnectionId = useOpenviduStateStore((state) => state.myConnectionId)
  const screenPublisher = useOpenviduStateStore(
    (state) => state.screenPublisher
  )
  const isScreenSharing = useStreamStore((state) => state.isScreenSharing)
  const { presentationStatus } = usePresentationSignalStore(
    useShallow((state) => ({
      presentationStatus: state.presentationStatus,
    }))
  )
  const { presenterInfo, isQuestionSelected } = usePresentationStore(
    useShallow((state) => ({
      presenterInfo: state.presenterInfo,
      isQuestionSelected: state.isQuestionSelected,
    }))
  )
  //   if (!isScreenSharing) return null

  const { setModalStep, setIsModalOpen } = usePresentationModalStateStore(
    useShallow((state) => ({
      setModalStep: state.setModalStep,
      setIsModalOpen: state.setIsModalOpen,
    }))
  )

  const handleEndPresentation = () => {
    setIsModalOpen(true)
    setModalStep(ModalSteps.PRESENTATION.PRESENTATION_END_CONFIRM)
  }

  const handleEndQuestion = () => {
    setIsModalOpen(true)
    setModalStep(ModalSteps.QUESTION.ANSWER_END_CONFIRM)
  }

  const handleEndStep = () => {
    if (isPresentationStep) {
      handleEndPresentation()
    } else if (isQuestionSelected) {
      handleEndQuestion()
    }
  }

  // 발표 상태
  const isPresentationStep = useMemo(() => {
    return (
      presentationStatus === (PRESENTATION_STATUS.ING as PresentationStatus) ||
      false
    )
  }, [presentationStatus])

  // 질문 답변 상태
  const isQuestionStep = useMemo(() => {
    return (
      presentationStatus ===
      (PRESENTATION_STATUS.QUESTION_ANSWER as PresentationStatus)
    )
  }, [presentationStatus])

  // 현재 상태가 나의 상태인지 확인
  const isMyStatus = useMemo(() => {
    return (
      myConnectionId === presenterInfo.connectionId ||
      screenPublisher?.stream.connection.connectionId === myConnectionId
    )
  }, [presenterInfo, myConnectionId, screenPublisher])

  return (
    <div className="flex items-center justify-between gap-5 p-2 rounded-md basis-1/2">
      {isScreenSharing && (
        <section className="flex items-center justify-center gap-5">
          <span className="px-4 py-1 text-sm text-white rounded-full bg-red-400/80 animate-pulse">
            화면 공유 중
          </span>
          {isPresentationStep && (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold">발표자</span>
                <span className="text-lg text-white ">
                  ✨ {presenterInfo.name ?? ''} ✨
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-white">
                <span>남은 발표 시간</span>
                <span className="text-lg font-bold">00:00</span>
              </div>
            </>
          )}
        </section>
      )}
      {/* 발표 완료 버튼 */}
      {(isPresentationStep || isQuestionStep) && isMyStatus && (
        <button
          onClick={handleEndStep}
          className="px-4 py-1 text-sm text-white rounded-full bg-ssacle-blue hover:bg-ssacle-blue/90"
        >
          {isPresentationStep && '발표 완료'}
          {isQuestionStep && '질문 답변 완료'}
        </button>
      )}
    </div>
  )
}
export default PresentationStatusBar
