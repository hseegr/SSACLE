import httpCommon from './http-common'
import { MAIN_END_POINT } from './endPoints'
import axios from 'axios'

// 로그인 중인 사용자 기본 정보 조회 (GET 요청, userId 필요)
export const fetchUserInfo = async (userId) => {
  return httpCommon.get(MAIN_END_POINT.USER_INFO(userId))
}

// 참여 중인 싸프린트, 싸드컵 리스트 조회 (GET 요청)
export const fetchNowMySsaprint = async () => {
  return httpCommon.get(MAIN_END_POINT.NOW_MYSSAPRINT)
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
    console.log('Fetching lunch info...')
    console.log('Token:', localStorage.getItem('accessToken')) // 토큰 확인

    const response = await httpCommon.get(MAIN_END_POINT.LUNCH_INFO)
    console.log('Response:', response)

    return response.data
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    })
    throw error
  }
}

// 싸밥 투표 (PATCH 요청, 토큰 필요) -> 토큰 제외하고 요청
// 기존 코드
// export const fetchVoteLunch = async (lunchId) => {
//   return httpCommon.patch(MAIN_END_POINT.LUNCH_VOTE, { lunch_id: lunchId })
// }

// 싸밥 투표 (PATCH 요청, 토큰 필요) -> 토큰 제외하고 요청
export const fetchVoteLunch = async (lunchId) => {
  try {
    console.log('Voting for lunch...', { lunch_id: lunchId })
    const response = await httpCommon.patch(
      MAIN_END_POINT.LUNCH_VOTE,
      { lunch_id: lunchId },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
    console.log('Vote API Response:', response)
    return response.data
  } catch (error) {
    console.error('Vote API Error:', error)
    console.error('Error response:', error.response)
    throw error
  }
}

// 싸밥 투표 결과 조회 (GET 요청, 토큰 필요) -> 토큰 제외하고 요청
// 기존 코드
// export const fetchLunchVoteResult = async () => {
//   return httpCommon.get(MAIN_END_POINT.LUNCH_VOTE_RESULT)
// }

// 싸밥 투표 결과 조회 (GET 요청, 토큰 필요) -> 토큰 제외하고 요청
export const fetchLunchVoteResult = async () => {
  try {
    const response = await httpCommon.get('/api/v1/vote/check-result', {
      headers: { 'Content-Type': 'application/json' },
    })
    return response.data
  } catch (error) {
    console.error('Vote Result API Error:', error)
    throw error
  }
}

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
