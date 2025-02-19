import { useNavigate } from 'react-router-dom'
import { usePresentationModalActions } from '@/store/usePresentationModalActions'
import { useConnect } from '@/hooks/useConnect'
import { useOpenviduStateStore } from '@/store/useOpenviduStateStore'
import { useShallow } from 'zustand/react/shallow'
import { createModalStepConfig } from '@/config/modalStepConfigFactory'
import { Session } from 'openvidu-browser'
import { usePresentationStore } from '@/store/usePresentationStore'
import useScreenShare from '@/hooks/useScreenShare'
import { usePresentationSignalStore } from '@/store/usePresentationSignalStore'

const useModalConfig = () => {
  const { setModalStep, closeModal } = usePresentationModalActions(
    useShallow((state) => ({
      setModalStep: state.setModalStep,
      closeModal: state.closeModal,
    }))
  )
  const presentationStatus = usePresentationSignalStore(
    useShallow((state) => state.presentationStatus)
  )
  const {
    presenterInfo,
    isQuestionCompleted,
    isQuestionSelected,
    setIsQuestionSelected,
    selectedQuestion,
    setPresenterInfo,
  } = usePresentationStore(
    useShallow((state) => ({
      presenterInfo: state.presenterInfo,
      isQuestionCompleted: state.isQuestionCompleted,
      isQuestionSelected: state.isQuestionSelected,
      setIsQuestionSelected: state.setIsQuestionSelected,
      selectedQuestion: state.selectedQuestion,
      setPresenterInfo: state.setPresenterInfo,
    }))
  )
  const navigate = useNavigate()
  const { leaveSession } = useConnect()
  const session = useOpenviduStateStore(useShallow((state) => state.session))
  const { startScreenShare } = useScreenShare()
  const { stopScreenShare } = useScreenShare()

  // 팩토리 함수를 호출하여 모달 설정 생성
  const MODAL_STEP_CONFIG = createModalStepConfig({
    closeModal,
    navigate,
    leaveSession,
    session: session as Session,
    setModalStep,
    presenterInfo,
    isQuestionSelected,
    selectedQuestion,
    isQuestionCompleted,
    setIsQuestionSelected,
    startScreenShare,
    stopScreenShare,
    setPresenterInfo,
    presentationStatus,
  })

  const getModalStepConfig = (step: string) => {
    // 예시 step : ModalSteps.INITIAL.WELCOME
    return MODAL_STEP_CONFIG[step]
  }

  return { getModalStepConfig, MODAL_STEP_CONFIG }
}

export default useModalConfig
