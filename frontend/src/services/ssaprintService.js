// @ts-nocheck
import httpCommon from './http-common'
import { SSAPRINT_END_POINT, NOTE_END_POINT } from './endPoints'

import { mockSsaprintData } from '@/mocks/ssaprintMockData'
// import { mockSsaprintDetailData } from '@/mocks/ssaprintDetailMockData'
import { mockActiveSsaprintDetailData } from '@/mocks/ssaprintActiveMockData'
import { mockSsaprintQuestions } from '@/mocks/ssaprintQuestionMockData'

/**
 * 카테고리 전체 조회 (포지션 및 기술 스택 포함)
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
 * 포지션 & 1차 기술 스택 가공 함수
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
 * 최상위 카테고리 조회 (포지션 목록)
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
 * 하위 카테고리 조회 (기술 스택 목록)
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
 * 완료된 싸프린트 조회 (API 요청)
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

// 싸프린트 상세 조회
export const fetchSsaprintDetail = async (sprintId) => {
  try {
    const response = await httpCommon.get(SSAPRINT_END_POINT.DETAIL(sprintId))
    return response.data // API 응답 데이터를 반환
  } catch (error) {
    throw new Error('스프린트 상세 정보를 불러오지 못했습니다.')
  }
}

// 싸프린트 참가 신청
export const joinSsaprint = async (sprintId, teamName) => {
  const response = await httpCommon.post(
    SSAPRINT_END_POINT.JOIN(sprintId),
    null,
    {
      params: { teamName },
    }
  )
  return response.data
}

// 참여중인 스프린트 정보 가져오기
export const getActiveSsaprint = async (sprintId, teamId) => {
  try {
    const response = await httpCommon.get(
      SSAPRINT_END_POINT.ACTIVE(sprintId, teamId)
    )
    return response.data // API 응답 데이터 반환
  } catch (error) {
    throw new Error('스프린트 데이터를 불러오는 데 실패했습니다.')
  }
}

// ToDo 등록
export const createTodo = async (teamId, data) => {
  try {
    const response = await httpCommon.post(
      SSAPRINT_END_POINT.ADD_TODO(teamId),
      data
    )
    return response.data
  } catch (error) {
    throw new Error('🔥 To-Do 추가 실패:', error)
  }
}

// ToDo 삭제
export const deleteTodo = async (todoId) => {
  try {
    await httpCommon.delete(SSAPRINT_END_POINT.DELETE_TODO(todoId))
  } catch (error) {
    throw new Error('🔥 To-Do 삭제 실패:', error)
  }
}

// To-Do 완료 상태 변경
export const updateTodoStatus = async (todoId) => {
  try {
    await httpCommon.patch(SSAPRINT_END_POINT.UPDATE_TODO_STATUS(todoId))
  } catch (error) {
    throw new Error('🔥 To-Do 상태 변경 실패:', error)
  }
}

// 일기 상세 조회
export const fetchDiaryDetail = async (diaryId) => {
  try {
    const response = await httpCommon.get(
      SSAPRINT_END_POINT.DIARY_DETAIL(diaryId)
    )
    return response.data
  } catch (error) {
    throw new Error('다이어리 정보를 불러올 수 없습니다.')
  }
}

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

/**
 * ✅ 질문 추가 (API 요청)
 * @param {number} sprintId - 스프린트 ID
 * @param {number} teamId - 팀 ID
 * @param {string} description - 질문 내용
 * @returns {Promise<Object>} - 추가된 질문 정보
 */
export const addSsaprintQuestion = async (sprintId, teamId, description) => {
  try {
    const response = await httpCommon.post(SSAPRINT_END_POINT.ADD_QUESTION, {
      sprintId,
      teamId,
      description,
      opened: true,
    })
    return response.data // API 응답 데이터 반환
  } catch (error) {
    throw new Error('질문 추가에 실패했습니다.')
  }
}

/**
 * ✅ 질문 수정
 * @param {number} id - 질문 ID
 * @param {Object} data - 수정할 데이터 (sprintId, teamId, description, opened)
 * @returns {Promise<Object>} - 수정된 질문 정보
 */
export const updateSsaprintQuestion = async (id, data) => {
  try {
    const response = await httpCommon.put(
      SSAPRINT_END_POINT.UPDATE_QUESTION(id),
      data
    )
    return response.data
  } catch (error) {
    throw new Error('질문 수정에 실패했습니다.')
  }
}

/**
 * ✅ 질문 삭제 (API 요청)
 * @param {number} id - 삭제할 질문 ID
 * @returns {Promise<void>}
 */
export const deleteSsaprintQuestion = async (id) => {
  try {
    await httpCommon.delete(SSAPRINT_END_POINT.DELETE_QUESTION(id))
  } catch (error) {
    throw new Error('🔥 질문 삭제에 실패했습니다.')
  }
}

// ✅ 발표 종료
export const exitSsaprintPresentation = (id) =>
  httpCommon.patch(SSAPRINT_END_POINT.PRESENTATION_EXIT(id))

/**
 * 특정 스프린트에 속한 팀들의 노트 목록 조회
 * @param {number} sprintId - 스프린트 ID
 * @returns {Promise<Array>} - 해당 스프린트 내 팀들의 학습 노트 목록
 */
export const fetchSprintTeamNotes = async (sprintId) => {
  try {
    const response = await httpCommon.get(NOTE_END_POINT.TEAM_NOTES(sprintId))
    return response.data // API 응답 데이터 반환
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ 스프린트 팀 노트 목록 조회 실패:', error)
    return []
  }
}
