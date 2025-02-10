import { useNavigate } from 'react-router-dom'

const SuccessPage = () => {
  const navigate = useNavigate()

  return (
    <div className="w-full h-screen bg-white flex-col justify-center items-center gap-4 inline-flex overflow-hidden">
      <div className="text-ssacle-black text-3xl font-medium font-sans">
        회원가입이 완료되었습니다!
      </div>
      <div>
        {/* 띄어쓰기 필요해서 빨간 줄 생겨요. */}
        <span className="text-ssacle-black text-xl font-sans">로그인하고, </span>
        <span className="text-ssacle-black text-xl font-medium font-sans">
          싸클
        </span>
        <span className="text-ssacle-black text-xl font-light font-sans">
          의 다양한 컨텐츠에 참여해 보세요.
        </span>
      </div>
      {/* 로그인 버튼 추가 */}
      <button
        className="mt-6 w-48 h-12 bg-ssacle-blue text-white text-xl font-bold rounded-full"
        onClick={() => navigate('/account/login')}
      >
        로그인
      </button>
    </div>
  )
}

export default SuccessPage
