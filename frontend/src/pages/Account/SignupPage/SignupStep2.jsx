import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  fetchCheckNickname,
  fetchCheckNumber,
  fetchSignup,
} from '@/services/userService'

const SignupStep2 = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const confirmPasswordRef = useRef(null)

  // 학번 상태
  const [studentNumber, setStudentNumber] = useState('')
  const [isStudentNumberValid, setIsStudentNumberValid] = useState(null) // 학번 인증 상태 (null: 미확인)

  // 이름 상태
  const [name, setName] = useState('')

  // 닉네임 상태
  const [nickname, setNickname] = useState('')
  const [isNicknameValid, setIsNicknameValid] = useState(false) // 닉네임 인증 상태

  // 비밀번호 상태
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false) // 비밀번호 불일치 메시지

  // 약관 동의 상태
  const [termsChecked, setTermsChecked] = useState(false)
  const [privacyChecked, setPrivacyChecked] = useState(false)
  const [termsError, setTermsError] = useState(false)

  // Step1에서 받아온 이메일
  const email = location.state?.email || ''

  // 닉네임 중복 확인 Mutation
  const nicknameMutation = useMutation({
    mutationFn: () => fetchCheckNickname(nickname),
    onSuccess: (data) => {
      if (data) {
        alert('이미 사용 중인 닉네임입니다.')
        setIsNicknameValid(false)
      } else {
        setIsNicknameValid(true)
      }
    },
    onError: (error) => {
      console.error('닉네임 중복 확인 상태:', error)
      alert('닉네임 확인 중 오류가 발생했습니다. 다시 시도해주세요.')
    },
  })

  // 학번 중복 확인 Mutation
  const studentNumberMutation = useMutation({
    mutationFn: () => fetchCheckNumber(studentNumber),
    onSuccess: (data) => {
      if (data?.isDuplicate) {
        setIsStudentNumberValid(false) // 중복됨
      } else {
        setIsStudentNumberValid(true) // 사용 가능
      }
    },
    onError: (error) => {
      console.error('학번 중복 확인 오류:', error)
      alert('학번 확인 중 오류가 발생했습니다. 다시 시도해주세요.')
    },
  })

  // 회원가입 Mutation
  const signupMutation = useMutation({
    mutationFn: () =>
      fetchSignup({
        studentNumber,
        email,
        nickname,
        name,
        password,
        confirmPassword,
      }),
    onSuccess: () => {
      alert('회원가입이 완료되었습니다.')
      navigate('/account/signup/interest')
    },
    onError: (error) => {
      console.error('회원가입 실패:', error)
      alert('회원가입에 실패했습니다. 다시 시도해주세요.')
    },
  })

  // 비밀번호 확인 함수
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
    setPasswordError(password && e.target.value && password !== e.target.value)
  }

  const handleSignup = () => {
    // 🔥 필수 입력값 체크
    if (!studentNumber) {
      alert('학번을 입력해주세요.')
      return
    }
    if (!isStudentNumberValid) {
      alert('학번 중복 확인을 해주세요.')
      return
    }
    if (!name) {
      alert('이름을 입력해주세요.')
      return
    }
    if (!nickname) {
      alert('닉네임을 입력해주세요.')
      return
    }
    if (!isNicknameValid) {
      alert('닉네임 중복 확인을 해주세요.')
      return
    }
    if (!password || !confirmPassword) {
      setPasswordError(true)
      confirmPasswordRef.current.focus()
      return
    }
    if (password !== confirmPassword) {
      setPasswordError(true)
      confirmPasswordRef.current?.focus()
      return
    }
    if (!termsChecked || !privacyChecked) {
      setTermsError(true)
      return
    }

    // 🔥 회원가입 API 실행
    signupMutation.mutate()
  }

  return (
    <>
      <div className="w-full h-auto flex justify-center items-center mt-24">
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-6 col-start-4">
            <h1 className="text-ssacle-blue text-3xl font-bold text-center mb-10">
              회원가입
            </h1>
            <p className="w-full border-b-4 border-ssacle-gray-sm mb-6 text-ssacle-gray text-xs text-right ">
              *표시는 필수 입력 항목입니다.
            </p>
            <div className="grid grid-cols-6 gap-4">
              {/* 학번 */}
              <label className="col-span-2 text-ssacle-black text-xl font-medium py-2">
                학번 *
              </label>
              <input
                type="text"
                placeholder="학번을 입력하세요."
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                className="col-span-3 col-start-3 h-12 bg-ssacle-gray-sm rounded-full flex items-center px-6 text-base text-ssacle-blue focus:outline-ssacle-blue mb-4"
              />
              <button
                className="col-span-1 col-start-6 h-12 bg-ssacle-blue rounded-full text-white text-base font-bold mb-4"
                onClick={() => studentNumberMutation.mutate()} //
                disabled={studentNumberMutation.isLoading} //
              >
                {studentNumberMutation.isLoading ? '확인 중...' : '중복확인'}
              </button>

              {/* 학번 인증 결과 메시지 */}
              {isStudentNumberValid === true && (
                <p className="col-span-4 col-start-3 text-ssacle-blue text-sm">
                  인증이 완료되었습니다.
                </p>
              )}
              {isStudentNumberValid === false && (
                <p className="col-span-4 col-start-3 text-red-500 text-sm">
                  이미 아이디가 존재합니다.
                </p>
              )}

              {/* 이메일 */}
              <label className="col-span-2 text-ssacle-black text-xl font-medium py-2">
                이메일 *
              </label>
              <div className="col-span-4 col-start-3">
                <input
                  type="email"
                  value={email}
                  disabled // 🔥 이메일은 변경 불가능하게 설정
                  className="h-12 w-full bg-ssacle-gray-sm rounded-full px-6 text-lg text-ssacle-black cursor-not-allowed"
                />
                <p className="text-ssacle-blue text-sm mt-1 mb-4">
                  인증이 완료되었습니다.
                </p>
              </div>
            </div>
            <div className="border-b-2 border-ssacle-gray-sm my-6" />

            {/* 이름 입력 */}
            <div className="grid grid-cols-6 gap-4">
              <label className="col-span-2 text-ssacle-black text-xl font-medium py-2">
                이름 *
              </label>
              <input
                type="text"
                placeholder="이름을 입력하세요."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-4 col-start-3 h-12 bg-ssacle-gray-sm rounded-full flex items-center px-6 text-base text-ssacle-blue focus:outline-ssacle-blue mb-4"
              />
            </div>

            {/* 닉네임 입력 */}
            <div className="grid grid-cols-6 gap-4">
              <label className="col-span-2 text-ssacle-black text-xl font-medium py-2">
                닉네임 *
              </label>
              <input
                type="text"
                placeholder="사용할 닉네임을 입력해 주세요."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="col-span-3 col-start-3 h-12 bg-ssacle-gray-sm rounded-full flex items-center px-6 text-base text-ssacle-blue focus:outline-ssacle-blue mb-4"
              />

              <button
                className="col-span-1 col-start-6 h-12 bg-ssacle-blue rounded-full text-white text-base font-bold mb-4"
                onClick={() => nicknameMutation.mutate()} // ✅ 닉네임 중복 확인 실행
                disabled={nicknameMutation.isLoading} // 로딩 중이면 버튼 비활성화
              >
                {nicknameMutation.isLoading ? '확인 중...' : '중복확인'}
              </button>
            </div>
            <div className="border-b-2 border-ssacle-gray-sm my-6" />

            <div className="grid grid-cols-6 gap-4">
              {/* 비밀번호 입력 */}
              <label className="col-span-2 text-ssacle-black text-xl font-medium py-2">
                비밀번호 *
              </label>
              <input
                type="password"
                placeholder="비밀번호를 입력해 주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-4 col-start-3 h-12 bg-ssacle-gray-sm rounded-full flex items-center px-6 text-base text-ssacle-blue focus:outline-ssacle-blue mb-4"
              />
              {/* 비밀번호 재확인 */}
              <label className="col-span-2 text-ssacle-black text-xl font-medium py-2">
                비밀번호 확인 *
              </label>
              <input
                type="password"
                placeholder="비밀번호를 한번 더 입력해 주세요"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange} // 실시간 검증 함수 호출
                ref={confirmPasswordRef}
                className="col-span-4 col-start-3 h-12 bg-ssacle-gray-sm rounded-full flex items-center px-6 text-base text-ssacle-blue focus:outline-ssacle-blue mb-4"
              />

              {/* 비밀번호 불일치 메세지 */}
              {passwordError && (
                <p className="col-span-4 col-start-3 text-red-500 text-sm">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </div>
            <div className="border-b-2 border-ssacle-gray-sm my-6" />

            {/* 약관 동의 */}
            <label className="flex items-center space-x-2 px-2">
              <input
                type="checkbox"
                checked={termsChecked}
                onChange={() => setTermsChecked(!termsChecked)}
                className="w-5 h-5 text-ssacle-blue checked:bg-ssacle-blue checked:border-transparent"
              />
              <span className="text-ssacle-black text-base font-medium">
                서비스 이용 약관
              </span>
            </label>
            <label className="flex items-center space-x-2 mt-2 px-2">
              <input
                type="checkbox"
                checked={privacyChecked}
                onChange={() => setPrivacyChecked(!privacyChecked)}
                className="w-5 h-5 text-ssacle-blue checked:bg-ssacle-blue checked:border-transparent"
              />
              <span className="text-ssacle-black text-base font-medium">
                개인정보 수집 / 이용 동의
              </span>
            </label>
            {/* 필수 약관 미동의 시 경고 메세지 */}
            {termsError && (
              <p className="text-[#f03939] text-sm px-2 mt-2 mb-10">
                필수 약관은 동의가 필요합니다.
              </p>
            )}

            {/* 회원가입 버튼 */}
            <div className="grid grid-cols-6 gap-4 mb-12">
              <button
                className="col-span-2 col-start-3 h-12 bg-ssacle-blue rounded-full px-6 text-white text-center text-xl font-bold mb-4"
                onClick={handleSignup}
                disabled={signupMutation.isLoading}
              >
                회원가입
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignupStep2
