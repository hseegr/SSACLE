// @ts-nocheck
import { FaRocket, FaUsers, FaCalendarAlt } from 'react-icons/fa'
import dayjs from 'dayjs'

const SprintProgressStatus = ({ sprint }) => {
  if (!sprint) return null

  // 날짜 데이터 처리
  const startDate = dayjs(sprint.startAt).startOf('day')
  const endDate = dayjs(sprint.endAt).startOf('day')
  const today = dayjs().startOf('day') // 오늘 날짜 00:00 기준
  const totalDays = endDate.diff(startDate, 'day') + 1
  const currentDay = today.isBefore(startDate)
    ? 0
    : today.isAfter(endDate)
      ? totalDays
      : today.diff(startDate, 'day') + 1

  // 스프린트 상태 확인
  const statusMap = {
    0: { label: '시작 전', color: 'text-gray-600', iconColor: 'text-gray-500' },
    1: { label: '참여 중', color: 'text-gray-800', iconColor: 'text-red-500' },
    2: {
      label: '수료 완료',
      color: 'text-green-700',
      iconColor: 'text-green-500',
    },
  }

  const sprintStatus = statusMap[sprint.status] || statusMap[1] // 기본값: 참여 중
  const hideProgressBar = sprint.status === 0 || sprint.status === 2 // 시작 전 or 수료 완료면 진행 바 숨기기

  return (
    <div className="p-2 bg-white rounded-lg flex flex-col gap-2">
      {/* 진행 기간 */}
      <div className="flex items-center gap-2 text-xs text-gray-700">
        <FaCalendarAlt className="text-gray-500 text-sm" />
        <span className="font-bold text-gray-900">진행 기간</span>
        <span>
          {startDate.format('YYYY년 M월 D일')} ~{' '}
          {endDate.format('YYYY년 M월 D일')}
        </span>
        <span className="px-2 py-[1px] bg-green-100 text-green-700 text-[10px] rounded-md font-bold">
          {totalDays}일
        </span>
      </div>

      {/* 참여 인원 */}
      <div className="flex items-center gap-2 text-xs text-gray-700 mt-2">
        <FaUsers className="text-gray-500 text-sm" />
        <span className="font-bold text-gray-900">참여 인원</span>
        <span>{sprint.currentMembers}명</span>
      </div>

      {/* 현재 상태 및 진행 바 (한 줄 배치) */}
      <div className="flex items-center gap-4 text-xs text-gray-700 mt-2">
        {/* 현재 상태 */}
        <div className="flex items-center gap-2">
          <FaRocket className={`${sprintStatus.iconColor} text-sm`} />
          <span className="font-bold text-gray-900">현재 상태</span>
          <span className={sprintStatus.color}>{sprintStatus.label}</span>
        </div>

        {/* 진행 바 */}
        {!hideProgressBar && (
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-semibold text-xs">
              DAY {currentDay}
            </span>
            <div className="w-[128px] bg-gray-300 rounded-sm h-[8px] relative">
              <div
                className="bg-blue-500 h-[8px] rounded-sm transition-all"
                style={{ width: `${(currentDay / totalDays) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SprintProgressStatus
