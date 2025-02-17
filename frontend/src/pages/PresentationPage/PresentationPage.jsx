import PresentationNoticeModal from '@/components/PresentationPage/PresentationNoticeModal/PresentationNoticeModal'
import PresentationPageWrapper from '@/components/PresentationPage/PresentationPageWrapper/PresentationPageWrapper'
import SessionInitializer from '@/components/PresentationPage/SessionInitializer/SessionInitializer'
import StepContainer from '@/components/PresentationPage/StepConainer/StepContainer'
import { ModalSteps } from '@/constants/modalStep'
import { usePresentationModalStateStore } from '@/store/usePresentationModalStateStore'
import { usePresentationSignalStore } from '@/store/usePresentationSignalStore'
import { useState, useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

const PresentationPage = () => {
  // 모달 열기 상태
  const { isModalOpen, modalStep } = usePresentationModalStateStore(
    useShallow((state) => ({
      isModalOpen: state.isModalOpen,
      modalStep: state.modalStep,
    }))
  )

  const { presentationStatus } = usePresentationSignalStore(
    useShallow((state) => ({
      presentationStatus: state.presentationStatus,
    }))
  )

  // isSessionVisible 상태 - 한 번 true가 된 이후에는 계속 true 유지됩니다.
  const [isSessionVisible, setIsSessionVisible] = useState(false)

  useEffect(() => {
    // 조건이 만족되고 아직 상태가 false라면 true로 설정합니다.
    if (
      !isSessionVisible &&
      modalStep === ModalSteps.INITIAL.WELCOME &&
      !isModalOpen &&
      presentationStatus === 'INITIAL'
    ) {
      setIsSessionVisible(true)
    }
  }, [isSessionVisible, modalStep, isModalOpen, presentationStatus])

  return (
    <>
      <PresentationPageWrapper>
        {isSessionVisible && <SessionInitializer />}
        {/* 공통 공지 모달 : 상태가 바뀔 때 마다 모달이 뜨도록 구성 */}
        <StepContainer>
          <PresentationNoticeModal />
        </StepContainer>
      </PresentationPageWrapper>
    </>
  )
}

export default PresentationPage
