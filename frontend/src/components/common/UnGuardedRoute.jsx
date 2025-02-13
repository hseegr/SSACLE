import { Navigate, Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import httpCommon from '@/services/http-common'

const UnGuardedRoute = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['checkAuth'],
    queryFn: async () => {
      try {
        const response = await httpCommon.get('/user/summary')
        // 인증된 사용자라면 메인 페이지로
        if (response.data?.nickname) {
          return true
        }
        return false
      } catch (error) {
        return false
      }
    },
    retry: false,
  })

  if (isLoading) {
    return <div>확인 중...</div>
  }

  // 인증된 사용자는 메인 페이지로, 아니면 로그인 페이지 접근 허용
  return data ? <Navigate to="/main" replace /> : <Outlet />
}

export default UnGuardedRoute
