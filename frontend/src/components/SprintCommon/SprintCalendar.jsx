import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import koLocale from '@fullcalendar/core/locales/ko'

const SsaprintCalendar = ({ events }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {/* 캘린더 헤더 */}
      <h2 className="text-base font-bold flex items-center gap-1 mb-3">
        나의 싸프린트 캘린더 📅
      </h2>

      {/* FullCalendar 적용 */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={koLocale}
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'next',
        }}
        height="auto"
        events={events}
        dayHeaderClassNames="bg-gray-100 text-sm py-2 font-semibold"
        buttonText={{
          prev: '<',
          next: '>',
        }}
        dayHeaderContent={({ date }) => {
          const day = date.getDay()
          return (
            <span
              className={`text-xs font-medium ${day === 0 ? 'text-red-500' : day === 6 ? 'text-blue-500' : ''}`}
            >
              {date.toLocaleDateString('ko-KR', { weekday: 'short' })}
            </span>
          )
        }}
        eventContent={(eventInfo) => (
          <div
            className={`px-2 py-1 text-xs rounded-md shadow-sm bg-white border ${eventInfo.event.extendedProps.className}`}
          >
            {eventInfo.event.title}
          </div>
        )}
      />
    </div>
  )
}

export default SsaprintCalendar
