import { Button } from '@/components/ui/button'
import { PresentationParticipants } from '@/interfaces/user.interface'
import { useQueryClient } from '@tanstack/react-query'
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

const SsaprintResultPage: FC<SsaprintResultPageProps> = ({ results }) => {
  const navigate = useNavigate()
  const { roomId } = useParams()

  const defaultResults: RankingResult[] = [
    { userId: '1234211', username: '난 말하는 감자', score: 200 },
  ]
  const queryClient = useQueryClient()
  const presentationParticipants = queryClient.getQueryData<
    PresentationParticipants[]
  >(['presentation-participants'])

  console.log(presentationParticipants)

  const targetParticipants =
    (presentationParticipants && presentationParticipants[0].name) ??
    '난 말하는 감자'

  // Use passed results if available, otherwise default results.
  const rankingResults: RankingResult[] =
    results && results.length >= 3 ? results : defaultResults

  // Ensure the ranking is sorted in descending order by score.
  rankingResults.sort((a, b) => b.score - a.score)

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
              {targetParticipants}
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

        {/* 2등 */}
        {/* <div className="relative flex items-center p-6 transition-all duration-300 transform border-2 border-gray-200 shadow-lg animate-slide-in-right bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-xl hover:scale-102 group">
          <div className="mr-6 text-6xl animate-bounce-gentle-delay">🥈</div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-gray-800 transition-colors group-hover:text-gray-900">
              {rankingResults[1].username}
            </div>
            <div className="flex items-center gap-2 text-lg text-gray-600">
              <span>득점:</span>
              <span className="text-xl font-semibold">
                {rankingResults[1].score}
              </span>
            </div>
          </div>
        </div> */}

        {/* 3등 */}
        {/* <div className="relative flex items-center p-6 transition-all duration-300 transform border-2 border-gray-200 shadow-lg animate-slide-in-left bg-gradient-to-r from-orange-50 to-white rounded-xl hover:shadow-xl hover:scale-102 group">
          <div className="mr-6 text-6xl animate-bounce-gentle-delay-more">
            🥉
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-gray-800 transition-colors group-hover:text-gray-900">
              {rankingResults[2].username}
            </div>
            <div className="flex items-center gap-2 text-lg text-gray-600">
              <span>득점:</span>
              <span className="text-xl font-semibold">
                {rankingResults[2].score}
              </span>
            </div>
          </div>
        </div> */}
        <div className="flex items-center justify-center mt-10">
          <Button
            onClick={() => {
              navigate(`/my-sprints/${roomId}`, {
                state: { sprintId: roomId, teamId: 1 },
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
