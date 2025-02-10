import PresentationNoticeModal from '@/components/PresentationPage/PresentationNoticeModal/PresentationNoticeModal'
import PresentationPageWrapper from '@/components/PresentationPage/PresentationPageWrapper/PresentationPageWrapper'
import SessionInitializer from '@/components/PresentationPage/SessionInitializer/SessionInitializer'
import { usePresentationModalStore } from '@/store/usePresentaionModalStore'
const PresentationPage = () => {
  // 모달 열기 상태
  const { isModalOpen, modalStep } = usePresentationModalStore()

  // 초기 입장 시 세션 보여줄지 말지 결정
  const isSessionVisible = modalStep === 'welcome' && !isModalOpen
  return (
    <>
      <PresentationPageWrapper>
        {isSessionVisible && <SessionInitializer />}
        {/* 공통 공지 모달 : 상태가 바뀔 때 마다 모달이 뜨도록 구성 */}
        <PresentationNoticeModal />
      </PresentationPageWrapper>
    </>
  )
}
export default PresentationPage
