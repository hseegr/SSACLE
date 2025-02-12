import { useState, useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { ChevronLeft, ChevronRight } from 'lucide-react' // 아이콘 사용

const SprintCalendar = ({ sprint }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 })
  const calendarRef = useRef(null) // 📌 캘린더 전체 컨테이너 참조

  // 📌 sprint 데이터를 기반으로 events 생성
  useEffect(() => {
    if (!sprint) return

    let sprintEvents = []

    // ✅ 스프린트 일정 추가 (priority: 1)
    if (sprint.sprint?.startAt && sprint.sprint?.endAt) {
      sprintEvents.push({
        id: 'sprint',
        title: `🚀 ${sprint.sprint.name}`,
        start: sprint.sprint.startAt,
        end: sprint.sprint.endAt,
        color: '#5195F7',
        priority: 1, // 스프린트 일정이 가장 위
      })
    }

    // ✅ 발표 일정 추가 (priority: 2)
    if (sprint.sprint?.announceAt) {
      sprintEvents.push({
        id: 'announce',
        title: '📢 발표 & 질문/답변 세션',
        start: sprint.sprint.announceAt,
        color: '#E5F0FF',
        textColor: '#242424',
        extendedProps: { shadow: true },
        priority: 2, // 발표 일정이 두 번째
      })
    }

    // ✅ 일기 일정 추가 (priority: 3)
    if (sprint.diary?.length) {
      sprint.diary.forEach((entry, index) => {
        sprintEvents.push({
          id: `diary-${index}`,
          title: `📝 ${entry.name}`,
          start: entry.date,
          color: '#FFFFFF',
          textColor: '#242424',
          extendedProps: { shadow: true },
          priority: 3, // 일기 일정이 가장 마지막
        })
      })
    }

    // ✅ 정렬 (스프린트 > 발표 > 일기 순서 유지)
    sprintEvents = sprintEvents.sort((a, b) => a.priority - b.priority)

    setEvents(sprintEvents)
  }, [sprint])

  // ✅ 툴팁 표시 함수 (스프린트 일정 및 "+ more" 버튼 제외)
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

  // ✅ 툴팁 숨기기 함수
  const hideTooltip = () => {
    setTooltip({ show: false, text: '', x: 0, y: 0 })
  }

  return (
    <div ref={calendarRef} className="w-full bg-white p-1 relative">
      <h2 className="text-lg font-bold mb-4">나의 싸프린트 캘린더 📅</h2>
      <div className="flex justify-between items-center mb-4">
        {/* 🔹 이전 달 버튼 */}
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

        {/* 🔹 다음 달 버튼 */}
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
        key={currentDate.toISOString()} // ✅ 상태가 바뀔 때마다 강제 리렌더링
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={false}
        initialDate={currentDate}
        locale="ko"
        dayMaxEventRows={true}
        contentHeight={700}
        eventOrder="priority" // ✅ 이벤트 정렬 우선순위 지정
        events={events}
        dayHeaderContent={(info) => {
          const dayNames = ['일', '월', '화', '수', '목', '금', '토']
          return (
            <span
              className={`text-sm font-medium ${
                info.date.getDay() === 0
                  ? 'text-red-500'
                  : info.date.getDay() === 6
                    ? 'text-blue-500'
                    : 'text-gray-900'
              }`}
            >
              {dayNames[info.date.getDay()]}
            </span>
          )
        }}
        dayCellContent={(info) => {
          const day = info.date.getDay()
          let textColor = 'text-gray-900 p-1'
          if (day === 0) textColor = 'text-red-500' // 일요일 빨간색
          if (day === 6) textColor = 'text-blue-500' // 토요일 파란색

          return (
            <div className={`text-sm ${textColor}`}>{info.date.getDate()}</div>
          )
        }}
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

      {/* ✅ 툴팁 UI */}
      {tooltip.show && (
        <div
          className="absolute bg-white text-gray-800 text-sm px-3 py-2 rounded-md shadow-lg border border-gray-300"
          style={{
            top: tooltip.y,
            left: tooltip.x,
            whiteSpace: 'nowrap',
            zIndex: 50,
            transform: 'translateY(5px)', // 📌 살짝 아래 정렬
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  )
}

export default SprintCalendar
