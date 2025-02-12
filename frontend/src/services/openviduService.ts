import axios from 'axios'

const BACKEND_SERVER_URL = 'http://localhost:5000' // Spring Boot 서버 주소

// openvidu에서 sesstion가져오기
export const fetchSessionId = async (id: string): Promise<string> => {
  const response = await axios.post(`${BACKEND_SERVER_URL}/api/sessions`, {
    customSessionId: id,
  })
  return response.data // 실제 데이터만 반환
}

// openvidu에서 token 가져오기
export const fetchToken = async (sessionId: string): Promise<string> => {
  try {
    const response = await axios.post(
      `${BACKEND_SERVER_URL}/api/sessions/${sessionId}/connections`
    )
    if (response.status === 200) {
      return response.data
    }
    throw new Error('Failed to get token')
  } catch (error) {
    console.error('Token request failed:', error)
    throw error
  }
}
