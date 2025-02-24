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
import { useQuery, useQueryClient } from '@tanstack/react-query'
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
      // const sessionId = await fetchSessionId(roomId ?? 'test-session-id')
      // const token = await fetchToken(sessionId)
      // return token
      const serverToken = await fetchServerToken(roomId ?? 'test-session-id')
      return serverToken // 실제 데이터만 반환
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

  // const queryClient = useQueryClient()
  // const testData = queryClient.getQueryData(['presentation-participants'])
  // console.log('👍🏻testData', testData)

  useEffect(() => {
    if (isPresentationParticipantsSuccess) {
      if (presentationParticipants) {
        console.log('참가자 목록', presentationParticipants)
        let totalCount = 0
        presentationParticipants.forEach((each) => {
          totalCount += each.users.length
        })
        console.log('👍🏻totalCount - in SessionInitializer', totalCount)

        if (totalCount !== 0) {
          setTargetConnectionCount(totalCount)
        } else {
          console.log('👍🏻참여자 목록 없어서 기본값 2 설정')
          setTargetConnectionCount(2)
        }
      }
    } else {
      console.log('presentationParticipants 에러로 기본값 2 설정')
      setTargetConnectionCount(2)
    }
  }, [isPresentationParticipantsSuccess, presentationParticipants])

  // 컴포넌트 언마운트 시 미디어 트랙 정리를 위한 cleanup 함수
  useEffect(() => {
    return () => {
      // 모든 미디어 트랙을 찾아서 정리
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((stream) => {
          stream.getTracks().forEach((track) => {
            track.stop()
          })
        })
        .catch((error) => {
          console.log('Media cleanup error:', error)
        })
    }
  }, [])

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
