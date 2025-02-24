import PresentationNoticeModal from '@/components/PresentationPage/PresentationNoticeModal/PresentationNoticeModal'
import PresentationPageWrapper from '@/components/PresentationPage/PresentationPageWrapper/PresentationPageWrapper'
import SessionInitializer from '@/components/PresentationPage/SessionInitializer/SessionInitializer'
import StepContainer from '@/components/PresentationPage/StepConainer/StepContainer'
import { ModalSteps } from '@/constants/modalStep'
import { fetchPresentationAvailability } from '@/services/presentationService'
import { usePresentationModalStateStore } from '@/store/usePresentationModalStateStore'
import { usePresentationSignalStore } from '@/store/usePresentationSignalStore'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect, memo } from 'react'
import { useBlocker, useLocation, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

// 1. 필요한 상태만 정확하게 선택하도록 selector 최적화
const useModalState = () =>
  usePresentationModalStateStore(
    useShallow((state) => ({
      isModalOpen: state.isModalOpen,
      modalStep: state.modalStep,
    }))
  )

const usePresentationState = () =>
  usePresentationSignalStore(
    useShallow((state) => ({
      presentationStatus: state.presentationStatus,
    }))
  )

// 2. 세션 초기화 컴포넌트를 메모이제이션
const MemoizedSessionInitializer = memo(SessionInitializer)

// 3. 컴포넌트 자체를 메모이제이션
const PresentationPage = memo(() => {
  const { roomId } = useParams()
  const [isSessionVisible, setIsSessionVisible] = useState(false)
  const [isBlocking, setIsBlocking] = useState(true) // 페이지 이탈 차단 여부

  const location = useLocation()

  // 최적화된 상태 구독
  const { isModalOpen, modalStep } = useModalState()
  const { presentationStatus } = usePresentationState()

  const { data: presentationAvailability, isSuccess } = useQuery({
    queryKey: ['presentation-availability'],
    queryFn: () => fetchPresentationAvailability(roomId ?? 'test-session-id'),
    staleTime: Infinity,
    gcTime: 0,
    enabled: !!roomId,
    retry: 3,
  })

  // React Router 내비게이션 차단
  useBlocker(({ currentLocation, nextLocation }) => {
    if (isBlocking && currentLocation.pathname !== nextLocation.pathname) {
      return !window.confirm('페이지를 벗어나시겠습니까?')
    }
    return false
  })

  useEffect(() => {
    // 페이지를 벗어나기 전에 실행되는 이벤트 핸들러
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = '' // Chrome에서는 이 값이 필요합니다
      return '' // 표준 경고 메시지가 표시됩니다
    }

    // 이벤트 리스너 등록
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      window.removeEventListener('beforeunload', handleBeforeUnload)

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true }) //
        .then((stream) =>
          stream
            .getTracks() //
            .forEach((track) => track.stop())
        )
    }
  }, [location.pathname])

  useEffect(() => {
    if (isSessionVisible) return

    const shouldBeVisible =
      modalStep === ModalSteps.INITIAL.WELCOME &&
      !isModalOpen &&
      presentationStatus === 'INITIAL'

    if (shouldBeVisible) {
      setIsSessionVisible(true)
    }
  }, [isModalOpen, modalStep, presentationStatus, isSessionVisible])

  return (
    <PresentationPageWrapper>
      {isSessionVisible && <MemoizedSessionInitializer />}
      <StepContainer />
      <PresentationNoticeModal />
    </PresentationPageWrapper>
  )
})

// 컴포넌트 이름 지정 (디버깅용)
PresentationPage.displayName = 'PresentationPage'

export default PresentationPage
