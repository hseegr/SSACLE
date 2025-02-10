import axios from 'axios'

// Axios 인스턴스 생성
const httpCommon = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
  withCredentials: true,
})

// Access Token 저장 함수 (Bearer 제거)
const saveAccessToken = (token) => {
  console.log(token)
  const atoken = token.replace('Bearer ', '')
  console.log('replaced:,', atoken)
  if (token) localStorage.setItem('accessToken', atoken)
  console.log('가져와', localStorage.getItem('accessToken'))
}

// const saveAccessToken = (token) => {
//   console.log(token)
//   console.log(String(token).substring(7))
//   if (token) localStorage.setItem('accessToken', String(token).substring(7))
// }

// Access Token 갱신 함수
const refreshAccessToken = async () => {
  try {
    const { headers } = await axios.post(
      `/api/v1/refreshtoken`,
      {},
      { withCredentials: true }
    )
    const newAccessToken = headers['authorization']
    saveAccessToken(newAccessToken)
    return newAccessToken
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
    const authHeader = response.headers['authorization']
    // 토큰이 있을 때만 저장
    if (authHeader) saveAccessToken(authHeader)
    return response
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.error('🔄 401 Unauthorized: 액세스 토큰 갱신 시도')

      const newAccessToken = await refreshAccessToken()
      error.config.headers['Authorization'] =
        `Bearer ${newAccessToken.replace('Bearer ', '')}`
      return httpCommon(error.config)
    }
    return Promise.reject(error)
  }
)

export default httpCommon
