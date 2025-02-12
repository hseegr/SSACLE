import ConferenceContainer from '@/components/ConferenceContainer/ConferenceContainer'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const SessionInitializer = () => {
  // 세션 ID 요청
  const { data: token, isSuccess } = useQuery({
    queryKey: ['sessionId'],
    queryFn: async () => {
      const { data: sessionId } = await axios.post(
        `http://localhost:5000/api/sessions`,
        {
          customSessionId: 'customSession123125533',
        }
      )
      // const sessionId = 'test-sesstionId'

      const { data: token } = await axios.post(
        `http://localhost:5000/api/sessions/${sessionId}/connections`
      )

      return token // 실제 데이터만 반환
    },
    staleTime: Infinity, // 토큰은 한번 받으면 변경되지 않으므로
  })

  return (
    <div className="flex items-center justify-center w-full h-full">
      {isSuccess && token ? (
        <ConferenceContainer token={token} />
      ) : (
        <div>
          <p>세션 ID 또는 토큰이 없습니다.</p>
        </div>
      )}
    </div>
  )
}
export default SessionInitializer
