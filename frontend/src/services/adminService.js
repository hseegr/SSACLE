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

// 카테고리 생성
// export const fetchCreateCategory = async ({ param1, param2, param3, image }) => {
//   const formData = new FormData();

//   if (image) {
//     formData.append("image", image); // 이미지가 있을 경우에만 추가
//   }

//   const response = await axios.post(
//     ADMIN_END_POINT.SSAPRINT.CREATE.CATEGORY,
//     formData,
//     {
//       params: { param1, param2, param3 },
//       headers: { "Content-Type": "multipart/form-data" },
//     }
//   );
//   return response.data;
// };

export const fetchCreateCategory = async ({
  param1,
  param2,
  param3,
  image,
}) => {
  // 🔥 params 객체를 함수 내부에서 올바르게 선언
  const params = {
    param1: String(param1), // 문자열 변환
    param2: param2 ? String(param2) : null,
    param3: param3 ? String(param3) : null,
  }

  // FormData는 이미지가 있을 때만 생성
  const formData = new FormData()
  if (image) {
    formData.append('image', image)
  }

  console.log('📡 API 전송 데이터:', {
    params,
    image: image ? image.name : 'No Image',
  })

  try {
    const response = await axios.post(
      ADMIN_END_POINT.SSAPRINT.CREATE.CATEGORY,
      formData, // Body에는 image만 포함
      { params, headers: { 'Content-Type': 'multipart/form-data' } } // params는 URL 쿼리 스트링으로 전송
    )

    console.log('✅ API 응답 데이터:', response.data)
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
export const fetchSearchSsaprint = async ({ categoryId, status, page, size }) => {
  const response = await axios.get(ADMIN_END_POINT.SSAPRINT.LIST, {
    params: {
      categoryId, // 선택사항
      status, // 필수
      pageable: JSON.stringify({
        page, // 현재 페이지
        size // 한 페이지에 표시할 개수 (10개)
      })
    }
  })
  return response.data
}


