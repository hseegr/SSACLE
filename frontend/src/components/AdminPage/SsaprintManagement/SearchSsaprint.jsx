// 싸프린트 전체 조회 데이터 가공

import dayjs from 'dayjs'

// ✅ '학습 내용: ' 텍스트 제거
export const cleanDescription = (description) => {
  return description.replace(/^학습 내용:\s*/, '')
}

// ✅ 날짜 포맷 변경 (2025-02-21T09:13:31.301617 → 2025-02-21 09:13)
export const formatDate = (isoString) => {
  return dayjs(isoString).format('YYYY-MM-DD HH:mm')
}

// ✅ 현재 상태 계산 (현재 날짜 기준으로 상태 결정)
export const getStatus = (startAt, endAt) => {
  const now = dayjs()
  const startDate = dayjs(startAt)
  const endDate = dayjs(endAt)

  if (now.isBefore(startDate)) return '모집 중'
  if (now.isBetween(startDate, endDate, 'minute', '[]')) return '진행 중' // 시작일과 종료일 포함
  return '진행 완료'
}
