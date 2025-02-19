import { PRESENTATION_END_POINT } from '@/services/endPoints'
import axios from './http-common'

// ssaprint 별 QuestionCard 조회
export const fetchQuestionCards = async (sprintId: string) => {
  const response = await axios.get(
    PRESENTATION_END_POINT.QUESTION_CARDS(sprintId)
  )
  return response.data
}

// 특정 질문 카드 조회
export const fetchQuestionCard = async (
  sprintId: string,
  questionCardId: string
) => {
  const response = await axios.get(
    PRESENTATION_END_POINT.QUESTION_CARD(sprintId, questionCardId)
  )
  return response.data
}

type CalculateFinalScoreRequest = [
  {
    sprintId: number
    teamId: number
    judgeScore: number
  },
]

// 발표 최종 점수 계산
export const fetchCalculateFinalScore = async (
  body: CalculateFinalScoreRequest
) => {
  const response = await axios.post(
    PRESENTATION_END_POINT.CALCULATE_SCORE,
    body
  )
  return response.data
}

// 발표 상태 업데이트
export const fetchUpdatePresentationStatus = async (sprintId: string) => {
  const response = await axios.post(
    PRESENTATION_END_POINT.PRESENTATION_STATUS(sprintId)
  )
  return response.data
}

// 발표 참가자 목록 조회
export const fetchPresentationParticipants = async (sprintId: string) => {
  const response = await axios.get(
    PRESENTATION_END_POINT.PRESENTATION_PARTICIPANTS(sprintId)
  )
  return response.data
}

// 발표 참가 가능 여부 확인인
export const fetchPresentationAvailability = async (sprintId: string) => {
  const response = await axios.get(
    PRESENTATION_END_POINT.PRESENTATION_AVAILABILITY(sprintId)
  )
  return response.data
}
