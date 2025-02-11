import axios from 'axios'

// Axios 인스턴스 생성
const httpCommon = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
  withCredentials: true,
})

// Access Token 저장 함수
const saveAccessToken = (token) => {
  if (token && token.startsWith('Bearer ')) {
    const atoken = token.replace('Bearer ', '')
    localStorage.setItem('accessToken', atoken)
  }
}

// Access Token 갱신 함수
const refreshAccessToken = async () => {
  try {
    const { headers } = await axios.post(
      `/api/v1/refreshtoken`,
      {},
      { withCredentials: true }
    )
    const newAccessToken = headers['authorization'] // ✅ 소문자로 변경

    if (newAccessToken) {
      saveAccessToken(newAccessToken)
      return newAccessToken
    } else {
      console.error('❌ 새 액세스 토큰이 응답에 없습니다.')
      throw new Error('새 액세스 토큰 없음')
    }
  } catch (error) {
    console.error('❌ 토큰 갱신 실패:', error)
    window.location.href = '/login'
    throw error
  }
}

// 요청 인터셉터: Access Token 추가
httpCommon.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`
  return config
})

// 응답 인터셉터: 401 처리 + 토큰 갱신
httpCommon.interceptors.response.use(
  (response) => {
    const authHeader = response.headers['authorization'] // 공백 제거
    if (authHeader) saveAccessToken(authHeader)
    else console.log('❌ 응답 헤더에 Authorization 없음')
    return response
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.error('🔄 401 Unauthorized: 액세스 토큰 갱신 시도')

      try {
        const newAccessToken = await refreshAccessToken()
        if (newAccessToken) {
          error.config.headers['Authorization'] =
            `Bearer ${newAccessToken.replace('Bearer ', '')}`
          return httpCommon(error.config) // ✅ 요청 재시도
        }
      } catch (refreshError) {
        console.error('❌ 토큰 갱신 후에도 오류 발생:', refreshError)
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default httpCommon
