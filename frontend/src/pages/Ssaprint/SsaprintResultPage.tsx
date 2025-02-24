import { Button } from '@/components/ui/button'
import { PresentationParticipants, User } from '@/interfaces/user.interface'
import httpCommon from '@/services/http-common'
import { fetchPresentationParticipants } from '@/services/presentationService'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface RankingResult {
  userId: string
  username: string
  score: number
}

interface SsaprintResultPageProps {
  // Optionally, you can pass the results in as props.
  // If not provided, sample data will be used.
  results?: RankingResult[]
}

const DEFAULT_TARGET_PARTICIPANT = {
  id: 29,
  name: '열정 2배!',
  point: 0,
  users: [
    {
      id: 9,
      nickname: '열정 두배요',
      level: 1,
      pickles: 300,
      profile: null,
      categoryNames: null,
    },
  ],
}

const SsaprintResultPage: FC<SsaprintResultPageProps> = ({ results }) => {
  const navigate = useNavigate()
  const { sprintId } = useParams()

  const defaultResults: RankingResult[] = [
    { userId: '1234211', username: '난 말하는 감자', score: 200 },
  ]

  const {
    data: presentationParticipants,
    isSuccess: isPresentationParticipantsSuccess,
  } = useQuery<PresentationParticipants[]>({
    queryKey: ['presentation-participants'],
    queryFn: () => fetchPresentationParticipants(sprintId ?? 'test-session-id'),
    staleTime: 1000 * 60 * 5, // 10분 동안 캐시 유지
    refetchInterval: 1000 * 5, // 10초 동안 캐시 유지
    enabled: !!sprintId,
  })

  const { data: userInfo } = useQuery<User>({
    queryKey: ['userInfo'],
    queryFn: async () => {
      return await httpCommon.get('/user/summary').then((res) => res.data)
    },
    staleTime: 1000 * 60 * 60, // 1시간 동안 캐시 유지
    gcTime: 1000 * 60 * 60, // 1시간 동안 캐시 유지
  })
  // const queryClient = useQueryClient()
  // const presentationParticipants = queryClient.getQueryData<
  //   PresentationParticipants[]
  // >(['presentation-participants'])

  // 1등 팀 정보
  const targetParticipant =
    (presentationParticipants && presentationParticipants[0]) ??
    DEFAULT_TARGET_PARTICIPANT

  // 내 팀 정보
  const myTeamId = presentationParticipants?.find((participant) =>
    participant.users.some((user) => user.id === userInfo?.id)
  )?.id

  return (
    <div className="flex flex-col items-center justify-center gap-10 p-6 py-32">
      <div className="flex flex-col items-center gap-5 ">
        <h1 className="text-4xl font-extrabold text-gray-800 animate-fade-in-down">
          🎊 최종 결과 🎉
        </h1>
        <span className="text-2xl font-bold text-gray-800">
          축하합니다! 최종 결과는 다음과 같습니다.
        </span>
      </div>
      <div className="flex flex-col w-full max-w-lg gap-8">
        {/* 1등 */}
        <div className="relative flex items-center p-8 overflow-hidden transition-all duration-300 transform border-4 border-yellow-500 shadow-2xl animate-slide-in-left bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-2xl hover:scale-105 group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600" />
          <div className="mr-6 text-7xl animate-bounce-gentle">🥇</div>
          <div className="flex-1">
            <div className="mb-2 text-3xl font-extrabold text-yellow-700 transition-colors group-hover:text-yellow-800">
              {targetParticipant.name}
            </div>
            <div className="flex items-center gap-2 text-xl text-gray-700">
              <span className="font-semibold">보상 </span>
              <span className="text-2xl font-bold text-yellow-600 animate-score-pop">
                피클 🥒 100개
              </span>
            </div>
          </div>
          <div className="absolute w-40 h-40 bg-yellow-200 rounded-full -right-20 -bottom-20 opacity-20" />
        </div>

        <div className="flex items-center justify-center mt-10">
          <Button
            onClick={() => {
              navigate(`/my-sprints/${sprintId}`, {
                state: { sprintId, teamId: myTeamId },
              })
            }}
            className="w-2/3 px-10 py-6 text-lg rounded-full bg-ssacle-blue hover:bg-ssacle-blue/80"
          >
            싸프린트 페이지로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SsaprintResultPage
