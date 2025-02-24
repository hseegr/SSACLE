// noteService.js
import httpCommon from './http-common'
import { NOTE_END_POINT } from './endPoints'

export const fetchNoteList = async (page = 0, size = 10) => {
  try {
    const response = await httpCommon.get('/teams/diaries', {
      params: {
        page,
        size,
        sort: 'startAt,desc', // 정렬 파라미터 수정
      },
      paramsSerializer: {
        encode: (param) => param, // 파라미터 인코딩 방지
      },
    })

    console.log('Note API Request:', {
      url: response.config.url,
      params: response.config.params,
    })

    return response.data
  } catch (error) {
    console.error('노트 목록 조회 실패:', error)
    throw error
  }
}

// 노트 구매
export const fetchPurchaseNote = async (teamId) => {
  try {
    const response = await httpCommon.post(NOTE_END_POINT.PURCHASE(teamId))
    return response.data.notionUrl
  } catch (error) {
    console.error('노트 구매 실패:', error)
    throw error
  }
}
