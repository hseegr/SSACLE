import axios from './http-common' // Axios 인스턴스 사용
import { AUTH_END_POINT } from './endPoints'

// 2. 이메일 중복 체크 (GET)
export const fetchCheckEmail = (email) =>
  axios.get(AUTH_END_POINT.CHECK_EMAIL(email))

// 3. 인증 코드 전송 (웹훅 사용) (POST)
export const fetchSendVerification = (email, webhook) =>
  axios.post(AUTH_END_POINT.SEND_VERIFICATION, { email, webhook })

// 비밀번호 확인 (POST)
export const fetchCheckPassword = (password, confirmPassword) =>
  axios.post(AUTH_END_POINT.CHECK_PASSWORD, { password, confirmPassword })

// 닉네임 중복 확인 (POST)
export const fetchCheckNickname = (nickname) =>
  axios.post(AUTH_END_POINT.CHECK_NICKNAME, { nickname })

// 6. 관심사 체크 (GET)
export const fetchCheckInterest = (interests) =>
  axios.get(AUTH_END_POINT.CHECK_INTERESTS(interests))

// 7. 회원가입 (POST)
import axios2 from 'axios'

export const fetchSignup = async (userData) => {
  return axios2.post('/api/v1/join', userData, {
    headers: { 'Content-Type': 'application/json' }, // Authorization 없이 요청
    withCredentials: true,
  })
}

// 8. 로그인 (POST)
export const fetchLogin = (credentials) =>
  axios.post(AUTH_END_POINT.LOGIN, credentials)

// 9. 로그아웃 (POST)
// 기존 코드
// export const fetchLogout = async () => {
//   try {
//     await axios.post(AUTH_END_POINT.LOGOUT)
//     window.location.href = '/login' // 성공 후 페이지 이동
//   } catch (error) {
//     console.error('❌ 로그아웃 실패:', error)
//   }
// }

// 9. 로그아웃 (POST)
export const fetchLogout = async () => {
  try {
    // 백엔드에 로그아웃 요청 (리프레시 토큰 삭제)
    await axios.post(AUTH_END_POINT.LOGOUT, {}, { withCredentials: true })

    // 클라이언트에서도 액세스 토큰 삭제
    localStorage.removeItem('accessToken')

    // 로그아웃 후 로그인 페이지로 이동
    window.location.href = '/login'
  } catch (error) {
    console.error('❌ 로그아웃 실패:', error)
  }
}

// 10. Refresh Token 재발급 (POST)
export const fetchRefreshToken = async () => {
  try {
    const { data } = await axios.post(AUTH_END_POINT.REFRESH_TOKEN)
    localStorage.setItem('accessToken', data.accessToken) // 새로운 액세스 토큰 저장
    localStorage.setItem('refreshToken', data.refreshToken) // 새로운 리프레시 토큰 저장
    return data
  } catch (error) {
    console.error('❌ 토큰 갱신 실패:', error)
    throw error
  }
}

// 이메일 찾기
export const fetchFindEmail = async (studentNumber) =>
  axios.post(AUTH_END_POINT.FIND_EMAIL, studentNumber)

// 비밀번호 찾기
export const fetchFindPassword = async (studentNumber, email) =>
  axios.post(AUTH_END_POINT.FIND_PASSWORD, { studentNumber, email })

// 인증 번호 검증 (POST)
export const fetchCheckCode = async (email, verificationCode) =>
  axios.post(AUTH_END_POINT.CHECK_CODE, { email, verificationCode })

// 학번 중복 확인 (POST)
export const fetchCheckNumber = async (studentNumber) =>
  axios.post(AUTH_END_POINT.CHECK_STUDENT_NUMBER, { studentNumber })
