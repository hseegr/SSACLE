import PresentationNoticeModal from '@/components/PresentationPage/PresentationNoticeModal/PresentationNoticeModal'
import { useState } from 'react'
import { MODAL_STEP } from '@/constants/modalStep'
import PresentationPageWrapper from '@/components/PresentationPage/PresentationPageWrapper/PresentationPageWrapper'
import SessionInitializer from '@/components/PresentationPage/SessionInitializer/SessionInitializer'
const PresentationPage = () => {
  // 모달 열기 상태
  const [isOpen, setIsOpen] = useState(false)
  const [modalStep, setModalStep] = useState(MODAL_STEP.READY)

  return (
    <>
      <PresentationPageWrapper>
        <SessionInitializer />
        {/* 공통 공지 모달 : 상태가 바뀔 때 마다 모달이 뜨도록 구성 */}
        <PresentationNoticeModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          modalStep={modalStep}
        />
      </PresentationPageWrapper>
    </>
  )
}
export default PresentationPage
