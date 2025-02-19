import { fetchLogout } from '@/services/userService'
import { Search, Lock, User, LogOut } from 'lucide-react'
import { useNavigate, Link, useLocation } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const accessToken = localStorage.getItem('accessToken')

  const handleLogout = async () => {
    try {
      await fetchLogout()
      localStorage.removeItem('accessToken')
      navigate('/', { replace: true })
    } catch (error) {
      console.error('로그아웃 실패:', error)
      alert('로그아웃 중 오류가 발생했습니다.')
    }
  }

  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <header className="sticky top-0 z-10 w-full mb-10 bg-white shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-8 lg:px-48 max-w-[1920px] mx-auto">
        {/* 로고 */}
        <Link
          to="/"
          className="text-3xl font-bold transition-transform text-ssacle-blue font-montserrat hover:scale-105"
        >
          SSACLE
        </Link>

        {/* 네비게이션 */}
        <nav className="hidden space-x-8 text-base font-medium md:flex lg:space-x-12 text-ssacle-black font-noto-sans-kr">
          <Link
            to="/ssaprint"
            className={`py-2 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-ssacle-blue after:transition-transform after:scale-x-0 hover:after:scale-x-100 ${
              isActive('/ssaprint') ? 'after:scale-x-100' : ''
            }`}
          >
            싸프린트
          </Link>
          <Link
            to="/board/edu"
            className={`py-2 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-ssacle-blue after:transition-transform after:scale-x-0 hover:after:scale-x-100 ${
              isActive('/board/edu') ? 'after:scale-x-100' : ''
            }`}
          >
            학습게시판
          </Link>
          <Link
            to="/board/note"
            className={`py-2 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-ssacle-blue after:transition-transform after:scale-x-0 hover:after:scale-x-100 ${
              isActive('/board/note') ? 'after:scale-x-100' : ''
            }`}
          >
            노트 구매
          </Link>
        </nav>

        {/* 아이콘 */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {accessToken ? (
            <>
              <button
                className="flex flex-col items-center justify-center p-2 transition-colors rounded-lg hover:bg-gray-100 group"
                onClick={handleLogout}
              >
                <LogOut
                  size={18}
                  className="text-gray-700 transition-colors group-hover:text-ssacle-blue"
                />
                <span className="mt-1 text-xs text-gray-700 transition-colors group-hover:text-ssacle-blue">
                  로그아웃
                </span>
              </button>
              <button
                className="flex flex-col items-center justify-center p-2 transition-colors rounded-lg hover:bg-gray-100 group"
                onClick={() => navigate('user/profile')}
              >
                <User
                  size={18}
                  className="text-gray-700 transition-colors group-hover:text-ssacle-blue"
                />
                <span className="mt-1 text-xs text-gray-700 transition-colors group-hover:text-ssacle-blue">
                  마이페이지
                </span>
              </button>
            </>
          ) : (
            <button
              className="flex flex-col items-center justify-center p-2 transition-colors rounded-lg hover:bg-gray-100 group"
              onClick={() => navigate('/account/login')}
            >
              <Lock
                size={18}
                className="text-gray-700 transition-colors group-hover:text-ssacle-blue"
              />
              <span className="mt-1 text-xs text-gray-700 transition-colors group-hover:text-ssacle-blue">
                로그인
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
