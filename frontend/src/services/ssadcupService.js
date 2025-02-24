// @ts-nocheck
import httpCommon from './http-common'
import { SSADCUP_END_POINT } from './endPoints'

/**
 * 카테고리 전체 조회 (포지션 및 기술 스택 포함)
 * @returns {Promise<Array>} - 전체 카테고리 데이터
 */
export const fetchCategories = async () => {
  try {
    const response = await httpCommon.get(SSADCUP_END_POINT.CATEGORY_ALL)

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
    const response = await httpCommon.get(SSADCUP_END_POINT.CATEGORY_TOP)
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
      SSADCUP_END_POINT.CATEGORY_SUB(categoryId)
    )
    return response.data // 해당 포지션의 기술 스택 목록 반환
  } catch (error) {
    return []
  }
}

/**
 * 싸드컵 목록 조회 (API 요청)
 * @param {number} status - 스프린트 상태 (0: 시작 전, 1: 진행 중, 2: 완료)
 * @param {number} categoryId - 카테고리 ID (선택)
 * @param {number} page - 페이지 번호 (기본값: 0)
 * @param {number} size - 페이지당 아이템 개수 (기본값: 8)
 */
export const fetchSsadcupListWithFilter = async (
  status,
  categoryId = null,
  page = 0,
  size = 8
) => {
  try {
    const response = await httpCommon.get(SSADCUP_END_POINT.LIST, {
      params: {
        status, // 상태 값 (0: 시작 전, 1: 진행 중, 2: 완료)
        categoryId: categoryId || undefined, // 카테고리 ID (선택)
        page, // 페이지 번호
        size, // 한 페이지에 가져올 데이터 수
        sort: 'startAt,desc', // 정렬 방식
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
 * 싸드컵 상세 조회
 */
export const fetchSsadcupDetail = async (sprintId) => {
  try {
    const response = await httpCommon.get(SSADCUP_END_POINT.DETAIL(sprintId))
    return response.data // API 응답 데이터를 반환
  } catch (error) {
    throw new Error('싸드컵 상세 정보를 불러오지 못했습니다.')
  }
}

/**
 * 싸드컵 참여 신청
 */
export const joinSsadcup = async (ssaldcupId, teamName) => {
  const response = await httpCommon.post(
    SSADCUP_END_POINT.JOIN(ssaldcupId),
    null,
    {
      params: { teamName },
    }
  )
  return response.data
}
