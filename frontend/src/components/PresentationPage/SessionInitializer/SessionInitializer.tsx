import ConferenceContainer from '@/components/ConferenceContainer/ConferenceContainer'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const SessionInitializer = () => {
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

  return (
    <div className="w-full h-full">
      {isTokenSuccess && sessionId && token ? (
        <ConferenceContainer sessionId={sessionId} token={token} />
      ) : (
        <div>
          <p>세션 ID 또는 토큰이 없습니다.</p>
        </div>
      )}
    </div>
  )
}
export default SessionInitializer
