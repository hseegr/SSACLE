import axios from './http-common'

const BACKEND_SERVER_URL = 'http://localhost:5000' // Spring Boot 서버 주소

// openvidu에서 sesstion가져오기
export const fetchSessionId = async () => {
  const response = await axios.post(`/api/sessions`)
  return response.data // 실제 데이터만 반환
}

// openvidu에서 token 가져오기
export const fetchToken = async (sessionId) => {
  console.log('🔹 getToken', sessionId)
  try {
    const response = await axios.post(`/api/sessions/${sessionId}/connections`)
    if (response.status === 200) {
      return response.data
    }
    throw new Error('Failed to get token')
  } catch (error) {
    console.error('Token request failed:', error)
    throw error
  }
}
