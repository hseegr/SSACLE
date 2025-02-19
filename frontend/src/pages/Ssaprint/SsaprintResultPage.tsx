import { FC } from 'react'

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
  // Sample data. In practice you might get these via API or state management.
  const defaultResults: RankingResult[] = [
    { userId: '1234211', username: '박창조', score: 200 },
    { userId: '3231231', username: '홍길동', score: 150 },
    { userId: '1233213', username: '김철수', score: 120 },
  ]

  // Use passed results if available, otherwise default results.
  const rankingResults: RankingResult[] =
    results && results.length >= 3 ? results : defaultResults

  // Ensure the ranking is sorted in descending order by score.
  rankingResults.sort((a, b) => b.score - a.score)

  return (
    <div className="flex flex-col items-center justify-center p-6 ">
      <h1 className="mb-12 text-4xl font-extrabold text-gray-800 animate-fade-in-down">
        최종 평가 결과
      </h1>
      <div className="flex flex-col w-full max-w-lg gap-8">
        {/* 1등 */}
        <div className="relative flex items-center p-8 overflow-hidden transition-all duration-300 transform border-4 border-yellow-500 shadow-2xl animate-slide-in-left bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-2xl hover:scale-105 group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600" />
          <div className="mr-6 text-7xl animate-bounce-gentle">🥇</div>
          <div className="flex-1">
            <div className="mb-2 text-3xl font-extrabold text-yellow-700 transition-colors group-hover:text-yellow-800">
              {rankingResults[0].username}
            </div>
            <div className="flex items-center gap-2 text-xl text-gray-700">
              <span className="font-semibold">득점:</span>
              <span className="text-2xl font-bold text-yellow-600 animate-score-pop">
                {rankingResults[0].score}
              </span>
            </div>
          </div>
          <div className="absolute w-40 h-40 bg-yellow-200 rounded-full -right-20 -bottom-20 opacity-20" />
        </div>

        {/* 2등 */}
        <div className="relative flex items-center p-6 transition-all duration-300 transform border-2 border-gray-200 shadow-lg animate-slide-in-right bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-xl hover:scale-102 group">
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
        </div>

        {/* 3등 */}
        <div className="relative flex items-center p-6 transition-all duration-300 transform border-2 border-gray-200 shadow-lg animate-slide-in-left bg-gradient-to-r from-orange-50 to-white rounded-xl hover:shadow-xl hover:scale-102 group">
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
        </div>
      </div>
    </div>
  )
}

export default SsaprintResultPage
