import ConferenceContainer from '@/components/ConferenceContainer/ConferenceContainer'
import { fetchSessionId, fetchToken } from '@/services/openviduService'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'

const SessionInitializer = () => {
  const [searchParams] = useSearchParams()
  const ssaprintId = searchParams.get('ssaprintId')
  // 세션 ID 요청
  const { data: token, isSuccess } = useQuery({
    queryKey: ['sessionId'],
    queryFn: async () => {
      const sessionId = await fetchSessionId(ssaprintId ?? 'test-session-id')
      const token = await fetchToken(sessionId)
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
