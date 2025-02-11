import { FaRocket, FaUsers, FaCalendarAlt } from 'react-icons/fa'
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

  return (
    <div className="p-4 bg-white rounded-lg flex flex-col gap-2">
      {/* 진행 기간 */}
      <div className="flex items-center gap-2 text-[11px] text-gray-700">
        <FaCalendarAlt className="text-gray-500 text-[13px]" />
        <span className="font-bold text-gray-900">진행 기간</span>
        <span>
          {startDate.format('YYYY년 M월 D일')} ~ {endDate.format('M월 D일')}
        </span>
        <span className="px-2 py-[1px] bg-green-100 text-green-700 text-[10px] rounded-md font-bold">
          {totalDays}일
        </span>
      </div>

      {/* 참여 인원 */}
      <div className="flex items-center gap-2 text-[11px] text-gray-700">
        <FaUsers className="text-gray-500 text-[13px]" />
        <span className="font-bold text-gray-900">참여 인원</span>
        <span>{sprint.sprint.currentMembers}명</span>
      </div>

      {/* 현재 상태 + 진행 바 */}
      <div className="flex items-center gap-2 text-[11px] text-gray-700">
        <FaRocket className="text-red-500 text-[13px]" />
        <span className="font-bold text-gray-900">현재 상태</span>
        <span className="text-gray-800">참여 중</span>

        {/* DAY X */}
        <div className="flex items-center gap-1 ml-3">
          <span className="text-blue-600 font-semibold text-[11px]">
            DAY {currentDay}
          </span>
          <div className="w-[80px] bg-gray-300 rounded-sm h-[8px] relative">
            <div
              className="bg-blue-500 h-[8px] rounded-sm transition-all"
              style={{ width: `${(currentDay / totalDays) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SprintProgressStatus
