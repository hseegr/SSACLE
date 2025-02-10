import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { fetchLogin } from '@/services/userService'
import { useMutation } from '@tanstack/react-query'

const LoginPage = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const loginMutation = useMutation({
    mutationFn: fetchLogin, 
    onSuccess: (response) => {
      if (response.status === 200) {
        localStorage.setItem('accessToken', response.data?.accessToken)
        navigate('/main')
      }
    },
    onError: (error) => {
      console.error('❌ 로그인 실패:', error)
    },
  })

  // 로그인 버튼 클릭 시 실행
  const handleLogin = () => {
    if (!email || !password) {
      return alert('이메일과 비밀번호를 모두 입력해주세요.')
    }
    loginMutation.mutate({ email, password })
  }

  return (
    <div className="min-w-max h-full flex justify-center items-center">
      <div className="flex flex-col gap-[1rem] w-[30rem] shrink-0 px-[1rem]">
        <h1 className="text-ssacle-blue text-3xl font-bold text-center mb-5">
          로그인
        </h1>

        <div className="relative">
          <input
            type="email"
            placeholder="이메일 주소를 입력해 주세요"
            className="w-full h-[3rem] bg-ssacle-gray-sm rounded-full px-[1.5rem] text-ssacle-blue text-base font-medium focus:outline-ssacle-blue"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative">
          <input
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            className="w-full h-[3rem] bg-ssacle-gray-sm rounded-full px-[1.5rem] text-ssacle-blue text-base font-medium focus:outline-ssacle-blue"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-end items-center">
          <button
            onClick={() =>
              navigate('/account/help', { state: { activeTab: 'email' } })
            }
            className="text-ssacle-black text-base font-medium mr-[0.5rem]"
          >
            이메일 찾기
          </button>
          <div className="w-[0.0625rem] h-[1rem] bg-neutral-200 mx-[0.5rem]"></div>
          <button
            onClick={() =>
              navigate('/account/help', { state: { activeTab: 'password' } })
            }
            className="text-ssacle-black text-base font-medium"
          >
            비밀번호 찾기
          </button>
        </div>

        {/* {error && <div className="text-red-500 text-center">{error}</div>} */}
        {/* 🔥 로그인 실패 시 에러 메시지 표시 */}
        {loginMutation.isError && (
          <div className="text-red-500 text-center">
            로그인에 실패했습니다. 이메일 혹은 비밀번호를 확인해주세요.
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full h-[3rem] bg-ssacle-blue rounded-full text-white text-xl font-bold"
          disabled={loginMutation.isLoading}
        >
          {loginMutation.isLoading ? '로그인 중...' : '로그인'}
        </button>

        <button
          className="w-full h-[3rem] bg-ssacle-sky rounded-full text-ssacle-blue text-xl font-bold"
          onClick={() => navigate('/account/signup')}
        >
          회원가입
        </button>
      </div>
    </div>
  )
}

export default LoginPage
