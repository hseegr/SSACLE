import { useNavigate } from 'react-router-dom'
import startPageImage from '@/assets/images/startPage_image.png'
import { useEffect } from 'react'
const StartPage = () => {
  const navigate = useNavigate()

  const isLoggedIn = localStorage.getItem('accessToken')

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/main')
    }
  }, [isLoggedIn, navigate])

  const handleStart = () => {
    if (confirm('로그인 페이지로 이동합니다.')) {
      navigate('/account/login')
    }
  }
  return (
    <div className="w-full h-screen ">
      <div className="flex flex-col items-center justify-center w-full h-full gap-4 p-4 md:gap-8 md:flex-row md:px-20">
        {/* 왼쪽 영역 */}
        <section className="flex-1 h-full max-h-[30vh] md:max-h-full">
          <div className="flex flex-col justify-center h-full animate-slide-in-left">
            <img
              className="object-contain w-full h-full"
              src={startPageImage}
              alt="SSA Logo"
            />
          </div>
        </section>
        {/* 오른쪽 영역 */}
        <section className="h-full basis-2/5">
          <div className="flex flex-col justify-center h-full gap-8 md:gap-12 lg:gap-24">
            <div className="flex flex-col items-center justify-center gap-4 md:gap-6">
              <div className="flex items-center gap-2 text-center animate-fade-in-down">
                <p className="text-lg font-bold md:text-2xl lg:text-3xl">
                  <span className="text-ssacle-blue font-EN">SSA</span>
                  <span className="text-ssacle-black font-EN">FY</span>
                </p>
                <span className="text-sm text-gray-600 md:text-base font-KR ">
                  교육생만을 위한 학습 플랫폼
                </span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight delay-500 md:text-6xl lg:text-8xl animate-fade-in-down">
                <span className="text-ssacle-blue font-EN">SSA</span>
                <span className="text-ssacle-black font-EN">CLE</span>
              </h1>
              <div className="flex flex-col gap-3">
                <div className="relative overflow-hidden">
                  <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/0 to-white/20 animate-shine" />
                  <p className="pr-5 overflow-hidden text-lg font-medium border-r-4 md:text-lg lg:text-xl animate-typing-first whitespace-nowrap border-r-ssacle-blue font-KR">
                    개인부터 팀까지, 개념부터 심화까지, 질문부터 취업 후기까지!
                  </p>
                </div>
                <div className="relative overflow-hidden">
                  <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/0 to-white/20 animate-shine delay-[1500ms]" />
                  <p className="pr-5 overflow-hidden text-lg font-medium border-r-4 md:text-lg lg:text-xl animate-typing-second whitespace-nowrap border-r-ssacle-blue font-KR text-ssacle-blue">
                    이 모든 걸 하나로 통합하고 관리해요.
                  </p>
                </div>
              </div>
            </div>
            <div className="px-4 md:px-20 lg:px-36">
              <button
                className="w-full py-2 md:py-3  animate-in text-white transition-all duration-300 rounded-full bg-ssacle-blue hover:bg-ssacle-blue/80 hover:shadow-lg transform hover:-translate-y-0.5 min-w-[200px]"
                onClick={handleStart}
              >
                <span className="text-base font-medium md:text-lg font-KR">
                  시작하기
                </span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
export default StartPage
