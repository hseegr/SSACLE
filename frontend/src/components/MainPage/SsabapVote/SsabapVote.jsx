import { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  fetchLunchInfo,
  fetchVoteLunch,
  fetchLunchVoteResult,
} from '@/services/mainService'

const SsabapVote = () => {
  const [hasVoted, setHasVoted] = useState(false)

  // 점심 메뉴 정보 조회
  const {
    data: lunchData,
    isLoading: isLunchLoading,
    isError: isLunchError,
    error: lunchError,
  } = useQuery({
    queryKey: ['lunch'],
    queryFn: fetchLunchInfo,
    retry: false,
  })

  // 점심 메뉴 정보 조회 -> 디버깅 용
  // const {
  //   data: lunchData = { date: '', menu: [] }, // 기본값 설정
  //   isLoading: isLunchLoading,
  //   isError: isLunchError,
  //   error: lunchError,
  // } = useQuery({
  //   queryKey: ['lunch'],
  //   queryFn: fetchLunchInfo,
  //   retry: false,
  // })

  // 투표 결과 조회
  const {
    data: voteResult,
    isError: isVoteResultError,
    error: voteResultError,
    refetch: refetchVoteResult,
  } = useQuery({
    queryKey: ['lunchVoteResult'],
    queryFn: fetchLunchVoteResult,
    enabled: hasVoted,
    retry: false,
  })

  // 투표 mutation
  // 기존 코드
  const { mutate: voteMutate } = useMutation({
    mutationFn: (lunchId) => fetchVoteLunch({ lunch_id: lunchId }),
    onSuccess: () => {
      setHasVoted(true)
      refetchVoteResult()
    },
    onError: (error) => {
      console.error('투표 실패:', error)
      alert('투표에 실패했습니다. 다시 시도해주세요.')
    },
  })

  // 투표 mutation
  // 디버깅 코드
  // const { mutate: voteMutate } = useMutation({
  //   mutationFn: (lunchId) => {
  //     console.log('Voting with data:', { lunch_id: lunchId })
  //     return fetchVoteLunch({ lunch_id: lunchId })
  //   },
  //   onSuccess: (data) => {
  //     console.log('Vote success:', data)
  //     setHasVoted(true)
  //     refetchVoteResult()
  //   },
  //   onError: (error) => {
  //     console.error('Vote error details:', error)
  //     alert('투표에 실패했습니다. 다시 시도해주세요.')
  //   },
  // })

  // 디버깅용 코드
  // 메뉴 데이터 확인
  useEffect(() => {
    if (lunchData) {
      console.log('Current lunch data:', lunchData)
    }
  }, [lunchData])

  // 투표 처리 함수
  const handleVote = (lunchId) => {
    if (hasVoted) return
    // 디버깅 코드
    console.log('Handling vote for lunch ID:', lunchId)
    voteMutate(lunchId)
  }

  // 투표 결과 계산 (백분율)
  const getVotePercentage = (lunchId) => {
    if (!voteResult || !Array.isArray(voteResult)) return 0

    const result = voteResult.find(
      (item) => Number(item.lunchId) === Number(lunchId)
    )
    return result ? Math.round(result.votes * 100) : 0
  }

  // 로딩 상태 처리
  if (isLunchLoading) {
    return <div>Loading...</div>
  }

  // 에러 상태 처리
  if (isLunchError) {
    return <div>Error: {lunchError.message}</div>
  }

  if (isVoteResultError && hasVoted) {
    return <div>Error loading vote results: {voteResultError.message}</div>
  }

  // 오늘의 메뉴가 없는 경우
  if (
    !lunchData ||
    !Array.isArray(lunchData.menu) ||
    lunchData.menu.length === 0
  ) {
    return <div>오늘의 메뉴 정보가 없습니다.</div>
  }

  const menu1 = lunchData.menu[0]
  const menu2 = lunchData.menu[1]

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
            onClick={() => handleVote(menu1.id)}
            className={`flex-1 w-full p-3 rounded-lg text-center font-medium ${
              hasVoted
                ? getVotePercentage(menu1.id) > getVotePercentage(menu2.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-ssacle-gray'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            disabled={hasVoted}
          >
            {hasVoted ? `${getVotePercentage(menu1.id)}%` : '?'}
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
            onClick={() => handleVote(menu2.id)}
            className={`w-full p-3 rounded-lg text-center font-medium ${
              hasVoted
                ? getVotePercentage(menu2.id) > getVotePercentage(menu1.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-ssacle-gray'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            disabled={hasVoted}
          >
            {hasVoted ? `${getVotePercentage(menu2.id)}%` : '?'}
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
