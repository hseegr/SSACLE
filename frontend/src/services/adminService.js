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
  const response = await axios.post(
    ADMIN_END_POINT.SSAPRINT.CREATE.SSAPRINT,
    Ssaprint_Data
  )
  return response.data
}

export const fetchCreateCategory = async ({
  param1,
  param2,
  param3,
  image,
}) => {
  try {
    // Query Parameters 정의
    const queryParams = {
      param1: param1, // string 형식 유지
      ...(param2 && { param2: param2 }),
      ...(param3 && { param3: param3 }),
    }

    // FormData 생성
    const formData = new FormData()
    if (image) {
      formData.append('image', image)
    }

    // console.log('📡 API 전송 데이터:', { queryParams, image: image ? image.name : 'No Image' })

    // API 요청
    const response = await axios.post(
      ADMIN_END_POINT.SSAPRINT.CREATE.CATEGORY,
      formData, // body: image만 포함
      {
        params: queryParams, // Query Parameters 설정
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )

    // console.log('✅ API 응답 데이터:', response.data)
    return response.data
  } catch (error) {
    console.error(
      '❌ API 요청 실패:',
      error.response ? error.response.data : error
    )
    throw error
  }
}

// 전체 싸프린트 조회 (GET)
export const fetchSearchSsaprint = async ({
  categoryId,
  status,
  page,
  size,
  sort = ['startAt', 'desc'],
}) => {
  // console.log("📡 API 요청 params:", { categoryId, status, page, size, sort });

  const response = await axios.get(ADMIN_END_POINT.SSAPRINT.LIST, {
    params: {
      categoryId, // 선택사항
      status, // 필수
      page, // 현재 페이지
      size,
      sort: sort.join(','),
    },
  })

  // console.log("✅ API 응답:", response.data);
  return response.data
}

// 싸프린트 상세 조회
export const fetchSsaprintDetail = async (sprintId) => {
  if (!sprintId) {
    console.error('fetchSsaprintDetail: sprintId가 없습니다.')
    return null
  }

  try {
    const response = await axios.get(ADMIN_END_POINT.SSAPRINT.DETAIL(sprintId)) // ✅ 동적 URL 적용
    return response.data // ✅ API 응답 데이터 반환
  } catch (error) {
    console.error('❌ 싸프린트 상세 정보를 가져오는 중 오류 발생:', error)
    throw error
  }
}
