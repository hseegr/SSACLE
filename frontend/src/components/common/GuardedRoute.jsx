import { useState, useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import httpCommon from '@/services/http-common'

const GuardedRoute = () => {
  const [isValidating, setIsValidating] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const queryClient = useQueryClient()

  // 컴포넌트 마운트 시 validateToken 쿼리 초기화
  // useEffect(() => {
  //   queryClient.removeQueries(['validateToken'])
  // }, [])

  const { data, isLoading } = useQuery({
    queryKey: ['validateToken'],
    queryFn: async () => {
      try {
        const response = await httpCommon.get('/user/summary')
        // 응답에서 닉네임을 저장
        if (response.data && response.data.nickname) {
          localStorage.setItem('userNickname', response.data.nickname)
        }
        return response.data
      } catch (error) {
        console.warn('인증 실패: 토큰 삭제 후 로그인 페이지로 이동')

        // 403 발생 시 자동 로그아웃 처리
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userNickname')
        // navigate('/account/login', { replace: true })

        return false
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 60, // 1시간
    gcTime: 1000 * 60 * 60 * 24, // 1일
  })

  useEffect(() => {
    setIsValidating(true)

    if (!isLoading) {
      // 데이터와 저장된 닉네임 모두 확인
      const hasNickname = !!localStorage.getItem('userNickname')
      setIsAuthenticated(data && hasNickname)
      setIsValidating(false)
    }
  }, [data, isLoading])

  if (isValidating) {
    return
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/account/login" replace />
}

export default GuardedRoute
