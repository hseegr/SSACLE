import ConferenceContainer from '@/components/ConferenceContainer/ConferenceContainer'
import { PresentationParticipants, User } from '@/interfaces/user.interface'
import {
  fetchServerToken,
  fetchSessionId,
  fetchToken,
} from '@/services/openviduService'
import {
  fetchPresentationParticipants,
  fetchQuestionCards,
} from '@/services/presentationService'
import { usePresentationStore } from '@/store/usePresentationStore'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const SessionInitializer = () => {
  const { roomId } = useParams()
  console.log('여기 렌더링✨✨')

  // 세션 초기화 시 타겟 연결 수 설정
  const setTargetConnectionCount = usePresentationStore(
    (state) => state.setTargetConnectionCount
  )

  // 세션 ID 요청
  const { data: token, isSuccess } = useQuery({
    queryKey: ['openvidu-token'],
    queryFn: async () => {
      const sessionId = await fetchSessionId(roomId ?? 'test-session-id')
      const token = await fetchToken(sessionId)
      return token
      // const serverToken = await fetchServerToken(roomId ?? 'test-session-id')
      // return serverToken // 실제 데이터만 반환
    },
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
    gcTime: 1000 * 60 * 60, // 1시간 동안 캐시 유지
  })

  // 타겟 연결 수 설정
  const {
    data: presentationParticipants,
    isSuccess: isPresentationParticipantsSuccess,
  } = useQuery<PresentationParticipants[]>({
    queryKey: ['presentation-participants'],
    queryFn: () => fetchPresentationParticipants(roomId ?? 'test-session-id'),
    staleTime: 1000 * 60 * 5, // 10분 동안 캐시 유지
    refetchInterval: 1000 * 5, // 10초 동안 캐시 유지
    enabled: !!roomId,
  })

  // 질문 카드 목록 요청
  useQuery({
    queryKey: ['question-card-list'],
    queryFn: () => fetchQuestionCards(roomId ?? 'test-session-id'),
    staleTime: Infinity, // 질문 카드 목록은 한번 받으면 변경되지 않으므로
    enabled: !!roomId,
    gcTime: 1000 * 60 * 60, // 1시간 동안 캐시 유지
  })

  useEffect(() => {
    if (isPresentationParticipantsSuccess && presentationParticipants) {
      console.log('참가자 목록', presentationParticipants)
      let totalCount = 0
      presentationParticipants.forEach((each) => {
        totalCount += each.users.length
      })
      console.log('👍🏻totalCount - in SessionInitializer', totalCount)
      totalCount !== 0
        ? setTargetConnectionCount(totalCount)
        : setTargetConnectionCount(2)
    }
  }, [isPresentationParticipantsSuccess, presentationParticipants])

  return (
    <div className="flex items-center justify-center w-full h-full">
      {isSuccess && token ? (
        <ConferenceContainer token={token as unknown as string} />
      ) : (
        <div>
          <span>세션 ID 또는 토큰이 없습니다.</span>
        </div>
      )}
    </div>
  )
}
export default SessionInitializer
