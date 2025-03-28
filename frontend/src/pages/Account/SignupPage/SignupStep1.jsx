import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { fetchSendVerification, fetchCheckCode } from '@/services/userService'
import { EmblaCarousel } from '@/components/Signup/Carousel'

const SignupStep1 = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [webhook, setWebhook] = useState('')
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('') // 인증 코드 확인
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [errorMessage, setErrorMessage] = useState('') // 오류 메시지 상태 유지

  // 인증 코드 요청 Mutation
  const sendCodeMutaion = useMutation({
    mutationFn: () => fetchSendVerification(email, webhook),
    onSuccess: () => {
      setShowCodeInput(true) // 성공 시 인증 코드 입력창 표시
      setErrorMessage('') // 성공하면 오류 메시지 초기화
    },
    onError: (error) => {
      setErrorMessage('인증 코드 전송에 실패했습니다. 다시 시도해주세요.') // 오류 메시지 출력
      console.error('❌ 인증 코드 전송 실패:', error)
    },
  })

  // // 인증 코드 확인 Mutation
  // const checkCodeMutation = useMutation({
  //   mutationFn: () => fetchCheckCode(email, verificationCode),
  //   onSuccess: () => {
  //     set
  //   }
  // })

  // 인증 코드 확인 Mutation
  const checkCodeMutation = useMutation({
    mutationFn: () => fetchCheckCode(email, verificationCode),
    onSuccess: () => {
      navigate('step2', { state: { email } }) // 인증 성공 시 step2로 이동
    },
    onError: (error) => {
      if (error.response?.status === 400) {
        setErrorMessage(
          '잘못된 인증 코드거나 만료된 코드입니다. 다시 입력해주세요.'
        ) // 400 오류 처리
      } else if (error.response?.status === 404) {
        setErrorMessage(
          '해당 이메일로 전송된 인증 코드가 없습니다. 다시 요청해주세요.'
        ) // 404 오류 처리
      } else {
        setErrorMessage('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.') // 500 오류 처리
      }
    },
  })

  // 인증 코드 요청 버튼 클릭 시 실행할 함수 (입력값 검증 추가)
  const handleSendVerification = () => {
    if (!webhook || !email) {
      setErrorMessage('웹훅 URL과 이메일을 모두 입력해주세요.') // 입력 검증 추가
      return
    }
    sendCodeMutaion.mutate() // 검증 통과 시 요청 실행
  }

  // 인증 코드 확인 버튼 클릭 시 실행할 함수
  const handleCheckVerificationCode = () => {
    if (!verificationCode) {
      setErrorMessage('인증 코드를 입력해주세요.')
      return
    }
    checkCodeMutation.mutate() // 인증 코드 검증 실행
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="min-w-[75rem] flex flex-col md:flex-row items-center justify-center gap-10">
        {/* 좌측 컨텐츠 - 캐러셀 적용 */}
        <EmblaCarousel />

        {/* 우측 회원가입 폼 */}
        <div className="min-w-[25rem] flex flex-col items-center">
          <h1 className="text-ssacle-blue text-3xl font-bold text-center mb-10">
            회원가입
          </h1>

          {/* 웹훅 URL 입력 필드 */}
          <input
            type="url"
            placeholder="Webhook URL"
            value={webhook}
            onChange={(e) => setWebhook(e.target.value)}
            className="w-full max-w-[400px] h-12 bg-ssacle-gray-sm rounded-full px-6 text-ssacle-blue text-medium text-base focus:outline-ssacle-blue mb-4"
          />

          {/* 이메일 입력 필드 */}
          <input
            type="email"
            placeholder="Mattermost에 가입한 이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full max-w-[400px] h-12 bg-ssacle-gray-sm rounded-full px-6 text-ssacle-blue text-medium text-base focus:outline-ssacle-blue mb-4"
          />

          {/* 오류 메시지 출력 (빨간색) */}
          {errorMessage && (
            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
          )}

          {/* 인증 코드 요청 버튼 */}
          <button
            className={`w-full max-w-[400px] h-12 rounded-full text-center text-xl font-bold mb-4 transition-colors duration-300 ${
              sendCodeMutaion.isPending
                ? 'bg-gray-400'
                : showCodeInput
                  ? 'bg-ssacle-sky text-ssacle-black font-medium text-sm'
                  : 'bg-ssacle-blue text-white'
            }`}
            onClick={handleSendVerification} // 입력값 검증 후 요청 실행
            disabled={sendCodeMutaion.isPending}
          >
            {sendCodeMutaion.isPending
              ? '전송 중...'
              : showCodeInput
                ? '인증 코드 재전송'
                : 'Mattermost로 인증 코드 받기'}
          </button>

          {/* 인증 코드 입력 필드 */}
          {showCodeInput && (
            <input
              type="text"
              placeholder="인증 코드를 입력하세요"
              className="w-full max-w-[400px] h-12 bg-ssacle-gray-sm rounded-full px-6 text-ssacle-blue text-base text-medium focus:outline-ssacle-blue mb-4"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          )}

          {showCodeInput && (
            <button
              className="w-full max-w-[400px] h-12 bg-ssacle-blue rounded-full px-6 text-white text-center text-xl font-bold mb-4"
              // onClick={() => navigate('step2', { state: { email } })}
              onClick={handleCheckVerificationCode}
            >
              SSAFY인 인증하기
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SignupStep1
