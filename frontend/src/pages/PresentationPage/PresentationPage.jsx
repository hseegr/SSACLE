import PresentationNoticeModal from '@/components/PresentationPage/PresentationNoticeModal/PresentationNoticeModal'
import PresentationPageWrapper from '@/components/PresentationPage/PresentationPageWrapper/PresentationPageWrapper'
import SessionInitializer from '@/components/PresentationPage/SessionInitializer/SessionInitializer'
import StepContainer from '@/components/PresentationPage/StepConainer/StepContainer'
import { ModalSteps } from '@/constants/modalStep'
import { fetchPresentationAvailability } from '@/services/presentationService'
import { usePresentationModalStateStore } from '@/store/usePresentationModalStateStore'
import { usePresentationSignalStore } from '@/store/usePresentationSignalStore'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

const PresentationPage = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  // 발표 참가 여부 확인
  const { data: presentationAvailability, isSuccess } = useQuery({
    queryKey: ['presentation-availability'],
    queryFn: () => fetchPresentationAvailability(roomId ?? 'test-session-id'),
    staleTime: Infinity,
    gcTime: 0,
    enabled: !!roomId,
    retry: 3,
  })

  // if (!presentationAvailability) {
  //   alert('발표 참가 불가능합니다.')
  //   navigate(-1)
  //   return
  // }

  // 모달 열기 상태
  const isModalOpen = usePresentationModalStateStore(
    (state) => state.isModalOpen
  )
  const modalStep = usePresentationModalStateStore((state) => state.modalStep)
  const presentationStatus = usePresentationSignalStore(
    (state) => state.presentationStatus
  )

  // isSessionVisible 상태 - 한 번 true가 된 이후에는 계속 true 유지됩니다.
  const [isSessionVisible, setIsSessionVisible] = useState(false)

  useEffect(() => {
    if (!isSessionVisible) {
      setIsSessionVisible(
        (prev) =>
          prev ||
          (modalStep === ModalSteps.INITIAL.WELCOME &&
            !isModalOpen &&
            presentationStatus === 'INITIAL')
      )
    }
  }, [modalStep, isModalOpen, presentationStatus])

  return (
    <>
      <PresentationPageWrapper>
        {isSessionVisible && <SessionInitializer />}
        {/* 공통 공지 모달 : 상태가 바뀔 때 마다 모달이 뜨도록 구성 */}
        <StepContainer />
        <PresentationNoticeModal />
      </PresentationPageWrapper>
    </>
  )
}

export default PresentationPage
