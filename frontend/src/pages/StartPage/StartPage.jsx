import { useNavigate } from 'react-router-dom'
// @ts-ignore
import startPageImage from '@/assets/images/startPage_image.png'
const StartPage = () => {
  const navigate = useNavigate()

  const handleStart = () => {
    alert('준비중입니다.')
    // navigate('/account/login')
  }
  return (
    <div className="w-full h-screen bg-gradient-to-br from-white to-blue-50">
      <div className="flex flex-col items-center justify-center w-full h-full gap-4 p-4 md:gap-8 md:flex-row md:px-20">
        {/* 왼쪽 영역 */}
        <section className="flex-1 h-full max-h-[30vh] md:max-h-full">
          <div className="flex flex-col justify-center h-full">
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
              <div className="flex items-center gap-2 text-center">
                <p className="text-lg font-bold md:text-2xl lg:text-3xl">
                  <span className="text-ssacle-blue">SSA</span>
                  <span className="text-ssacle-black">FY</span>
                </p>
                <span className="text-sm text-gray-600 md:text-base">
                  교육생만을 위한 학습 플랫폼
                </span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-8xl">
                <span className="text-ssacle-blue">SSA</span>
                <span className="text-ssacle-black">CLE</span>
              </h1>
              <pre className="text-xs text-center text-gray-700 whitespace-pre-line md:text-base lg:text-lg">
                개인부터 팀까지, 개념부터 심화까지, 질문부터 취업 후기까지 이
                모든 걸 하나로 통합하고 관리해요.
              </pre>
            </div>
            <div className="px-4 md:px-20 lg:px-36">
              <button
                className="w-full py-2 md:py-3 text-white transition-all duration-300 rounded-full bg-ssacle-blue hover:bg-ssacle-blue/80 hover:shadow-lg transform hover:-translate-y-0.5 min-w-[200px]"
                onClick={handleStart}
              >
                <span className="text-base font-medium md:text-lg">
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
