import { fetchLogout } from '@/services/userService'
import { Search, Lock, User, LogOut, Cookie } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()
  const accessToken = localStorage.getItem('accessToken') // 로그인 여부 확인

  // 리프레시 토큰 삭제 함수
  // 기존 코드
  // const deleteCookie = (name) => {
  //   document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  // }
  // const handleLogout = () => {
  //   localStorage.removeItem('accessToken') // 액세스 토큰 삭제
  //   deleteCookie('refreshToken') // 리프레시 토큰 삭제
  //   window.location.reload() // 페이지 새로고침
  // }

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await fetchLogout() // 로그아웃 API 호출
      // 로컬에서 토큰 제거
      localStorage.removeItem('accessToken')
      // 페이지 새로고침 대신 홈으로 리다이렉트
      navigate('account/login')
    } catch (error) {
      console.error('로그아웃 실패:', error)
      alert('로그아웃 중 오류가 발생했습니다.')
    }
  }

  return (
    <header className="min-w-max z-10 fixed top-0 left-0 w-full h-12 px-48 py-4 bg-white shadow-sm flex justify-between items-center">
      {/* 로고 */}
      <Link
        to="/"
        className="text-ssacle-blue text-3xl font-bold font-montserrat"
      >
        SSACLE
      </Link>

      {/* 네비게이션 */}
      <nav className="flex space-x-12 text-ssacle-black text-base font-medium font-noto-sans-kr">
        <Link to="/ssaprint" className="hover:underline">
          싸프린트
        </Link>
        <Link to="/ssadcup" className="hover:underline">
          싸드컵
        </Link>
        <Link to="/board/edu" className="hover:underline">
          학습게시판
        </Link>
        <Link to="/board/free" className="hover:underline">
          자유게시판
        </Link>
      </nav>

      {/* 아이콘 */}
      <div className="flex space-x-6">
        <button className="w-5 h-5 flex justify-center items-center">
          <Search size={15} className="text-black" />
        </button>

        {accessToken ? (
          <button
            className="w-5 h-5 flex justify-center items-center"
            onClick={handleLogout}
          >
            <LogOut size={15} className="text-black" />
          </button>
        ) : (
          <button
            className="w-5 h-5 flex justify-center items-center"
            onClick={() => navigate('account/login')}
          >
            <Lock size={15} className="text-black" />
          </button>
        )}

        <button
          className="w-5 h-5 flex justify-center items-center"
          onClick={() => navigate('user/profile')}
        >
          <User size={15} className="text-black" />
        </button>
      </div>
    </header>
  )
}

export default Header
