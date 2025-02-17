import { useQuery } from '@tanstack/react-query'
import { fetchSearchSsaprint } from '@/services/adminService'

const useSsaprintList = ({ categoryId, status, page, size = 100 }) => {
  console.log('🔍 useSsaprintList에서 요청 파라미터:', {
    categoryId,
    page,
    size,
  })
  return useQuery({
    queryKey: ['ssaprintList', categoryId, page, size],
    queryFn: async () => {
      // ✅ `size` 값 확인을 위해 console.log 추가
      console.log('🔍 최종 API 요청 size:', size)

      const [status0, status1, status2] = await Promise.all([
        fetchSearchSsaprint({
          categoryId,
          status: 0,
          page,
          size,
          sort: ['startAt', 'desc'],
        }),
        fetchSearchSsaprint({
          categoryId,
          status: 1,
          page,
          size,
          sort: ['startAt', 'desc'],
        }),
        fetchSearchSsaprint({
          categoryId,
          status: 2,
          page,
          size,
          sort: ['startAt', 'desc'],
        }),
      ])

      console.log('✅ 상태 0 응답 개수:', status0.content.length)
      console.log('✅ 상태 1 응답 개수:', status1.content.length)
      console.log('✅ 상태 2 응답 개수:', status2.content.length)
      console.log(
        '🔢 총 개수:',
        status0.content.length + status1.content.length + status2.content.length
      )

      return {
        totalElements:
          status0.totalElements + status1.totalElements + status2.totalElements,
        totalPages: Math.ceil(
          (status0.totalElements +
            status1.totalElements +
            status2.totalElements) /
            size
        ),
        content: [...status0.content, ...status1.content, ...status2.content],
      }
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  })
}

export default useSsaprintList
