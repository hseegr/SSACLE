// @ts-nocheck
import httpCommon from './http-common'
import { SSAPRINT_END_POINT } from './endPoints'

import { mockSsaprintData } from '@/mocks/ssaprintMockData'
import { mockSsaprintDetailData } from '@/mocks/ssaprintDetailMockData'
import { mockActiveSsaprintDetailData } from '@/mocks/ssaprintActiveMockData'
import { mockSsaprintQuestions } from '@/mocks/ssaprintQuestionMockData'

/**
 * ✅ 참여 가능 스프린트 목록을 불러오는 함수 (비동기 API처럼 동작)
 */
export const fetchSsaprintListWithFilter = async (
  major,
  sub,
  page = 0,
  size = 10
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...mockSsaprintData,
        content: mockSsaprintData.content.slice(page * size, (page + 1) * size),
      })
    }, 500)
  })
}

/**
 * ✅ 완료된 스프린트 목록을 불러오는 함수
 */
export const fetchCompletedSsaprintList = async (page = 0, size = 10) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const completedSprints = mockSsaprintData.content.filter(
        (sprint) => new Date(sprint.endAt) < new Date()
      )

      resolve({
        ...mockSsaprintData,
        content: completedSprints.slice(page * size, (page + 1) * size),
        totalElements: completedSprints.length,
        totalPages: Math.ceil(completedSprints.length / size),
      })
    }, 500)
  })
}

// // ✅ 조건별 싸프린트 조회 (참여 가능 목록)
// export const fetchSsaprintListWithFilter = async (major, sub, page = 0, size = 10) => {
//   try {
//     const response = await httpCommon.get(SSAPRINT_END_POINT.LIST, {
//       params: {
//         major: major || undefined,
//         sub: sub || undefined,
//         page,
//         size,
//       },
//     });
//     return response.data; // ✅ `.data` 반환하여 오류 해결
//   } catch (error) {
//     console.error('Error fetching available sprints:', error);
//     return null;
//   }
// };

// // ✅ 완료된 싸프린트 조회
// export const fetchCompletedSsaprintList = async (page = 0, size = 10) => {
//   try {
//     const response = await httpCommon.get(SSAPRINT_END_POINT.COMPLETED, {
//       params: { page, size },
//     });
//     return response.data; // ✅ `.data` 반환하여 오류 해결
//   } catch (error) {
//     console.error('Error fetching completed sprints:', error);
//     return null;
//   }
// };

// ✅ 싸프린트 상세 조회
export const fetchSsaprintDetail = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSsaprintDetailData)
    }, 500)
  })
}

// // ✅ 싸프린트 상세 조회
// export const fetchSsaprintDetail = async (id) => {
//   try {
//     const response = await httpCommon.get(SSAPRINT_END_POINT.DETAIL(id));
//     return response.data;
//   } catch (error) {
//     console.error(`스프린트 ${id} 상세 정보를 가져오는 중 오류 발생`, error);
//     return null;
//   }
// }

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
 * ✅ 특정 스프린트의 질문 목록을 조회하는 함수
 */
export const fetchSsaprintQuestions = async (sprintId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSsaprintQuestions)
    }, 500)
  })
}

// // ✅ 실제 API 요청 방식 (추후 적용 가능)
// export const getSprintQuestions = async (sprintId) => {
//   try {
//     const response = await httpCommon.get(SSAPRINT_END_POINT.QUESTIONS(sprintId));
//     return response.data;
//   } catch (error) {
//     console.error('질문 목록을 불러오는 중 오류 발생:', error);
//     return [];
//   }
// };

// ✅ 특정 질문 카드 상세 조회
export const fetchSsaprintCardDetail = (id, cardId) =>
  httpCommon.get(SSAPRINT_END_POINT.PRESENTATION_CARD_DETAIL(id, cardId))

/**
 * ✅ 질문을 추가하는 함수
 */
export const addSsaprintQuestion = async (sprintId, description) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newQuestion = {
        id: mockSsaprintQuestions.length + 1, // ✅ 새로운 id (자동 증가)
        description: description,
        createdAt: new Date().toISOString(), // ✅ 현재 시간
        opened: true,
      }

      // ✅ 질문을 임시 저장 (실제 API 호출이라면 서버로 요청)
      mockSsaprintQuestions.push(newQuestion)

      resolve(newQuestion)
    }, 500)
  })
}

// ✅ 발표 종료
export const exitSsaprintPresentation = (id) =>
  httpCommon.patch(SSAPRINT_END_POINT.PRESENTATION_EXIT(id))

// ✅ TODO 상태 수정
export const updateSsaprintTodo = (ssaprintId, todoId) =>
  httpCommon.patch(SSAPRINT_END_POINT.TODO_STATUS(ssaprintId, todoId))
