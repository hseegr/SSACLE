import httpCommon from './http-common'
import { MAIN_END_POINT } from './endPoints'
import axios from 'axios'

// 로그인 중인 사용자 기본 정보 조회 (GET 요청, userId 필요)
export const fetchUserInfo = async () => {
  const response = await httpCommon.get(MAIN_END_POINT.USER_INFO)
  return response.data
}

// 참여 중인 싸프린트, 싸드컵 리스트 조회 (GET 요청)
export const fetchNowMySsaprint = async () => {
  const response = await httpCommon.get(MAIN_END_POINT.NOW_MYSSAPRINT)
  return response.data
}

// 관심사 기반 싸프린트 리스트 조회 (POST 요청)
export const fetchSsaprintList = async () => {
  return httpCommon.post(MAIN_END_POINT.SSAPRINT_LIST)
}

// 관심사 기반 싸드컵 리스트 조회 (POST 요청)
export const fetchSsadcupList = async () => {
  return httpCommon.post(MAIN_END_POINT.SSADCUP_LIST)
}

// 싸밥(식단) 정보 조회 (GET 요청)
// 기존 코드
// export const fetchLunchInfo = async () => {
//   return httpCommon.get(MAIN_END_POINT.LUNCH_INFO)
// }

// 싸밥(식단) 정보 조회 (GET 요청)
export const fetchLunchInfo = async () => {
  try {
    const response = await httpCommon.get(MAIN_END_POINT.LUNCH_INFO)
    return response.data
  } catch (error) {
    console.error('식단 정보 조회 실패:', error)
    throw error
  }
}

// 싸밥 투표 (PATCH 요청, 토큰 필요) -> 토큰 제외하고 요청
// 기존 코드
// export const fetchVoteLunch = async (lunchId) => {
//   return httpCommon.patch(MAIN_END_POINT.LUNCH_VOTE, { lunch_id: lunchId })
// }

// 싸밥 투표 (POST 요청, 토큰 필요) -> 토큰 제외하고 요청
export const fetchVoteLunch = async (lunchId) => {
  try {
    const response = await httpCommon.post(MAIN_END_POINT.LUNCH_VOTE, {
      lunchId,
    })
    return response.data
  } catch (error) {
    console.error('투표 실패:', error)
    throw error
  }
}

// 싸밥 투표 결과 조회 (GET 요청, 토큰 필요) -> 토큰 제외하고 요청
// 기존 코드
// export const fetchLunchVoteResult = async () => {
//   return httpCommon.get(MAIN_END_POINT.LUNCH_VOTE_RESULT)
// }

// AI 기사 목록 조회 (GET 요청, newId 필요, 토큰 필요) -> 토큰 제외하고 요청
// 기존 코드
// export const fetchAiNews = async () => {
//   const response = httpCommon.get(MAIN_END_POINT.AI_NEWS)

//   return response.data
// }

// AI 기사 목록 조회
export const fetchAiNews = async () => {
  try {
    // 기본 newId를 1로 설정
    const response = await httpCommon.get(MAIN_END_POINT.AI_NEWS)
    return response.data
  } catch (error) {
    console.error('AI News Error:', error)
    throw error
  }
}
