import PresentationNoticeModal from '@/components/PresentationPage/PresentationNoticeModal/PresentationNoticeModal'
import { useEffect, useState } from 'react'
import { MODAL_STEP } from '@/constants/modalStep'
import PresentationPageWrapper from '@/components/PresentationPage/PresentationPageWrapper/PresentationPageWrapper'
import VideoConference from '@/components/VideoConference/VideoConference'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import VideoConferenceTest from '@/components/VideoConferenceTest/VideoConferenceTest'
// import VideoConferenceTest from '@/components/VideoConferenceTest/VideoConferenceTest'
const PresentationPage = () => {
  // 모달 열기 상태
  // const [isOpen, setIsOpen] = useState(false)
  // const [modalStep, setModalStep] = useState(MODAL_STEP.READY)
  const BACKEND_SERVER_URL = 'http://localhost:5000' // Spring Boot 서버 주소

  // 세션 ID 요청
  const { data: sessionId, isSuccess: isSessionSuccess } = useQuery({
    queryKey: ['sessionId'],
    queryFn: async () => {
      const response = await axios.post(`${BACKEND_SERVER_URL}/api/sessions`)
      return response.data // 실제 데이터만 반환
    },
  })

  // 토큰 요청 - 세션 ID가 있을 때만 실행
  const { data: token, isSuccess: isTokenSuccess } = useQuery({
    queryKey: ['token', sessionId],
    queryFn: async () => {
      try {
        const response = await axios.post(
          `${BACKEND_SERVER_URL}/api/sessions/${sessionId}/connections`
        )
        if (response.status === 200) {
          return response.data
        }
        throw new Error('Failed to get token')
      } catch (error) {
        console.error('Token request failed:', error)
        throw error
      }
    },
    enabled: isSessionSuccess && !!sessionId, // 세션 ID가 있을 때만 실행
    retry: 3,
    retryDelay: 1000,
    staleTime: Infinity, // 토큰은 한번 받으면 변경되지 않으므로
  })

  // console.log('tokenResponse', tokenResponse)

  return (
    // <VideoConferenceTest />
    sessionId &&
    token && <VideoConference sessionId={sessionId} token={token} />
    // <PresentationPageWrapper>
    //   {/* 공통 공지 모달 : 상태가 바뀔 때 마다 모달이 뜨도록 구성 */}
    //   <PresentationNoticeModal
    //     isOpen={isOpen}
    //     setIsOpen={setIsOpen}
    //     modalStep={modalStep}
    //   />
    // </PresentationPageWrapper>
  )
}
export default PresentationPage
