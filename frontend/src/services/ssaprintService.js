// @ts-nocheck
import httpCommon from './http-common'
import { SSAPRINT_END_POINT } from './endPoints'

import { mockSsaprintData } from '@/mocks/ssaprintMockData'
// import { mockSsaprintDetailData } from '@/mocks/ssaprintDetailMockData'
import { mockActiveSsaprintDetailData } from '@/mocks/ssaprintActiveMockData'
import { mockSsaprintQuestions } from '@/mocks/ssaprintQuestionMockData'

/**
 * ✅ 카테고리 전체 조회 (포지션 및 기술 스택 포함)
 * @returns {Promise<Array>} - 전체 카테고리 데이터
 */
export const fetchCategories = async () => {
  try {
    const response = await httpCommon.get(SSAPRINT_END_POINT.CATEGORY_ALL)

    return response.data // API 응답 데이터 반환
  } catch (error) {
    return []
  }
}

/**
 * ✅ 포지션 & 1차 기술 스택 가공 함수
 */
export const transformCategories = (categories) => {
  return categories.map((position) => ({
    id: position.id, // 포지션 ID
    name: position.categoryName, // 포지션 이름
    stacks: position.subCategories.map((stack) => ({
      id: stack.id, // 기술 스택 ID
      name: stack.categoryName, // 기술 스택 이름
    })),
  }))
}

/**
 * ✅ 최상위 카테고리 조회 (포지션 목록)
 */
export const fetchTopCategories = async () => {
  try {
    const response = await httpCommon.get(SSAPRINT_END_POINT.CATEGORY_TOP)
    return response.data // 포지션 목록 반환
  } catch (error) {
    return []
  }
}

/**
 * ✅ 하위 카테고리 조회 (기술 스택 목록)
 */
export const fetchSubCategories = async (categoryId) => {
  try {
    const response = await httpCommon.get(
      SSAPRINT_END_POINT.CATEGORY_SUB(categoryId)
    )
    return response.data // 해당 포지션의 기술 스택 목록 반환
  } catch (error) {
    return []
  }
}

/**
 * 싸프린트 목록 조회 (API 요청)
 * @param {number} status - 스프린트 상태 (0: 시작 전, 1: 진행 중, 2: 완료)
 * @param {number} categoryId - 카테고리 ID (선택)
 * @param {number} page - 페이지 번호 (기본값: 0)
 * @param {number} size - 페이지당 아이템 개수 (기본값: 8)
 */
export const fetchSsaprintListWithFilter = async (
  status,
  categoryId = null,
  page = 0,
  size = 8
) => {
  try {
    const response = await httpCommon.get('/search', {
      params: {
        status, // 상태 값 (0: 시작 전, 1: 진행 중, 2: 완료)
        categoryId: categoryId || undefined, // 카테고리 ID (선택)
        page, // 페이지 번호
        size, // 한 페이지에 가져올 데이터 수
        sort: 'startAt,desc', // 정렬 방식 (백엔드 요구사항 반영)
      },
    })
    return response.data // 백엔드 응답 데이터 반환
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('🔥 싸프린트 목록 조회 실패:', error)
    return null // 오류 발생 시 null 반환
  }
}

/**
 * ✅ 완료된 싸프린트 조회 (API 요청)
 * @param {number} page - 페이지 번호 (기본값: 0)
 * @param {number} size - 페이지당 아이템 개수 (기본값: 8)
 * @returns {Promise<Object>} - 완료된 스프린트 목록 데이터 반환
 */
export const fetchCompletedSsaprintList = async (page = 0, size = 8) => {
  try {
    const response = await httpCommon.get(SSAPRINT_END_POINT.COMPLETED, {
      params: {
        page, // 현재 페이지 번호
        size, // 한 페이지에 가져올 개수
        sort: 'startAt,desc', // 시작 날짜 기준 내림차순 정렬
      },
    })

    return response.data // 백엔드 응답 데이터 반환
  } catch (error) {
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: page,
    }
  }
}

// ✅ 싸프린트 상세 조회
export const fetchSsaprintDetail = async (sprintId) => {
  try {
    const response = await httpCommon.get(SSAPRINT_END_POINT.DETAIL(sprintId))
    return response.data // API 응답 데이터를 반환
  } catch (error) {
    throw new Error('스프린트 상세 정보를 불러오지 못했습니다.')
  }
}

// ✅ 싸프린트 참가 (목업 처리)
export const joinSsaprint = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: '스프린트에 신청되었습니다.' })
    }, 500)
  })
}
// // ✅ 싸프린트 참가 (비동기 처리 추가)
// export const joinSsaprint = async (id) => {
//   try {
//     const response = await httpCommon.post(SSAPRINT_END_POINT.JOIN(id));
//     return response.data; // 성공 메시지 반환
//   } catch (error) {
//     console.error(`스프린트 신청 중 오류 발생:`, error);
//     throw error;
//   }
// };

// 참여중인 스프린트 정보 가져오기
export const getActiveSsaprint = async (sprintId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockActiveSsaprintDetailData)
    }, 500)
  })
}

// // ✅ 참여중인 스프린트 정보 가져오기
// export const getActiveSsaprint = async (sprintId) => {
//   try {
//     const response = await httpCommon.get(SSAPRINT_END_POINT.ACTIVE(sprintId));
//     return response.data;
//   } catch (error) {
//     console.error('참여중인 스프린트 정보 불러오기 실패:', error);
//     throw error;
//   }
// };

// ✅ 싸프린트 생성
export const createSsaprint = (data) =>
  httpCommon.post(SSAPRINT_END_POINT.CREATE, data)

// ✅ 싸프린트 수정
export const updateSsaprint = (id, data) =>
  httpCommon.patch(SSAPRINT_END_POINT.UPDATE(id), data)

// ✅ 싸프린트 삭제
export const deleteSsaprint = (id) =>
  httpCommon.delete(SSAPRINT_END_POINT.DELETE(id))

// ✅ 발표 참가자 목록 조회
export const fetchSsaprintParticipants = (id) =>
  httpCommon.get(SSAPRINT_END_POINT.PRESENTATION_PARTICIPANTS(id))

/**
 * ✅ 특정 스프린트의 질문 목록 조회
 */
// export const fetchSsaprintQuestions = async (sprintId) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(mockSsaprintQuestions)
//     }, 500)
//   })
// }

/**
 * ✅ 특정 스프린트의 질문 목록 조회 (API 요청)
 * @param {number} sprintId - 스프린트 ID
 * @returns {Promise<Array>} - 질문 목록
 */
export const fetchSsaprintQuestions = async (sprintId) => {
  try {
    const response = await httpCommon.get(
      SSAPRINT_END_POINT.QUESTIONS(sprintId)
    )
    return response.data
  } catch (error) {
    return []
  }
}

// ✅ 특정 질문 카드 상세 조회
export const fetchSsaprintCardDetail = (id, cardId) =>
  httpCommon.get(SSAPRINT_END_POINT.PRESENTATION_CARD_DETAIL(id, cardId))

// /**
//  * ✅ 질문을 추가하는 함수
//  */
// export const addSsaprintQuestion = async (sprintId, description) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const newQuestion = {
//         id: mockSsaprintQuestions.length + 1, // ✅ 새로운 id (자동 증가)
//         description: description,
//         createdAt: new Date().toISOString(), // ✅ 현재 시간
//         opened: true,
//       }

//       // ✅ 질문을 임시 저장 (실제 API 호출이라면 서버로 요청)
//       mockSsaprintQuestions.push(newQuestion)

//       resolve(newQuestion)
//     }, 500)
//   })
// }

/**
 * ✅ 질문 추가 (API 요청)
 * @param {number} sprintId - 스프린트 ID
 * @param {string} description - 질문 내용
 * @returns {Promise<Object>} - 추가된 질문 정보
 */
export const addSsaprintQuestion = async (sprintId, description) => {
  try {
    const response = await httpCommon.post(SSAPRINT_END_POINT.ADD_QUESTION, {
      sprintId,
      description,
      opened: true,
    })
    return response.data // API 응답 데이터 반환
  } catch (error) {
    throw new Error('질문 추가에 실패했습니다.')
  }
}

// ✅ 발표 종료
export const exitSsaprintPresentation = (id) =>
  httpCommon.patch(SSAPRINT_END_POINT.PRESENTATION_EXIT(id))

// ✅ TODO 상태 수정
export const updateSsaprintTodo = (ssaprintId, todoId) =>
  httpCommon.patch(SSAPRINT_END_POINT.TODO_STATUS(ssaprintId, todoId))
