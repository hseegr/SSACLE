import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchLunchInfo, fetchVoteLunch } from '@/services/mainService'

const SsabapVote = () => {
  const [hasVoted, setHasVoted] = useState(false)

  // 점심 메뉴 정보 조회
  const { data: lunchData, refetch: refetchLunchInfo } = useQuery({
    queryKey: ['lunch'],
    queryFn: fetchLunchInfo,
    retry: false,
    onSuccess: (data) => {
      // 응답 데이터에 votePercentage가 있으면 이미 투표한 것
      if (data && data[0]?.votePercentage !== undefined) {
        setHasVoted(true)
      }
    },
  })

  // 투표 mutation
  const { mutate: voteMutate } = useMutation({
    // 투표 API 호출
    mutationFn: (lunchId) => fetchVoteLunch(lunchId),
    onSuccess: async () => {
      // 투표 상태 업데이트트
      setHasVoted(true)
      // 투표 후 위의 점심 정보 제공하는 데이터 다시 불러오기 -> 투표율 응답 받기 위함
      await refetchLunchInfo()
    },
    onError: (error) => {
      console.error('투표 실패:', error)
      alert('투표에 실패했습니다. 다시 시도해주세요.')
    },
  })

  // 만약 응답 데이터가 없거나 유효하지 않은 경우 예외 처리
  if (!lunchData || !Array.isArray(lunchData) || lunchData.length === 0) {
    return <div>오늘의 메뉴 정보가 없습니다.</div>
  }

  // 메뉴 정보 추출
  const menu1 = lunchData[0]
  const menu2 = lunchData[1]

  return (
    <div>
      {/* 제목 영역 */}
      <p className="tracking-tighter text-xl font-bold text-ssacle-black mb-6 flex gap-2">
        오늘의 싸밥 🍚{' '}
        <span className="text-gray-500 text-base">{lunchData.date}</span>
      </p>

      {/* 투표 컨테이너 */}
      <div className="flex gap-2">
        {/* 첫 번째 메뉴 */}
        <div className="flex-1 flex flex-col items-center">
          <img
            src={menu1.imageUrl}
            alt={menu1.menuName}
            className="w-50 h-40 object-cover rounded-lg mb-3"
          />
          <button
            // 아직 투표하지 않았다면 요청
            onClick={() => !hasVoted && voteMutate(1)}
            className={`flex-1 w-full p-3 rounded-lg text-center font-medium ${
              // 투표율(votePercentage)이 존재하는지 확인 -> 투표율이 있다면 비교 후 더 높은 메뉴를 강조
              menu1.votePercentage !== undefined
                ? menu1.votePercentage > menu2.votePercentage
                  ? 'bg-blue-500 text-white'
                  : 'bg-ssacle-gray'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            // 투표율이 있으면 버튼 비활성화
            disabled={menu1.votePercentage !== undefined}
          >
            {/* 만약 투표율이 있다면 투표율*100 표기, 없다면 ? 표기 */}
            {menu1.votePercentage !== undefined
              ? `${menu1.votePercentage * 100}%`
              : '?'}
          </button>
          <p className="text-ssacle-black text-center mt-2 font-medium text-sm">
            {menu1.menuName}
          </p>
        </div>

        {/* VS 표시 */}
        <div className="flex items-center text-xl font-bold text-ssacle-blue">
          VS
        </div>

        {/* 두 번째 메뉴 */}
        <div className="flex-1 flex flex-col items-center">
          <img
            src={menu2.imageUrl}
            alt={menu2.menuName}
            className="w-50 h-40 object-cover rounded-lg mb-3"
          />
          <button
            onClick={() => !hasVoted && voteMutate(2)}
            className={`w-full p-3 rounded-lg text-center font-medium ${
              menu2.votePercentage !== undefined // votePercentage 존재 여부로 판단
                ? menu2.votePercentage > menu1.votePercentage
                  ? 'bg-blue-500 text-white'
                  : 'bg-ssacle-gray'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            disabled={menu2.votePercentage !== undefined}
          >
            {menu2.votePercentage !== undefined
              ? `${menu2.votePercentage * 100}%`
              : '?'}
          </button>
          <p className="text-ssacle-black text-center mt-2 font-medium text-sm">
            {menu2.menuName}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SsabapVote
