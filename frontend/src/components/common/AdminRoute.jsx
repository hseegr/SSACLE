import { Navigate, Outlet } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

const AdminRoute = () => {
  const authContext = useContext(AuthContext) // `role`을 직접 구조 분해 할당하지 않음

  const { role } = authContext // 여기서 구조 분해 할당
  if (role === null) return <p>로딩 중...</p> // role을 가져오기 전 로딩 표시

  return role === 'ADMIN' ? <Outlet /> : <Navigate to="/main" replace />
}

export default AdminRoute
