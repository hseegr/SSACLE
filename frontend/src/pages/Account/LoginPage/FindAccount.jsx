import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchFindEmail, fetchFindPassword } from '@/services/userService'
import { useMutation } from '@tanstack/react-query'

const EmailPage = () => {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('email')

  // 이메일 찾기용 상태
  const [studentNumber, setStudentNumber] = useState('') // 학번 입력값
  const [foundEmail, setFoundEmail] = useState('') // 조회된 이메일

  // 비밀번호 찾기용 상태
  const [pwStudentNumber, setPwStudentNumber] = useState('')
  const [pwEmail, setPwEmail] = useState('')
  const [pwResult, setPwResult] = useState('') // 서버에서 응답받은 문자열(성공 시 비밀번호 or 안내문)을 표시하기 위한 state

  // 로그인 페이지에서 전달된 `state.activeTab` 값이 있으면 반영
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab)
    }
  }, [location.state])

  // 이메일 찾기 뮤테이션
  const findEmailMutation = useMutation({
    mutationFn: fetchFindEmail,
    onSuccess: (response) => {
      if (response.status === 200) {
        setFoundEmail(response.data)
      }
    },
    onError: (error) => {
      console.error('❌ 이메일 찾기 실패:', error)
      setFoundEmail('') // 혹시 이전 상태가 남았으면 초기화
      const status = error?.response?.status
      if (status === 404) {
        alert('해당 학번으로 등록된 이메일을 찾을 수 없습니다.')
      } else if (status === 500) {
        alert('서버 에러가 발생했습니다.')
      } else {
        alert('이메일 찾기에 실패했습니다.')
      }
    },
  })

  // 비밀번호 찾기 뮤테이션
  const findPasswordMutation = useMutation({
    mutationFn: fetchFindPassword,
    onSuccess: (response) => {
      if (response.status === 200) {
        setPwResult(response.data)
      }
    },
    onError: (error) => {
      console.error('❌ 비밀번호 찾기 실패:', error)
      setPwResult('')
      // 서버에서 400, 404, 500을 내려줄 수 있으므로, 적절히 메시지 처리
      if (error?.response?.status === 400) {
        alert('이메일 혹은 학번이 잘못되었습니다.')
      } else if (error?.response?.status === 404) {
        alert('등록된 계정을 찾을 수 없습니다.')
      } else {
        alert('서버 에러가 발생했습니다.')
      }
    },
  })

  // "이메일 찾기" 버튼 클릭 시 실행할 함수
  const handleFindEmail = () => {
    if (!studentNumber.trim()) {
      alert('싸피 학번을 입력해주세요!')
      return
    }
    findEmailMutation.mutate({ studentNumber })
  }

  // 비밀번호 찾기 버튼
  const handleFindPassword = () => {
    if (!pwStudentNumber.trim() || !pwEmail.trim()) {
      return alert('학번과 이메일을 모두 입력해주세요!')
    }
    findPasswordMutation.mutate({
      studentNumber: pwStudentNumber,
      email: pwEmail,
    })
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex flex-col gap-4 w-[30rem] shrink-0 px-4">
        <h1 className="text-ssacle-blue text-3xl font-bold text-center mb-5">
          이메일 / 비밀번호 찾기
        </h1>

        {/* 탭 버튼 영역 */}
        <div className="flex border-b">
          <button
            className={`w-1/2 py-2 text-center ${
              activeTab === 'email'
                ? 'border-b-2 border-ssacle-blue text-ssacle-black text-base font-medium'
                : 'text-ssacle-gray text-base font-medium'
            }`}
            onClick={() => setActiveTab('email')}
          >
            이메일 찾기
          </button>
          <button
            className={`w-1/2 py-2 text-center ${
              activeTab === 'password'
                ? 'border-b-2 border-ssacle-blue text-ssacle-black text-base font-medium'
                : 'text-ssacle-gray text-base font-medium'
            }`}
            onClick={() => setActiveTab('password')}
          >
            비밀번호 찾기
          </button>
        </div>

        {activeTab === 'email' ? (
          <div className="flex flex-col gap-4">
            <input
              placeholder="싸피 학번을 입력 해주세요"
              className="w-full h-12 bg-ssacle-gray-sm rounded-full px-6
                           text-ssacle-blue text-base font-medium focus:outline-ssacle-blue"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
            />
            <button
              onClick={handleFindEmail}
              className="w-full h-12 bg-ssacle-blue rounded-full text-white text-xl font-bold"
            >
              이메일 찾기
            </button>

            {/* 이메일 찾기 결과 */}
            {foundEmail && (
              <div className="text-center text-ssacle-blue font-medium">
                찾으신 이메일: {foundEmail}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <input
              placeholder="싸피 학번을 입력 해주세요"
              className="w-full h-12 bg-ssacle-gray-sm rounded-full px-6
                           text-ssacle-blue text-base font-medium focus:outline-ssacle-blue"
              value={pwStudentNumber}
              onChange={(e) => setPwStudentNumber(e.target.value)}
            />
            <input
              placeholder="이메일을 입력해 주세요"
              className="w-full h-12 bg-ssacle-gray-sm rounded-full px-6
                           text-ssacle-blue text-base font-medium focus:outline-ssacle-blue"
              value={pwEmail}
              onChange={(e) => setPwEmail(e.target.value)}
            />
            <button
              onClick={handleFindPassword}
              className="w-full h-12 bg-ssacle-blue rounded-full text-white text-xl font-bold"
            >
              이메일 인증하기
            </button>

            {/* 비밀번호 찾기 결과 */}
            {pwResult && (
              <div className="text-center text-ssacle-blue font-medium">
                조회 결과: {pwResult}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailPage
