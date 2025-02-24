// @ts-nocheck
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

const SprintPresentationSession = ({ sprint }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  if (!sprint || !sprint.announceAt) return null

  const today = dayjs().startOf('day')
  const presentationDate = dayjs(sprint.announceAt).startOf('day')
  const dDay = presentationDate.diff(today, 'day')

  // 캐싱된 userId, nickname 가져오기
  const userData = queryClient.getQueryData(['validateToken'])
  const userId = userData?.id || ''
  const userNickname = userData?.nickname || ''

  const handlePresentation = () => {
    // if (!userId || !userNickname) {
    //   alert('사용자 정보가 없습니다. 로그인 후 다시 시도해주세요.')
    //   return
    // }
    navigate(
      `/presentation/ssaprint/${sprint.id}?userId=${userId}&username=${userNickname}`
    )
  }
  return (
    <div
      className={`p-4 shadow-md rounded-lg w-full transition ${
        dDay === 0 ? 'bg-blue-50' : 'bg-white'
      }`}
    >
      <h2 className="mt-2 mb-2 font-bold text-md">
        싸프린트 발표 & 질문/답변 세션
      </h2>
      <p className="text-sm text-gray-600">
        {presentationDate.format('YYYY년 M월 D일 A h시 ~')}
      </p>

      {/* D-Day & 입장 버튼 */}
      <div className="flex items-center justify-between mb-1 mt-7">
        <span className="font-bold text-blue-600 text-md">
          {dDay === 0 ? 'D-DAY' : `D-DAY ${dDay}`}
        </span>

        <button
          onClick={handlePresentation}
          className={`w-28 p-2 text-xs rounded-md transition ${
            dDay === 0
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
          disabled={dDay !== 0}
        >
          입장하기
        </button>
      </div>
    </div>
  )
}

export default SprintPresentationSession
