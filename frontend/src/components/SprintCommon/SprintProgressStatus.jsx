import { FaRocket, FaUsers, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa'
import dayjs from 'dayjs'

const SprintProgressStatus = ({ sprint }) => {
  if (!sprint) return null

  // 날짜 데이터 처리
  const startDate = dayjs(sprint.sprint.startAt)
  const endDate = dayjs(sprint.sprint.endAt)
  const today = dayjs()
  const totalDays = endDate.diff(startDate, 'day') + 1
  const currentDay = today.isBefore(startDate)
    ? 0
    : today.isAfter(endDate)
      ? totalDays
      : today.diff(startDate, 'day') + 1

  const isCompleted = currentDay > totalDays

  return (
    <div className="p-4 bg-white rounded-lg flex flex-col gap-3">
      {/* 진행 기간 */}
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <FaCalendarAlt className="text-gray-500" />
        <span className="font-medium">진행 기간</span>
        <span>
          {startDate.format('YYYY년 M월 D일')} ~ {endDate.format('M월 D일')}
        </span>
        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-lg">
          {totalDays}일
        </span>
      </div>

      {/* 참여 인원 */}
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <FaUsers className="text-gray-500" />
        <span className="font-medium">참여 인원</span>
        <span>
          {sprint.sprint.currentMembers}명 / {sprint.sprint.maxMembers}명
        </span>
      </div>

      {/* 현재 상태 */}
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <FaRocket className="text-red-500" />
        <span className="font-medium">현재 상태</span>
        {isCompleted ? (
          <>
            <span className="text-gray-800">수료 완료</span>
            <FaCheckCircle className="text-yellow-500 text-lg" />
          </>
        ) : (
          <>
            <span className="text-gray-800">참여 중</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-lg">
              DAY {currentDay}
            </span>
          </>
        )}
      </div>

      {/* 진행 바 */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all"
          style={{ width: `${(currentDay / totalDays) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}

export default SprintProgressStatus
