import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div className="w-full h-screen">
      <div className="flex flex-col items-center justify-center w-full h-full gap-8 p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="font-bold tracking-tight text-8xl animate-pulse text-ssacle-blue font-EN">
            404
          </h1>
          <h2 className="text-2xl font-bold text-ssacle-black font-KR">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-base text-gray-600 whitespace-pre-line font-KR">
            요청하신 페이지가 존재하지 않거나 잘못된 경로입니다.
          </p>
        </div>

        <div className="px-4 md:px-20 animate-bounce hover:animate-none">
          <button
            onClick={handleGoHome}
            className="px-8 py-2 md:py-3 text-white transition-all duration-300 rounded-full bg-ssacle-blue hover:bg-ssacle-blue/80 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <span className="text-base font-medium md:text-lg font-KR ">
              홈으로 돌아가기
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
