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
  const [studentNumberError, setStudentNumberError] = useState('') //  학번 입력 오류 메시지 추가

  // 이름 상태
  const [name, setName] = useState('')

  // 닉네임 상태
  const [nickname, setNickname] = useState('')
  const [isNicknameValid, setIsNicknameValid] = useState(false) // 닉네임 인증 상태
  const [nicknameError, setNicknameError] = useState('') // 닉네임 입력 오류 메시지
  const [nicknameChecked, setNicknameChecked] = useState(false)

  // 비밀번호 상태
  const [password, setPassword] = useState('')
  const [confirmpassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false) // 비밀번호 불일치 메시지

  // 약관 동의 상태
  const [termsChecked, setTermsChecked] = useState(false)
  const [privacyChecked, setPrivacyChecked] = useState(false)
  const [termsError, setTermsError] = useState(false)

  const [showTermsTooltip, setShowTermsTooltip] = useState(false)
  const [showPrivacyTooltip, setShowPrivacyTooltip] = useState(false)

  // Step1에서 받아온 이메일
  const email = location.state?.email || ''
  // console.log('Step2에서 받은 이메일:', email) // 🔥 확인용 로그

  // 닉네임 중복 확인 Mutation
  const nicknameMutation = useMutation({
    mutationFn: async () => {
      // console.log('🟡 닉네임 중복 체크 요청:', nickname) // 요청 닉네임 로그
      const response = await fetchCheckNickname(nickname)
      // console.log('🟢 닉네임 중복 체크 응답 (원본):', response) // 응답 로그 추가
      return response // 🚀 서버 응답 반환
    },
    onSuccess: (response) => {
      // console.log('🟢 닉네임 중복 체크 최종 응답:', response) // 응답 확인

      if (!nickname.trim()) return // 닉네임이 비어있으면 중단

      const isDuplicate = response.data // 서버 응답 값 (true: 중복, false: 사용 가능)
      // console.log("🟠 중복 여부:", isDuplicate); // 디버깅용 로그

      setIsNicknameValid(() => !isDuplicate)
      setNicknameChecked(() => true)
      setNicknameError(() =>
        isDuplicate ? '이미 사용 중인 닉네임입니다.' : ''
      )
    },

    onError: (error) => {
      console.error('❌ 닉네임 중복 확인 오류:', error)
      alert('닉네임 확인 중 오류가 발생했습니다. 다시 시도해주세요.')
    },
  })

  // 학번 중복 확인 Mutation
  const studentNumberMutation = useMutation({
    mutationFn: async () => {
      // console.log('🟡 학번 중복 체크 요청:', studentNumber) // 요청 데이터 확인
      const response = await fetchCheckNumber(studentNumber)
      // console.log('🟢 학번 중복 체크 응답 (원본):', response) // 응답 데이터 확인
      return response // 응답 반환
    },
    onSuccess: (response) => {
      // console.log('🟠 학번 중복 체크 최종 응답:', response)

      if (!studentNumber.trim()) return // 학번이 비어있으면 중단

      const isDuplicate = response.data // 서버 응답 값 (true: 중복, false: 사용 가능)
      // console.log('🟠 중복 여부:', isDuplicate) // 중복 여부 확인

      setIsStudentNumberValid(() => !isDuplicate) // 상태 업데이트 (함수형 업데이트)
      setStudentNumberError(() =>
        isDuplicate ? '이미 사용 중인 학번입니다.' : ''
      ) // 오류 메시지 업데이트
    },
    onError: (error) => {
      console.error('❌ 학번 중복 확인 오류:', error)
      alert('학번 확인 중 오류가 발생했습니다. 다시 시도해주세요.')
    },
  })

  // 회원가입 Mutation
  const signupMutation = useMutation({
    // mutationFn: () =>
    //   fetchSignup({
    //     studentNumber,
    //     email,
    //     nickname,
    //     name,
    //     password,
    //     confirmpassword,
    //   }),
    mutationFn: async (userData) => {
      const response = await fetchSignup(userData)

      return response
    },
    onSuccess: (response) => {


      const userId = response?.data?.userId
      // const nickname = nickname

      if (!userId) {
        // ✅ userId가 없는 경우 예외 처리 추가
        console.error('❌ userId가 응답에 없음:', response)
        alert('❌ 회원가입 응답이 올바르지 않습니다. 다시 시도해주세요.')
        return
      }

      localStorage.setItem('userId', userId)
      localStorage.setItem('userNickname', nickname)
      if (nickname) {
        localStorage.setItem('userNickname', nickname)
      }

      navigate('/account/signup/interest', { state: { nickname } })
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        (error.message === 'Network Error'
          ? '서버와 연결할 수 없습니다. 인터넷 연결을 확인해주세요.'
          : '다시 시도해주세요.')

      console.error('❌ 회원가입 실패:', errorMessage)

      // 특정 오류 메시지에 따라 사용자 친화적인 메시지 출력 후 페이지 이동
      if (errorMessage.includes('Email already exists')) {
        alert('❌ 이미 가입한 이메일 입니다!')
        navigate('/account/login') // 로그인 페이지로 이동
      } else if (errorMessage.includes('Email verification required')) {
        alert('❌ 인증 시간이 만료되었습니다. 다시 인증 해주세요!')
        navigate('/account/signup') // 회원가입 첫 페이지로 이동
      } else {
        alert(`❌ 회원가입 실패: ${errorMessage}`)
      }
    },
  })

  // 학번 중복 확인 버튼 클릭 시 실행 함수 (빈 값 체크 추가)
  const handleCheckStudentNumber = () => {
    if (!studentNumber.trim()) {
      setStudentNumberError('학번을 입력해주세요.')
      return
    }
    studentNumberMutation.mutate()
  }

  // 학번 입력 시 오류 메시지 초기화
  const handleStudentNumberChange = (e) => {
    const newValue = e.target.value
    setStudentNumber(newValue)
    setStudentNumberError('') // 오류 메시지 초기화
    setIsStudentNumberValid(null) // 학번 인증 상태 초기화 (null로 변경)
  }

  // 닉네임 입력 시 상태 초기화
  const handleNicknameChange = (e) => {
    const newValue = e.target.value
    setNickname(newValue)
    setNicknameError('') // 오류 메시지 초기화
    setIsNicknameValid(null) // 인증 상태 초기화
    setNicknameChecked(false) // 확인 여부 초기화
  }

  // 닉네임 중복 확인 버튼 클릭 시 실행
  const handleCheckNickname = () => {
    if (!nickname.trim()) {
      // 빈 값이면 오류 메시지 표시
      setNicknameError('닉네임을 입력해주세요.')
      return
    }
    nicknameMutation.mutate()
  }

  // 비밀번호 확인 함수
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
    setPasswordError(password && e.target.value && password !== e.target.value)
  }

  // 회원가입 버튼 클릭
  const handleSignup = () => {
    // 필수 입력값 체크
    if (!studentNumber.trim()) {
      setStudentNumberError('학번을 입력해주세요.')
      alert('학번을 입력해주세요.')
      return
    }
    if (isStudentNumberValid !== true) {
      alert('학번 중복 확인을 해주세요.')
      return
    }
    if (!name.trim()) {
      alert('이름을 입력해주세요.')
      return
    }
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.')
      return
    }
    if (isNicknameValid !== true) {
      alert('닉네임 중복 확인을 해주세요.')
      return
    }
    if (!password.trim() || !confirmpassword.trim()) {
      setPasswordError(true)
      confirmPasswordRef.current.focus()
      return false
    }
    if (password !== confirmpassword) {
      setPasswordError(true)
      confirmPasswordRef.current?.focus()
      return false
    }
    if (!termsChecked || !privacyChecked) {
      setTermsError(true)
      return false
    }
    const userData = {
      studentNumber,
      email,
      nickname,
      name,
      password,
      confirmpassword,
    }
    localStorage.setItem('userNickname', nickname)
    // console.log('📤 회원가입 요청 데이터 확인:', userData)

    // 회원가입 API 실행
    signupMutation.mutate(userData)
  }

  return (
    <>
      <div className="w-full h-auto flex justify-center items-center mt-24">
        <div className="grid grid-cols-12 gap-4 shrink-0">
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
              <>
                <input
                  type="text"
                  placeholder="학번을 입력하세요."
                  value={studentNumber}
                  onChange={handleStudentNumberChange}
                  className="col-span-3 col-start-3 h-12 bg-ssacle-gray-sm rounded-full flex items-center px-6 text-base text-ssacle-blue focus:outline-ssacle-blue"
                />
                <button
                  className={`col-span-1 col-start-6 h-12 rounded-full text-white font-bold text-sm transition-all
    ${!studentNumber.trim() || studentNumberMutation.isLoading ? 'bg-ssacle-gray cursor-not-allowed' : 'bg-ssacle-blue'}`}
                  onClick={handleCheckStudentNumber}
                  disabled={
                    !studentNumber.trim() || studentNumberMutation.isLoading
                  }
                >
                  {studentNumberMutation.isLoading ? '확인 중...' : '중복확인'}
                </button>

                {/* 학번 인증 결과 메시지 */}
                {isStudentNumberValid === true && (
                  <p className="col-span-4 col-start-3 text-ssacle-blue text-sm pl-5">
                    인증이 완료되었습니다.
                  </p>
                )}
                {isStudentNumberValid === false && (
                  <p className="col-span-4 col-start-3 text-red-500 text-sm  pl-5">
                    ❌ 이미 아이디가 존재합니다.
                  </p>
                )}
              </>

              {/* 이메일 */}
              <label className="col-span-2 text-ssacle-black text-xl font-medium py-2">
                이메일 *
              </label>
              <div className="col-span-4 col-start-3">
                <input
                  type="email"
                  value={email}
                  disabled // 이메일은 변경 불가능하게 설정
                  className="h-12 w-full bg-ssacle-gray-sm rounded-full px-6 text-lg text-ssacle-black cursor-not-allowed"
                />
                <p className="text-ssacle-blue text-sm mt-1 mt-4 pl-5 ">
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
                onChange={handleNicknameChange}
                className="col-span-3 col-start-3 h-12 bg-ssacle-gray-sm rounded-full flex items-center px-6 text-base text-ssacle-blue focus:outline-ssacle-blue"
              />
              <button
                className={`col-span-1 col-start-6 h-12 rounded-full text-white font-bold transition-all text-sm
                  ${!nickname.trim() || nicknameMutation.isLoading ? 'bg-ssacle-gray cursor-not-allowed' : 'bg-ssacle-blue'}`}
                onClick={handleCheckNickname} // 중복 확인 실행
                disabled={!nickname.trim() || nicknameMutation.isLoading}
              >
                {nicknameMutation.isLoading ? '확인 중...' : '중복확인'}
              </button>

              {/* 닉네임 인증 결과 메시지 */}
              {nicknameChecked && (
                <>
                  {isNicknameValid === false && (
                    <p className="col-span-4 col-start-3 text-red-500 text-sm pl-5">
                      ❌ {nicknameError}
                    </p>
                  )}
                  {isNicknameValid === true && (
                    <p className="col-span-4 col-start-3 text-ssacle-blue text-sm pl-5">
                      사용 가능한 닉네임입니다.
                    </p>
                  )}
                </>
              )}
            </div>
            <div className="border-b-2 border-ssacle-gray-sm my-6" />

            {/* 비밀번호 입력 */}
            <div className="grid grid-cols-6 gap-4">
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
                value={confirmpassword}
                onChange={handleConfirmPasswordChange} // 실시간 검증 함수 호출
                ref={confirmPasswordRef}
                className="col-span-4 col-start-3 h-12 bg-ssacle-gray-sm rounded-full flex items-center px-6 text-base text-ssacle-blue focus:outline-ssacle-blue"
              />

              {/* 비밀번호 불일치 메세지 */}
              {passwordError && (
                <p className="col-span-4 col-start-3 text-red-500 text-sm pl-5">
                  ❌ 비밀번호가 일치하지 않습니다.
                </p>
              )}
            </div>
            <div className="border-b-2 border-ssacle-gray-sm my-6" />

            {/* 약관 동의 */}
            <div className="relative flex items-center space-x-2 px-2">
              <input
                type="checkbox"
                checked={termsChecked}
                onChange={() => setTermsChecked(!termsChecked)}
                className="w-5 h-5 text-ssacle-blue checked:bg-ssacle-blue checked:border-transparent"
              />
              <span
                className="text-ssacle-black text-base font-medium cursor-pointer relative"
                onMouseEnter={() => setShowTermsTooltip(true)}
                onMouseLeave={() => setShowTermsTooltip(false)}
                onClick={() => setTermsChecked(termsChecked === false? true : false)}
              >
                서비스 이용 약관
                {showTermsTooltip && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-ssacle-black text-white text-sm p-2 rounded-md shadow-md whitespace-nowrap">
                    본 서비스 이용을 위해 필수적인 약관입니다.
                    <br />
                    서비스 제공, 보안 관리 등을 위해 사용됩니다.
                    <br />
                    자세한 내용은 공지사항을 확인해주세요.
                  </div>
                )}
              </span>
            </div>
            <div className="relative flex items-center space-x-2 px-2 mt-2">
              <input
                type="checkbox"
                checked={privacyChecked}
                onChange={() => setPrivacyChecked(!privacyChecked)}
                className="w-5 h-5 text-ssacle-blue checked:bg-ssacle-blue checked:border-transparent"
              />
              <span
                className="text-ssacle-black text-base font-medium cursor-pointer relative"
                onMouseEnter={() => setShowPrivacyTooltip(true)}
                onMouseLeave={() => setShowPrivacyTooltip(false)}
                onClick={() => setPrivacyChecked(privacyChecked === false? true : false)}
              >
                개인정보 수집 / 이용 동의
                {showPrivacyTooltip && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-ssacle-black text-white text-sm p-2 rounded-md shadow-md whitespace-nowrap">
                    회원가입 및 서비스 제공을 위해 최소한의 개인정보를 수집하며,
                    <br />
                    법령에 따라 안전하게 관리됩니다.
                  </div>
                )}
              </span>
              </div>
            {/* 필수 약관 미동의 시 경고 메세지 */}
            {termsError && (
              <p className="text-[#f03939] text-sm px-2 mt-2 mb-10 pl-9">
                필수 약관은 동의가 필요합니다.
              </p>
            )}

            {/* 회원가입 버튼 */}
            <div className="grid grid-cols-6 gap-4 mb-12">
              <button
                className="col-span-2 col-start-3 h-12 bg-ssacle-blue rounded-full px-6 text-white text-center text-xl font-bold mt-6"
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
