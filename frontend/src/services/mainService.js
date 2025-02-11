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
export const fetchLunchInfo = async () => {
  return httpCommon.get(MAIN_END_POINT.LUNCH_INFO)
}

// 싸밥(식단) 정보 조회 (GET 요청)
// 디버깅 코드1
// export const fetchLunchInfo = async () => {
//   try {
//     console.log('Fetching lunch info...')
//     const response = await axios.get(MAIN_END_POINT.LUNCH_INFO, {
//       headers: { 'Content-Type': 'application/json' },
//     })

//     // 서버 응답 데이터 변환
//     const todayMenus = response.data.filter((menu) => {
//       const menuDate = new Date(menu.day)
//       const today = new Date()
//       return menuDate.toDateString() === today.toDateString()
//     })
//     // 클라이언트가 기대하는 형식으로 변환
//     return {
//       date: new Date(todayMenus[0]?.day).toLocaleDateString(),
//       menu: todayMenus.map((menu) => ({
//         id: menu.id,
//         menuName: menu.menu_name,
//         imageUrl: menu.image_url,
//       })),
//     }
//   } catch (error) {
//     console.error('Lunch API Error:', error)
//     console.error('Error response:', error.response)
//     throw error
//   }
// }

// 싸밥(식단) 정보 조회 (GET 요청)
// 디버깅 코드2
// export const fetchLunchInfo = async () => {
//   try {
//     console.log('Fetching lunch info...')
//     console.log('Requesting URL:', MAIN_END_POINT.LUNCH_INFO) // 🔥 API URL 확인
//     const response = await httpCommon.get(MAIN_END_POINT.LUNCH_INFO, {
//       headers: { 'Content-Type': 'application/json' },
//     })

//     console.log('Lunch API Response:', response) // 응답을 로그로 확인

//     // 데이터가 올바른지 검증
//     if (!response.data || !response.data.menu) {
//       console.error('Invalid API response:', response.data)
//       throw new Error('API response is invalid')
//     }

//     return {
//       date: response.data.date,
//       menu: response.data.menu.map((menu, index) => ({
//         id: index + 1,
//         menuName: menu,
//         imageUrl: '', // 기본 이미지 URL 설정
//       })),
//     }
//   } catch (error) {
//     console.error('Lunch API Error:', error)
//     throw error
//   }
// }

// 싸밥 투표 (PATCH 요청, 토큰 필요) -> 토큰 제외하고 요청
// 기존 코드
export const fetchVoteLunch = async (lunchId) => {
  return httpCommon.patch(MAIN_END_POINT.LUNCH_VOTE, { lunch_id: lunchId })
}

// 싸밥 투표 (PATCH 요청, 토큰 필요) -> 토큰 제외하고 요청
// 디버깅 코드
// export const fetchVoteLunch = async (lunchId) => {
//   try {
//     console.log('Voting for lunch...', { lunch_id: lunchId })
//     const response = await axios.patch(
//       MAIN_END_POINT.LUNCH_VOTE,
//       { lunch_id: lunchId },
//       {
//         headers: { 'Content-Type': 'application/json' },
//       }
//     )
//     console.log('Vote API Response:', response)
//     return response.data
//   } catch (error) {
//     console.error('Vote API Error:', error)
//     console.error('Error response:', error.response)
//     throw error
//   }
// }

// 싸밥 투표 결과 조회 (GET 요청, 토큰 필요) -> 토큰 제외하고 요청
// 기존 코드
export const fetchLunchVoteResult = async () => {
  return httpCommon.get(MAIN_END_POINT.LUNCH_VOTE_RESULT)
}

// 싸밥 투표 결과 조회 (GET 요청, 토큰 필요) -> 토큰 제외하고 요청
// 디버깅 코드
// export const fetchLunchVoteResult = async () => {
//   try {
//     const response = await axios.get('/api/v1/vote/check-result', {
//       headers: { 'Content-Type': 'application/json' },
//     })
//     return response.data
//   } catch (error) {
//     console.error('Vote Result API Error:', error)
//     throw error
//   }
// }

// 싸밥 투표 결과 조회 (GET 요청, 토큰 필요) -> 토큰 제외하고 요청
// 디버깅 코드
// export const fetchLunchVoteResult = async () => {
//   try {
//     console.log('Fetching lunch vote results...')
//     const response = await httpCommon.get(MAIN_END_POINT.LUNCH_VOTE_RESULT, {
//       headers: { 'Content-Type': 'application/json' },
//     })

//     console.log('Vote Result API Response:', response.data)
//     return response.data
//   } catch (error) {
//     console.error('Vote Result API Error:', error)
//     throw error
//   }
// }

// AI 기사 목록 조회 (GET 요청, newId 필요, 토큰 필요) -> 토큰 제외하고 요청
export const fetchAiNews = async (newId) => {
  return httpCommon.get(MAIN_END_POINT.AI_NEWS(newId))
}
