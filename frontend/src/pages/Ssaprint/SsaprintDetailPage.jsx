import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchSsaprintDetail } from '@/services/ssaprintService'
import SsaprintDetailLayout from '@/components/Ssaprint/SsaprintDetailLayout'

const SsaprintDetailPage = () => {
  const { sprintId } = useParams()

  // TanStack Query 적용 (자동 캐싱 & 상태 관리)
  const {
    data: sprintData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['ssaprintDetail', sprintId], // 캐싱을 위한 Key
    queryFn: () => fetchSsaprintDetail(sprintId), // API 호출 함수
    retry: 2, // 실패 시 최대 2번 재시도
  })

  if (isLoading) {
    // return <p className="text-center text-gray-500">로딩 중...</p>
  }

  if (isError || !sprintData) {
    return (
      <p className="text-center text-red-500">데이터를 불러오지 못했습니다.</p>
    )
  }

  return <SsaprintDetailLayout sprintData={sprintData} />
}

export default SsaprintDetailPage
