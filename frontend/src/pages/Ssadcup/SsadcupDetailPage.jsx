import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchSsadcupDetail } from '@/services/ssadcupService'
import SsadcupDetailLayout from '@/components/Ssadcup/SsadcupDetailLayout'

const SsadcupDetailPage = () => {
  const { sprintId } = useParams()

  const {
    data: sprintData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['ssadcupDetail', sprintId], // 캐싱을 위한 Key
    queryFn: () => fetchSsadcupDetail(sprintId), // API 호출 함수
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

  return <SsadcupDetailLayout sprintData={sprintData} />
}

export default SsadcupDetailPage
