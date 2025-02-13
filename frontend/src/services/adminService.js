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
export const fetchGptTodos = async () => {
    const response = await axios.get(ADMIN_END_POINT.SSAPRINT.CREATE.GPT_TODOS)
    return response.data
}