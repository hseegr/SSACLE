import { useState, useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { ChevronLeft, ChevronRight } from 'lucide-react' // 아이콘 사용
import SprintDiaryModal from './SprintDiaryModal'
import { fetchDiaryDetail } from '@/services/ssaprintService' // API 호출 함수

const SprintCalendar = ({ sprint, diaries }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [selectedDiary, setSelectedDiary] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 })
  const calendarRef = useRef(null) // 캘린더 전체 컨테이너 참조

  // sprint 데이터를 기반으로 events 생성
  useEffect(() => {
    if (!sprint) return

    let sprintEvents = []

    // 스프린트 일정 추가 (priority: 1)
    if (sprint?.startAt && sprint?.endAt) {
      sprintEvents.push({
        id: 'sprint',
        title: `🚀 ${sprint.name}`,
        start: sprint.startAt,
        end: sprint.endAt,
        color: '#5195F7',
        priority: 1,
      })
    }

    // 발표 일정 추가 (priority: 2)
    if (sprint?.announceAt) {
      sprintEvents.push({
        id: 'announce',
        title: '📢 발표 & 질문/답변 세션',
        start: sprint.announceAt,
        color: '#E5F0FF',
        textColor: '#242424',
        extendedProps: { shadow: true },
        priority: 2,
      })
    }

    // 일기 일정 추가 (priority: 3)
    if (diaries?.length) {
      diaries.forEach((diary) => {
        diary.contents.forEach((entry) => {
          sprintEvents.push({
            id: `diary-${entry.id}`,
            title: `📝 ${entry.name}`,
            start: diary.date,
            color: '#FFFFFF',
            textColor: '#242424',
            extendedProps: {
              shadow: true, // 그림자 효과 유지
              diaryId: entry.id, // 일기 ID 추가
            },
            priority: 3,
          })
        })
      })
    }

    // 정렬 (스프린트 > 발표 > 일기 순서 유지)
    sprintEvents = sprintEvents.sort((a, b) => a.priority - b.priority)
    setEvents(sprintEvents)
  }, [sprint, diaries])

  // 특정 다이어리 상세 조회 API 호출 후 모달 표시
  const handleEventClick = async (eventInfo) => {
    const { extendedProps } = eventInfo.event
    if (extendedProps.diaryId) {
      try {
        const diaryData = await fetchDiaryDetail(extendedProps.diaryId)
        setSelectedDiary(diaryData)
        setIsModalOpen(true)
      } catch (error) {
        alert('❌ 다이어리 정보를 불러오지 못했습니다. 다시 시도해주세요.')
      }
    }
  }

  // 툴팁 표시 함수 (스프린트 일정 및 "+ more" 버튼 제외)
  const showTooltip = (event, text, eventId) => {
    if (
      !calendarRef.current ||
      eventId === 'sprint' ||
      event.target.closest('.fc-more') ||
      event.target.closest('.fc-popover')
    )
      return

    const eventBox = event.target.getBoundingClientRect()
    const calendarBox = calendarRef.current.getBoundingClientRect()

    setTooltip({
      show: true,
      text,
      x: eventBox.left - calendarBox.left,
      y: eventBox.top - calendarBox.top + eventBox.height + 5,
    })
  }

  // 툴팁 숨기기 함수
  const hideTooltip = () => {
    setTooltip({ show: false, text: '', x: 0, y: 0 })
  }

  return (
    <div ref={calendarRef} className="w-full bg-white p-1 relative">
      <h2 className="text-lg font-bold mb-4">나의 싸프린트 캘린더 📅</h2>
      <div className="flex justify-between items-center mb-4">
        {/* 이전 달 버튼 */}
        <button
          onClick={() =>
            setCurrentDate((prevDate) => {
              const newDate = new Date(prevDate)
              newDate.setMonth(newDate.getMonth() - 1)
              return newDate
            })
          }
          className="flex items-center justify-center w-7 h-7 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 transition"
        >
          <ChevronLeft size={16} className="text-gray-500" />
        </button>

        <h2 className="text-xl font-semibold">
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </h2>

        {/* 다음 달 버튼 */}
        <button
          onClick={() =>
            setCurrentDate((prevDate) => {
              const newDate = new Date(prevDate)
              newDate.setMonth(newDate.getMonth() + 1)
              return newDate
            })
          }
          className="flex items-center justify-center w-7 h-7 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 transition"
        >
          <ChevronRight size={16} className="text-gray-500" />
        </button>
      </div>

      <FullCalendar
        key={currentDate.toISOString()}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={false}
        initialDate={currentDate}
        locale="ko"
        dayMaxEventRows={true}
        contentHeight={700}
        eventOrder="priority"
        events={events}
        eventClick={handleEventClick}
        eventContent={(eventInfo) => {
          const { title, extendedProps, id } = eventInfo.event
          return (
            <div
              className={`text-sm px-2 py-1 rounded-md w-full block transition-all ${
                extendedProps.shadow
                  ? 'shadow-md border border-gray-300 hover:shadow-lg hover:bg-gray-100'
                  : ''
              }`}
              style={{
                backgroundColor: eventInfo.event.backgroundColor,
                color: eventInfo.event.textColor || '#fff',
                textAlign: 'left',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
              onMouseEnter={(e) => showTooltip(e, title, id)}
              onMouseLeave={hideTooltip}
            >
              {title}
            </div>
          )
        }}
      />

      {/* 툴팁 UI */}
      {tooltip.show && (
        <div
          className="absolute bg-white text-gray-800 text-sm px-3 py-2 rounded-md shadow-lg border border-gray-300"
          style={{
            top: tooltip.y,
            left: tooltip.x,
            whiteSpace: 'nowrap',
            zIndex: 50,
            transform: 'translateY(5px)',
          }}
        >
          {tooltip.text}
        </div>
      )}

      {/* 모달 UI */}
      <SprintDiaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        diary={selectedDiary}
      />
    </div>
  )
}

export default SprintCalendar
