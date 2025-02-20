import React from 'react'
import { useQuery } from '@tanstack/react-query'
import httpCommon from '@/services/http-common'
import { User } from '@/interfaces/user.interface'

import { Outlet } from 'react-router-dom'
import MypageLayout from '@/components/layout/MypageLayout'

const MyPage: React.FC = () => {
  // 실제 구현시에는 API나 전역 상태에서 사용자 정보를 가져와야 합니다

  const { data: userInfo } = useQuery<User>({
    queryKey: ['userInfo'],
    queryFn: async () => {
      return await httpCommon.get('/user/summary').then((res) => res.data)
    },
    staleTime: 1000 * 60 * 60, // 1시간 동안 캐시 유지
    gcTime: 1000 * 60 * 60, // 1시간 동안 캐시 유지
  })

  return (
    <MypageLayout>
      <Outlet />
    </MypageLayout>
  )
}

export default MyPage
