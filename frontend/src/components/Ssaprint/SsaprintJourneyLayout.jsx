import SprintProgressStatus from '@/components/SprintCommon/SprintProgressStatus'
import JoinSprintInfo from '@/components/SprintCommon/JoinSprintInfo'
import SprintDetail from '@/components/SprintCommon/SprintDetail'
import SprintToDoList from '@/components/SprintCommon/SprintToDoList'
import SprintPresentationSession from '@/components/SprintCommon/SprintPresentationSession'
import SprintCalendar from '@/components/SprintCommon/SprintCalendar'
import { useState } from 'react'

const SsaprintJourneyLayout = ({ sprint }) => {
  const [isOpen, setIsOpen] = useState(false)

  const benefits = [
    '📄 이전 참가자들의 노트 열람 가능 (총 10개 노트)',
    '🏅 우수 발표자 선정 시 100 피클 지급',
  ]

  if (!sprint) return null

  // ✅ 스프린트 진행 기간(파란색 바)
  const sprintPeriodEvent = {
    title: 'Sprint 진행 기간',
    start: sprint.sprint.startAt.split('T')[0],
    end: sprint.sprint.endAt.split('T')[0],
    className: 'bg-blue-400 text-white font-bold px-3 py-1 rounded-md',
  }

  // ✅ 일기 일정 변환
  const diaryEvents = sprint.diary.map((entry) => ({
    title: `📖 ${entry.name}`,
    start: entry.date,
    className: 'border border-gray-300 shadow-md',
  }))

  // ✅ 발표 일정 추가
  const presentationEvent = {
    title: '🎤 싸프린트 발표 & Q&A',
    start: sprint.sprint.announceAt.split('T')[0],
    className: 'border border-gray-300 shadow-md',
  }

  // ✅ 최종 캘린더 일정 (스프린트 기간 + 일기 + 발표)
  const calendarEvents = [sprintPeriodEvent, ...diaryEvents, presentationEvent]

  return (
    <div className="mt-16 flex flex-col gap-4 items-start w-full px-0">
      {/* 첫 번째 줄 - JoinSprintInfo + SprintProgressStatus */}
      <div className="flex flex-col lg:flex-row w-full gap-6">
        {/* 왼쪽 영역 - JoinSprintInfo + SprintDetail */}
        <div className="flex-1 min-w-[60%]">
          <JoinSprintInfo
            sprint={sprint}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
          {isOpen && (
            <SprintDetail sprint={sprint.sprint} benefits={benefits} />
          )}
        </div>

        {/* 오른쪽 영역 - SprintProgressStatus */}
        <div className="w-full lg:w-[27%] flex flex-col">
          <div className="mb-10">
            {/* 여기에 '내 노트 공개' 토글 컴포넌트 추가 예정 */}
          </div>

          <div className="mt-10">
            <SprintProgressStatus sprint={sprint} />
          </div>

          <div className="mt-6">
            {/* 여기에 '싸프린트 학습 노트 열기' 버튼 추가 예정 */}
          </div>
        </div>
      </div>

      {/* ✅ 두꺼운 구분선 추가 */}
      <div className="border-t-4 border-gray-200 w-full"></div>

      {/* 두 번째 줄 - 캘린더 + To-Do List */}
      <div className="flex w-full gap-5">
        {/* 캘린더 */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-4">
          <SprintCalendar events={calendarEvents} />
        </div>

        {/* To-Do 리스트 */}
        <div className="lg:w-[26%]">
          <SprintPresentationSession sprint={sprint} />
          <div className="mt-6">
            <SprintToDoList todos={sprint.todos} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SsaprintJourneyLayout
