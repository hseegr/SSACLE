import { useQuery } from '@tanstack/react-query'
import { fetchSearchSsaprint } from '@/services/adminService'

const useSsaprintList = ({ categoryId, status, page, size = 10 }) => {
  return useQuery({
    queryKey: ['ssaprintList', categoryId, status, page, size],
    queryFn: () => fetchSearchSsaprint({ categoryId, status, page, size }),
    keepPreviousData: true, // 페이지네이션 시 기존 데이터 유지
    staleTime: 1000 * 60 * 5 // 5분 동안 캐싱 유지
  })
}

export default useSsaprintList
