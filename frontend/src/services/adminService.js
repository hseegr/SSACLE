import axios from './http-common'
import { ADMIN_END_POINT } from './endPoints'

// 싸프린트
// 싸프린트 생성

// 전체 카테고리 조회 (GET)
export const fetchLoadCategory = async () => {
  const response = await axios.get(ADMIN_END_POINT.SSAPRINT.CREATE.CATEGORY_ALL)
  return response.data
}

// GPT API 호출
export const fetchGptTodos = async ({ startAt, endAt, topic }) => {
  const response = await axios.get(ADMIN_END_POINT.SSAPRINT.CREATE.GPT_TODOS, {
    params: { startAt, endAt, topic },
  })
  return response.data
}

// 싸프린트 생성
export const fetchCreateSsaprint = async (Ssaprint_Data) => {
  const response = await axios.post(ADMIN_END_POINT.SSAPRINT.CREATE.SSAPRINT, Ssaprint_Data)
  return response.data
}